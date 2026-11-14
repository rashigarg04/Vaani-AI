import React, { useState } from 'react';
import {
  Volume2,
  Globe,
  Settings as SettingsIcon,
  Trash2,
  Play,
  RotateCcw,
  Check,
  AlertCircle,
  Key,
  Database,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';
import { voiceService } from '../services/voiceService.js';

const VOICES_LIST = [
  { name: 'Shivani', gender: 'Feminine', desc: 'Warm, natural, default Hindi/English voice' },
  { name: 'Lakshmi', gender: 'Feminine', desc: 'Gentle, polite delivery' },
  { name: 'Kalpana', gender: 'Feminine', desc: 'Clear, informative cadence' },
  { name: 'Chetana', gender: 'Feminine', desc: 'Energetic, contemporary tone' },
  { name: 'Vasudha', gender: 'Feminine', desc: 'Smooth, mature voice' },
  { name: 'Riyaa', gender: 'Feminine', desc: 'Youthful and lively' },
  { name: 'Tarika', gender: 'Feminine', desc: 'Expressive and friendly' },
  { name: 'Avinash', gender: 'Masculine', desc: 'Confident, natural masculine tone' },
  { name: 'Shubham', gender: 'Masculine', desc: 'Conversational, young professional' },
  { name: 'Prakash', gender: 'Masculine', desc: 'Deep, authoritative delivery' },
  { name: 'Devansh', gender: 'Masculine', desc: 'Warm, calm, and articulate' },
  { name: 'Yashraj', gender: 'Masculine', desc: 'Crisp, articulate speaker' },
];

export const SettingsPage = () => {
  const {
    language,
    setLanguage,
    voice,
    setVoice,
    autoPlayVoice,
    setAutoPlayVoice,
    voiceSpeed,
    setVoiceSpeed,
    clearAllConversations,
    systemHealth,
    refreshHealth
  } = useChat();

  const [testingVoice, setTestingVoice] = useState(false);
  const [testVoiceError, setTestVoiceError] = useState(null);
  const [testSuccess, setTestSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const prismaStatus = systemHealth?.services?.gnaniPrisma?.configured;
  const timbreStatus = systemHealth?.services?.gnaniTimbre?.configured;
  const dbStatus = systemHealth?.services?.database;
  const aiProvider = systemHealth?.services?.aiReasoning;

  const handleTestVoice = async () => {
    setTestingVoice(true);
    setTestVoiceError(null);
    setTestSuccess(false);

    try {
      const sampleText = language === 'hi-IN'
        ? `नमस्ते! मैं ${voice} हूँ, वाणी एआई की आवाज़।`
        : language === 'hi-IN,en-IN'
        ? `Namaste! Main ${voice} hoon, Vaani AI ki expressive voice.`
        : `Hello! I am ${voice}, speaking with natural Indian intonation.`;

      const result = await voiceService.synthesizeSpeech({
        text: sampleText,
        voice,
        language,
        speed: voiceSpeed,
      });

      const audio = new Audio(result.audioUrl);
      audio.playbackRate = voiceSpeed;
      audio.play();
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    } catch (err) {
      setTestVoiceError(err.message || 'Voice test failed. Check GNANI_API_KEY.');
    } finally {
      setTestingVoice(false);
    }
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-violet-600" />
          <span>Application Settings</span>
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Customize your language, Gnani Timbre voice preferences, and view live API connectivity.
        </p>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {/* Section 1: Language & Voice Customization */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Globe className="w-5 h-5 text-violet-600" />
          <span>Speech & Language Preferences</span>
        </h2>

        {/* Primary Language */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Default Spoken Language
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { code: 'hi-IN', title: 'हिन्दी (Hindi)', desc: 'Pure Devanagari conversational tone' },
              { code: 'hi-IN,en-IN', title: 'Hinglish (हिंग्लिश)', desc: 'Hindi + English code-mixed speech' },
              { code: 'en-IN', title: 'Indian English', desc: 'Natural Indian accented English' },
            ].map((item) => (
              <div
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  language === item.code
                    ? 'border-violet-600 bg-violet-50/70 text-violet-900 shadow-xs'
                    : 'border-purple-100 hover:border-purple-200 bg-gray-50/40 text-gray-700'
                }`}
              >
                <div className="font-bold text-sm">{item.title}</div>
                <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Gnani Timbre Voice Selection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Gnani Timbre Expressive Voice (12 Indian Voices)
            </label>
            <span className="text-xs text-violet-600 font-semibold">Model: timbre-v3.0</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {VOICES_LIST.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => setVoice(v.name)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  voice.toLowerCase() === v.name.toLowerCase()
                    ? 'border-violet-600 bg-violet-600 text-white shadow-xs'
                    : 'border-purple-100 hover:border-purple-200 bg-gray-50 text-gray-800'
                }`}
              >
                <div className="font-bold text-sm">{v.name}</div>
                <div className={`text-[11px] ${voice.toLowerCase() === v.name.toLowerCase() ? 'text-purple-100' : 'text-gray-500'}`}>
                  {v.gender}
                </div>
              </button>
            ))}
          </div>

          {/* Test Voice Button */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleTestVoice}
              disabled={testingVoice}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{testingVoice ? 'Generating voice test...' : `Preview ${voice} Voice`}</span>
            </button>

            {testSuccess && (
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Playing sample audio
              </span>
            )}

            {testVoiceError && (
              <span className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {testVoiceError}
              </span>
            )}
          </div>
        </div>

        {/* Playback Speed */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Voice Playback Speed
          </label>
          <div className="flex gap-2">
            {[0.75, 1.0, 1.25, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setVoiceSpeed(spd)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  voiceSpeed === spd
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Auto-Play Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-50">
          <div>
            <h4 className="text-sm font-bold text-gray-900">Auto-Play Voice Response</h4>
            <p className="text-xs text-gray-500">Automatically speak answers using Gnani Timbre after reasoning.</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoPlayVoice(!autoPlayVoice)}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              autoPlayVoice ? 'bg-violet-600 justify-end' : 'bg-gray-300 justify-start'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </div>

      {/* Section 2: API & Integration Status */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-violet-600" />
            <span>API Connectivity & Credentials</span>
          </h2>
          <button
            onClick={refreshHealth}
            className="text-xs text-violet-600 hover:text-violet-800 font-semibold"
          >
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gnani Prisma */}
          <div className="p-4 rounded-2xl border border-purple-100 bg-[#FAF8FF]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">Gnani Prisma (STT)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                prismaStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {prismaStatus ? 'CONFIGURED' : 'NEEDS API KEY'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Endpoint: <code className="text-violet-700 bg-purple-50 px-1 py-0.5 rounded">POST https://api.vachana.ai/stt/v3</code>
            </p>
            <p className="text-[11px] text-gray-400">
              Provide <strong className="text-gray-700">GNANI_API_KEY</strong> in <code className="bg-gray-100 px-1 rounded">backend/.env</code>.
            </p>
          </div>

          {/* Gnani Timbre */}
          <div className="p-4 rounded-2xl border border-purple-100 bg-[#FAF8FF]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">Gnani Timbre (TTS)</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                timbreStatus ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {timbreStatus ? 'CONFIGURED' : 'NEEDS API KEY'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              Endpoint: <code className="text-violet-700 bg-purple-50 px-1 py-0.5 rounded">POST https://api.vachana.ai/api/v1/tts/inference</code>
            </p>
            <p className="text-[11px] text-gray-400">
              Uses the same <strong className="text-gray-700">GNANI_API_KEY</strong> to stream expressive audio.
            </p>
          </div>

          {/* AI Reasoning Provider */}
          <div className="p-4 rounded-2xl border border-purple-100 bg-[#FAF8FF]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">Reasoning Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-gray-700 font-semibold mb-1">
              {aiProvider?.name || 'Vaani Intelligence Engine'}
            </p>
            <p className="text-[11px] text-gray-500">
              Supports Evon, Gemini, OpenAI, or local contextual Indian fallback.
            </p>
          </div>

          {/* Database Mode */}
          <div className="p-4 rounded-2xl border border-purple-100 bg-[#FAF8FF]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-gray-900">Storage Engine</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">
                ONLINE
              </span>
            </div>
            <p className="text-xs text-gray-700 font-semibold mb-1">
              {dbStatus?.mode || 'Guest Mode (In-Memory)'}
            </p>
            <p className="text-[11px] text-gray-500">
              {dbStatus?.connected
                ? 'Persisting conversations to MongoDB.'
                : 'Zero database setup required. Running in high-speed Guest Mode.'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: History & Data Management */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Clear Conversation History</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Erase all cached messages and audio sessions from your device.
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete all stored conversations?')) {
              clearAllConversations();
              alert('Conversation history cleared.');
            }
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear History</span>
        </button>
      </div>
    </div>
  );
};
