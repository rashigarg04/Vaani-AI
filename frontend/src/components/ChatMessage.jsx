import React, { useState } from 'react';
import { Volume2, Sparkles, User, Copy, Check, Clock } from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';
import { AudioPlayer } from './AudioPlayer.jsx';

export const ChatMessage = ({ message }) => {
  const { synthesizeAndPlay, processingStage } = useChat();
  const [copied, setCopied] = useState(false);

  const isUser = message.sender === 'user';

  const copyToClipboard = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-3 py-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-xl md:max-w-2xl flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* The Card Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-xs shadow-sm shadow-purple-500/10'
              : 'bg-white text-gray-800 rounded-bl-xs border border-purple-100 shadow-xs'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.text}</div>

          {/* Embedded Audio Player if voice audio exists */}
          {message.audioUrl && (
            <div className="mt-2.5">
              <AudioPlayer audioUrl={message.audioUrl} />
            </div>
          )}
        </div>

        {/* Action and Metadata Row */}
        <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-gray-400">
          {/* Timestamp */}
          {message.createdAt && (
            <span>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}

          {/* Provider / Model pill for assistant */}
          {!isUser && message.metadata?.provider && (
            <>
              <span>•</span>
              <span className="text-violet-600 font-medium">{message.metadata.provider}</span>
            </>
          )}

          {/* STT/TTS Latency */}
          {message.metadata?.latency && (
            <>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                <span>{message.metadata.latency.toFixed(1)}s</span>
              </span>
            </>
          )}

          {/* Listen Button if audioUrl is not yet loaded */}
          {!isUser && !message.audioUrl && (
            <button
              onClick={() => synthesizeAndPlay(message.id, message.text)}
              disabled={processingStage === 'synthesizing'}
              className="text-violet-600 hover:text-violet-800 flex items-center gap-1 font-medium transition-colors ml-1"
              title="Speak this response using Gnani Timbre"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            className="text-gray-400 hover:text-gray-600 p-0.5 transition-colors"
            title="Copy message text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0 shadow-xs mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
