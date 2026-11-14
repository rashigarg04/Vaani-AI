import React from 'react';
import { Loader2, Sparkles, Mic, Volume2 } from 'lucide-react';

export const LoadingIndicator = ({ stage = 'thinking', text }) => {
  const getStageInfo = () => {
    switch (stage) {
      case 'transcribing':
        return {
          icon: <Mic className="w-4 h-4 text-violet-600 animate-bounce" />,
          title: 'Converting speech with Gnani Prisma...',
          badge: 'Speech-to-Text'
        };
      case 'thinking':
        return {
          icon: <Sparkles className="w-4 h-4 text-violet-600 animate-spin" />,
          title: 'Formulating Indian AI response...',
          badge: 'Reasoning Engine'
        };
      case 'synthesizing':
        return {
          icon: <Volume2 className="w-4 h-4 text-violet-600 animate-pulse" />,
          title: 'Generating voice with Gnani Timbre...',
          badge: 'Text-to-Speech'
        };
      default:
        return {
          icon: <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />,
          title: 'Processing...',
          badge: 'AI Assistant'
        };
    }
  };

  const info = getStageInfo();

  return (
    <div className="flex items-center gap-3 p-3 bg-white/90 border border-purple-100 rounded-2xl shadow-xs max-w-sm animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
        {info.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-800 truncate">{text || info.title}</p>
        <span className="text-[10px] text-violet-600 font-medium">{info.badge}</span>
      </div>
    </div>
  );
};
