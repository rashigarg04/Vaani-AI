import React from 'react';
import { Globe } from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';

export const LANGUAGES = [
  { code: 'indic-auto', label: 'Auto Detect (स्वतः पहचान)', native: 'Auto' },
  { code: 'hi-IN', label: 'Hindi (हिन्दी)', native: 'हिन्दी' },
  { code: 'hi-IN,en-IN', label: 'Hinglish (हिंग्लिश / Code-mixed)', native: 'Hinglish' },
  { code: 'en-IN', label: 'Indian English', native: 'English' },
  { code: 'ta-IN', label: 'Tamil (தமிழ்)', native: 'தமிழ்' },
  { code: 'te-IN', label: 'Telugu (తెలుగు)', native: 'తెలుగు' },
  { code: 'kn-IN', label: 'Kannada (ಕನ್ನಡ)', native: 'ಕನ್ನಡ' },
  { code: 'mr-IN', label: 'Marathi (मराठी)', native: 'मराठी' },
  { code: 'bn-IN', label: 'Bengali (বাংলা)', native: 'বাংলা' },
  { code: 'gu-IN', label: 'Gujarati (ગુજરાતી)', native: 'ગુજરાતી' },
];

export const LanguageSelector = ({ variant = 'pills' }) => {
  const { language, setLanguage } = useChat();

  if (variant === 'select') {
    return (
      <div className="relative inline-block w-full">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full bg-white border border-purple-200 text-gray-800 text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Default: Primary 3 language quick pills (Hindi, Hinglish, English)
  return (
    <div className="flex items-center gap-1.5 p-1 bg-white/90 border border-purple-200/80 rounded-2xl shadow-xs">
      <div className="flex items-center gap-1 px-2 text-gray-400 text-xs hidden sm:flex">
        <Globe className="w-3.5 h-3.5 text-violet-500" />
        <span className="font-medium text-gray-500 text-[11px]">Language:</span>
      </div>

      <div className="flex gap-1 overflow-x-auto">
        {[
          { code: 'hi-IN', name: 'हिन्दी' },
          { code: 'hi-IN,en-IN', name: 'Hinglish' },
          { code: 'en-IN', name: 'English' },
          { code: 'indic-auto', name: 'Auto' },
        ].map((item) => (
          <button
            key={item.code}
            onClick={() => setLanguage(item.code)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              language === item.code
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900 hover:bg-purple-50'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};
