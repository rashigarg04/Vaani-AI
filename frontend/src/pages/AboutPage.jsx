import React from 'react';
import {
  Mic,
  Volume2,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Cpu,
  Layers,
  ExternalLink
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>About the Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          About <span className="text-violet-600">Vaani AI</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Your Voice. Your Language. Your AI. Engineered for natural, multilingual Indian speech interactions.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-gray-900">What Vaani AI Does</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Vaani AI is an intelligent multilingual voice assistant built specifically for Indian users. Traditional voice assistants often stumble when presented with Indian accents, Devanagari phonetics, or casual <strong>Hinglish</strong> (Hindi + English code-mixed speech). Vaani AI bridges this gap by enabling fluid, natural vocal communication in Hindi, English, and Hinglish.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed">
          Whether you ask a quick question via your microphone, type an inquiry in Roman script or Devanagari, or request complex explanations, Vaani AI reasons through your prompt and replies with authentic Indian voice synthesis.
        </p>
      </div>

      {/* Gnani AI Integration Details */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-600" />
            <span>How Gnani AI Models Are Used</span>
          </h2>
          <a
            href="https://docs.gnani.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-600 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Gnani AI Docs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prisma STT */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
              <Mic className="w-5 h-5" />
              <span>1. Gnani Prisma STT (Speech-to-Text)</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              When you speak through your device microphone, your audio snippet is sent to Gnani's official REST endpoint:
            </p>
            <code className="block text-[11px] font-mono bg-white p-2 rounded-lg border border-purple-100 text-purple-900 break-all">
              POST https://api.vachana.ai/stt/v3
            </code>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li><strong>Model:</strong> <code className="bg-white px-1 rounded">prisma-v3.0</code></li>
              <li><strong>Languages:</strong> Automatic detection (<code className="bg-white px-1 rounded">indic-auto</code>), Hindi (<code className="bg-white px-1 rounded">hi-IN</code>), and code-mixed speech</li>
              <li><strong>Format:</strong> <code className="bg-white px-1 rounded">codemix</code> to retain Latin English words alongside Devanagari</li>
            </ul>
          </div>

          {/* Timbre TTS */}
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-3">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-base">
              <Volume2 className="w-5 h-5" />
              <span>2. Gnani Timbre TTS (Text-to-Speech)</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Once an answer is formulated, the response is synthesized into realistic Indian speech via Gnani's TTS endpoint:
            </p>
            <code className="block text-[11px] font-mono bg-white p-2 rounded-lg border border-purple-100 text-purple-900 break-all">
              POST https://api.vachana.ai/api/v1/tts/inference
            </code>
            <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li><strong>Model:</strong> <code className="bg-white px-1 rounded">timbre-v3.0</code></li>
              <li><strong>Voices:</strong> 12 expressive voices including <em>Shivani</em>, <em>Lakshmi</em>, <em>Avinash</em>, and <em>Shubham</em></li>
              <li><strong>Output:</strong> High-fidelity 24kHz/48kHz linear PCM WAV binary streaming</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3-Tier Workflow Architecture */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-violet-600" />
          <span>System Architecture & Reasoning Layer</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>
            The reasoning layer acts as the brain between <strong>Prisma STT</strong> and <strong>Timbre TTS</strong>. It maintains conversation history, understands contextual references, and preserves the user's preferred language (answering Hindi queries in Hindi, Hinglish queries in Hinglish, and English queries in English).
          </p>
          <p>
            The backend features a modular provider architecture:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="font-bold text-gray-800 text-xs">Evon Model</div>
              <div className="text-[11px] text-gray-500 mt-1">Configured if you provide an Evon deployment endpoint</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="font-bold text-gray-800 text-xs">Gemini / OpenAI Compatible</div>
              <div className="text-[11px] text-gray-500 mt-1">Seamless connection to external LLMs if keys are supplied</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="font-bold text-gray-800 text-xs">Indian Context Fallback</div>
              <div className="text-[11px] text-gray-500 mt-1">Intelligent built-in conversational engine without dependencies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Privacy */}
      <div className="bg-white rounded-3xl border border-purple-100 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Security, Privacy & Data Handling</span>
        </h2>
        <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <div className="flex gap-3 items-start">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">Zero Persistent Raw Microphone Audio:</strong> Audio captured during your session is streamed into memory buffers for transcription and immediately cleaned up. No raw audio files linger on the server.
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">Backend Secret Protection:</strong> Gnani API keys are strictly kept on the server inside backend environment variables (<code className="bg-gray-100 px-1 rounded">backend/.env</code>) and are never exposed to client-side browsers.
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-800">User Data Control:</strong> You can wipe all conversation records anytime with one click in the Settings or Sidebar.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
