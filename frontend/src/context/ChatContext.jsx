import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { voiceService } from '../services/voiceService.js';
import { chatService } from '../services/chatService.js';

const ChatContext = createContext(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // Preferences persisted in localStorage
  const [language, setLanguageState] = useState(() => localStorage.getItem('vaani_lang') || 'indic-auto');
  const [voice, setVoiceState] = useState(() => localStorage.getItem('vaani_voice') || 'Shivani');
  const [autoPlayVoice, setAutoPlayVoiceState] = useState(() => localStorage.getItem('vaani_autoplay') !== 'false');
  const [voiceSpeed, setVoiceSpeedState] = useState(() => Number(localStorage.getItem('vaani_speed')) || 1.0);

  // Conversation state
  const [conversationId, setConversationId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Pipeline processing & UI indicators
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('idle'); // 'idle' | 'transcribing' | 'thinking' | 'synthesizing' | 'speaking'
  const [transcriptionPreview, setTranscriptionPreview] = useState(null);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  const [error, setError] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  const audioPlayerRef = useRef(null);

  // Setters with localStorage persistence
  const setLanguage = (newLang) => {
    setLanguageState(newLang);
    localStorage.setItem('vaani_lang', newLang);
  };

  const setVoice = (newVoice) => {
    setVoiceState(newVoice);
    localStorage.setItem('vaani_voice', newVoice);
  };

  const setAutoPlayVoice = (val) => {
    setAutoPlayVoiceState(val);
    localStorage.setItem('vaani_autoplay', val);
  };

  const setVoiceSpeed = (spd) => {
    setVoiceSpeedState(spd);
    localStorage.setItem('vaani_speed', spd);
  };

  // Refresh conversation list from backend
  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      if (data?.conversations) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.warn('Could not load conversations from server:', err.message);
    }
  }, []);

  // Check health and connectivity
  const checkHealth = useCallback(async () => {
    try {
      const health = await chatService.getHealth();
      setSystemHealth(health);
    } catch (err) {
      console.warn('Health check failed:', err.message);
    }
  }, []);

  useEffect(() => {
    loadConversations();
    checkHealth();
  }, [loadConversations, checkHealth]);

  // Load specific conversation
  const selectConversation = async (id) => {
    try {
      setError(null);
      const data = await chatService.getConversation(id);
      if (data?.conversation) {
        setConversationId(data.conversation.conversationId);
        setMessages(data.conversation.messages || []);
        if (data.conversation.language) {
          setLanguage(data.conversation.language);
        }
      }
    } catch (err) {
      setError(`Failed to load conversation: ${err.message}`);
    }
  };

  // Start fresh conversation
  const startNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    setConversationId(newId);
    setMessages([]);
    setTranscriptionPreview(null);
    setError(null);
  };

  // Delete conversation
  const deleteConversation = async (id) => {
    try {
      await chatService.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.conversationId !== id));
      if (conversationId === id) {
        startNewConversation();
      }
    } catch (err) {
      setError(`Failed to delete conversation: ${err.message}`);
    }
  };

  // Clear all conversations
  const clearAllConversations = async () => {
    try {
      await chatService.clearAllConversations();
      setConversations([]);
      startNewConversation();
    } catch (err) {
      setError(`Failed to clear conversations: ${err.message}`);
    }
  };

  // Play audio safely
  const playAudio = (audioUrl, messageId = null) => {
    if (!audioUrl) return;

    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }

    const audio = new Audio(audioUrl);
    audio.playbackRate = voiceSpeed;
    audioPlayerRef.current = audio;
    setCurrentlyPlayingId(messageId);
    setProcessingStage('speaking');

    audio.onended = () => {
      setCurrentlyPlayingId(null);
      setProcessingStage('idle');
      audioPlayerRef.current = null;
    };

    audio.onerror = (e) => {
      console.warn('Audio playback error:', e);
      setCurrentlyPlayingId(null);
      setProcessingStage('idle');
      audioPlayerRef.current = null;
    };

    audio.play().catch(err => {
      console.warn('Audio auto-play blocked by browser or failed:', err);
      setCurrentlyPlayingId(null);
      setProcessingStage('idle');
    });
  };

  // Stop currently playing audio
  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    setCurrentlyPlayingId(null);
    if (processingStage === 'speaking') {
      setProcessingStage('idle');
    }
  };

  // Synthesize and play on demand (e.g. user clicks "Listen" on an assistant message)
  const synthesizeAndPlay = async (msgId, text) => {
    try {
      stopAudio();
      setProcessingStage('synthesizing');

      const synth = await voiceService.synthesizeSpeech({
        text,
        voice,
        language,
        speed: voiceSpeed,
      });

      // Update message audioUrl in state
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, audioUrl: synth.audioUrl } : m));

      playAudio(synth.audioUrl, msgId);
    } catch (err) {
      setError(`Voice synthesis failed: ${err.message}`);
      setProcessingStage('idle');
    }
  };

  // Send typed text message
  const sendTextMessage = async (text) => {
    if (!text || text.trim() === '' || isProcessing) return;

    const activeConvId = conversationId || `conv-${Date.now()}`;
    if (!conversationId) setConversationId(activeConvId);

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      language,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setProcessingStage('thinking');
    setError(null);

    try {
      // Call reasoning engine
      const chatRes = await chatService.sendMessage({
        message: text.trim(),
        conversationId: activeConvId,
        language,
        preferredLanguage: language
      });

      const assistantMessage = chatRes.message || {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: chatRes.response,
        language,
        metadata: {
          provider: chatRes.provider,
          latency: chatRes.latency
        },
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If autoplay voice is enabled, synthesize response
      if (autoPlayVoice && assistantMessage.text) {
        setProcessingStage('synthesizing');
        try {
          const synth = await voiceService.synthesizeSpeech({
            text: assistantMessage.text,
            voice,
            language,
            speed: voiceSpeed,
          });

          assistantMessage.audioUrl = synth.audioUrl;
          setMessages(prev => prev.map(m => m.id === assistantMessage.id ? { ...m, audioUrl: synth.audioUrl } : m));
          playAudio(synth.audioUrl, assistantMessage.id);
        } catch (synthErr) {
          console.warn('TTS auto-synthesis notice:', synthErr.message);
          // Don't break conversation if TTS key is missing or fails
        }
      }

      setProcessingStage('idle');
      loadConversations();
    } catch (err) {
      setError(`Message failed: ${err.message}`);
      setProcessingStage('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  // Send recorded audio speech
  const sendAudioRecording = async (audioBlob) => {
    if (!audioBlob || isProcessing) return;

    const activeConvId = conversationId || `conv-${Date.now()}`;
    if (!conversationId) setConversationId(activeConvId);

    setIsProcessing(true);
    setProcessingStage('transcribing');
    setError(null);
    setTranscriptionPreview(null);

    try {
      // 1. Transcribe audio with Gnani Prisma
      const sttResult = await voiceService.transcribeAudio(audioBlob, language);

      const transcribedText = sttResult.transcript;
      if (!transcribedText || transcribedText.trim() === '') {
        throw new Error('No speech was detected in your recording. Please try speaking closer to the microphone.');
      }

      setTranscriptionPreview(transcribedText);

      // Add user speech to chat
      const userMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: transcribedText,
        language: sttResult.detected_language_code || language,
        metadata: {
          model: sttResult.model,
          latency: sttResult.end_to_end_latency
        },
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      setProcessingStage('thinking');

      // 2. Reason with AI Reasoning Engine
      const chatRes = await chatService.sendMessage({
        message: transcribedText,
        conversationId: activeConvId,
        language: sttResult.detected_language_code || language,
        preferredLanguage: language
      });

      const assistantMessage = chatRes.message || {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: chatRes.response,
        language,
        metadata: {
          provider: chatRes.provider,
          latency: chatRes.latency
        },
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // 3. Synthesize speech with Gnani Timbre
      if (autoPlayVoice && assistantMessage.text) {
        setProcessingStage('synthesizing');
        try {
          const synth = await voiceService.synthesizeSpeech({
            text: assistantMessage.text,
            voice,
            language: sttResult.detected_language_code || language,
            speed: voiceSpeed,
          });

          assistantMessage.audioUrl = synth.audioUrl;
          setMessages(prev => prev.map(m => m.id === assistantMessage.id ? { ...m, audioUrl: synth.audioUrl } : m));
          playAudio(synth.audioUrl, assistantMessage.id);
        } catch (synthErr) {
          console.warn('TTS synthesis warning:', synthErr.message);
          setProcessingStage('idle');
        }
      } else {
        setProcessingStage('idle');
      }

      loadConversations();
    } catch (err) {
      setError(err.message || 'Speech processing failed. Please try again.');
      setProcessingStage('idle');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setTranscriptionPreview(null), 4000);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversationId,
        conversations,
        messages,
        language,
        voice,
        autoPlayVoice,
        voiceSpeed,
        isProcessing,
        processingStage,
        transcriptionPreview,
        currentlyPlayingId,
        error,
        systemHealth,
        setLanguage,
        setVoice,
        setAutoPlayVoice,
        setVoiceSpeed,
        startNewConversation,
        selectConversation,
        deleteConversation,
        clearAllConversations,
        sendTextMessage,
        sendAudioRecording,
        synthesizeAndPlay,
        playAudio,
        stopAudio,
        clearError: () => setError(null),
        refreshHealth: checkHealth
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
