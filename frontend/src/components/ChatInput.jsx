import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';

export const ChatInput = ({ onFocusInput }) => {
  const [inputText, setInputText] = useState('');
  const { sendTextMessage, isProcessing, language } = useChat();

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const textToSend = inputText;
    setInputText('');
    await sendTextMessage(textToSend);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getLanguagePlaceholder = () => {
    if (language === 'hi-IN') return 'यहाँ हिन्दी में लिखें या प्रश्न पूछें... (उदा. आज क्या खास है?)';
    if (language === 'hi-IN,en-IN') return 'Ask in Hinglish or English... (e.g. Aaj ka weather kaisa hai?)';
    return 'Ask anything in English, Hindi, or Hinglish... (Press Enter to send)';
  };

  return (
    <form onSubmit={handleSend} className="w-full relative">
      <div className="flex items-center bg-white border border-purple-200/90 rounded-2xl shadow-sm hover:border-violet-300 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-400/20 transition-all p-1.5 sm:p-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isProcessing}
          placeholder={getLanguagePlaceholder()}
          className="flex-1 bg-transparent px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          aria-label="Send message"
          className={`p-2.5 rounded-xl transition-all ${
            inputText.trim() && !isProcessing
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm hover:from-violet-700 hover:to-purple-700 hover:scale-105 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
