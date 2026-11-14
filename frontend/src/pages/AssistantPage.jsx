import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar.jsx';
import { MicrophoneButton } from '../components/MicrophoneButton.jsx';
import { ChatMessage } from '../components/ChatMessage.jsx';
import { ChatInput } from '../components/ChatInput.jsx';
import { LanguageSelector } from '../components/LanguageSelector.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { LoadingIndicator } from '../components/LoadingIndicator.jsx';
import { useChat } from '../context/ChatContext.jsx';
import { Sparkles, MessageSquare, Volume2, ShieldAlert } from 'lucide-react';

export const AssistantPage = () => {
  const {
    messages,
    isProcessing,
    processingStage,
    language,
    systemHealth,
    startNewConversation
  } = useChat();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FBFBFE]">
      {/* Left Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-white/70 backdrop-blur-md border-b border-purple-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-gray-900 truncate">
              Vaani Voice Assistant
            </h1>
            <span className="hidden sm:inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
              Multilingual
            </span>
          </div>

          {/* Quick Language Toggle */}
          <div className="shrink-0">
            <LanguageSelector variant="pills" />
          </div>
        </div>

        {/* Scrollable Conversation View */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
          {/* Welcome Screen when no messages */}
          {messages.length === 0 ? (
            <div className="max-w-xl mx-auto my-auto pt-6 pb-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-md shadow-purple-500/20 mb-4 animate-bounce-subtle">
                <Sparkles className="w-8 h-8" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Welcome to <span className="text-violet-600">Vaani AI</span>
              </h2>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Your intelligent Indian voice companion. You can speak into your microphone or type your questions below in Hindi, English, or Hinglish.
              </p>

              {/* Suggested Starters */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {[
                  { lang: 'हिन्दी', text: 'नमस्ते वाणी, आप क्या-क्या कर सकती हैं?' },
                  { lang: 'Hinglish', text: 'Aaj ka weather aur time batao please' },
                  { lang: 'English', text: 'How does Gnani AI Prisma STT work?' },
                  { lang: 'हिन्दी', text: 'भारत की राजधानी क्या है और इसके बारे में बताएं?' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const input = document.querySelector('input[placeholder]');
                      if (input) {
                        input.value = item.text;
                        input.focus();
                      }
                    }}
                    className="p-3 rounded-2xl bg-white border border-purple-100 hover:border-violet-300 hover:shadow-xs transition-all text-xs text-gray-700 group"
                  >
                    <span className="text-[10px] font-semibold text-violet-600 uppercase block mb-0.5">
                      {item.lang}
                    </span>
                    <span className="group-hover:text-violet-700">"{item.text}"</span>
                  </button>
                ))}
              </div>

              {/* Status Badge Strip */}
              <div className="mt-8">
                <StatusBadge />
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Processing stage bubble */}
              {isProcessing && (
                <div className="flex justify-start py-2">
                  <LoadingIndicator stage={processingStage} />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Voice & Text Input Section */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-purple-100/80 px-4 pt-2 pb-4 sm:px-6">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            
            {/* The Animated Microphone Control */}
            <MicrophoneButton />

            {/* Typed Text Input Form */}
            <div className="w-full mt-1">
              <ChatInput />
            </div>

            <p className="text-[10px] text-gray-400 mt-2 text-center">
              Powered by Gnani AI Prisma (STT) and Timbre (TTS). Speech is processed securely in memory.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
};
