import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Volume2,
  Sparkles,
  Globe2,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HeartHandshake,
  Layers,
  Cpu
} from 'lucide-react';
import { AudioWaveform } from '../components/AudioWaveform.jsx';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFE] flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Soft background decorative ambient blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-200/50 to-violet-300/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Powered by Gnani AI • Prisma STT & Timbre TTS</span>
          </div>

          {/* Master Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-[1.15]">
            Your Voice. <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Your Language.</span> Your AI.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The next-generation voice assistant built specifically for India. Speak naturally in 
            <strong className="text-gray-900 font-semibold"> Hindi</strong>, 
            <strong className="text-gray-900 font-semibold"> English</strong>, or 
            <strong className="text-gray-900 font-semibold"> Hinglish</strong>, and experience human-like conversational intelligence.
          </p>

          {/* Animated Waveform Illustration */}
          <div className="my-10 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white/90 border border-purple-100 rounded-3xl p-5 shadow-sm shadow-purple-500/5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 text-xs text-gray-500 font-medium px-2">
                <span className="flex items-center gap-1.5 text-violet-700">
                  <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                  Live Indian Speech Engine
                </span>
                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                  Gnani Prisma v3.0
                </span>
              </div>
              <AudioWaveform isPlaying={true} barCount={12} className="h-10 my-2" />
              <div className="text-xs text-gray-400 text-center mt-2">
                "वाणी, आज भारत में मौसम कैसा है?" ↔ "Weather is pleasant today!"
              </div>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-md shadow-purple-500/25 transition-all hover:scale-105"
            >
              <Mic className="w-5 h-5" />
              <span>Start Talking Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-base font-semibold text-gray-700 bg-white border border-purple-200/80 hover:bg-gray-50 shadow-xs transition-colors"
            >
              <span>Explore How It Works</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Real-time Microphone Streaming
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Code-Mixed Hinglish Support
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Expressive Indian Voices
            </span>
          </div>
        </div>
      </section>

      {/* Supported Languages Section */}
      <section className="py-16 bg-white border-y border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase font-bold tracking-widest text-violet-600 mb-2">Multilingual Mastery</h2>
            <h3 className="text-3xl font-extrabold text-gray-900">
              Speak naturally in the language you think in.
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Vaani AI handles pure Indian regional languages as well as informal mixed conversation without missing a beat.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { lang: 'Hindi', script: 'हिन्दी', desc: 'Devanagari script support' },
              { lang: 'Hinglish', script: 'हिंग्लिश', desc: 'Code-mixed casual speech' },
              { lang: 'English', script: 'Indian English', desc: 'Indian accent optimization' },
              { lang: 'Tamil', script: 'தமிழ்', desc: 'South Indian linguistic dialect' },
              { lang: 'Telugu', script: 'తెలుగు', desc: 'Natural tone synthesis' },
              { lang: 'Marathi', script: 'मराठी', desc: 'Rich regional vocabulary' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-purple-100/80 bg-[#FAF8FF] hover:border-violet-300 hover:bg-white transition-all text-center group"
              >
                <div className="text-lg font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                  {item.script}
                </div>
                <div className="text-xs font-semibold text-violet-600 mt-1">{item.lang}</div>
                <div className="text-[11px] text-gray-400 mt-1 leading-tight">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#FBFBFE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-violet-600 mb-2">End-to-End Workflow</h2>
            <h3 className="text-3xl font-extrabold text-gray-900">
              How Vaani AI transforms your spoken words
            </h3>
            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              From the moment you speak into your microphone to the voice response played in your ears.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Speak in Your Browser',
                desc: 'Click the animated mic and speak naturally. The browser captures your speech via MediaRecorder without latency.',
                icon: <Mic className="w-6 h-6 text-violet-600" />
              },
              {
                step: '02',
                title: 'Gnani Prisma STT',
                desc: 'Your audio is processed by Gnani Prisma v3.0, detecting dialect and converting speech into accurate text.',
                icon: <Zap className="w-6 h-6 text-violet-600" />
              },
              {
                step: '03',
                title: 'AI Reasoning Engine',
                desc: 'Our context-aware engine understands your question, references history, and generates an insightful Indian response.',
                icon: <Cpu className="w-6 h-6 text-violet-600" />
              },
              {
                step: '04',
                title: 'Gnani Timbre TTS',
                desc: 'Gnani Timbre v3.0 turns the generated text into expressive, sweet Indian speech audio played in real time.',
                icon: <Volume2 className="w-6 h-6 text-violet-600" />
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="bg-white border border-purple-100/90 rounded-3xl p-6 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-purple-100 absolute top-6 right-6">
                    {step.step}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white border-t border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                <Globe2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-1">True Code-Mixed Hinglish</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Most voice assistants fail when you mix "aaj ka weather kaisa hai". Vaani AI understands code-mixing seamlessly.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-1">Expressive Timbre Voice</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Voices like Shivani and Avinash sound natural, warm, and authentic with proper Indian phonetics and pauses.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-1">Privacy & Clean Architecture</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Raw audio is never stored permanently. In-memory streaming ensures complete user privacy and fast response times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-gray-50 border-t border-purple-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white">
              <Mic className="w-4 h-4" />
            </div>
            <span className="font-bold text-gray-900">Vaani AI</span>
            <span className="text-xs text-gray-500">• Your Voice. Your Language. Your AI.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link to="/assistant" className="hover:text-purple-700 transition-colors">Assistant</Link>
            <Link to="/settings" className="hover:text-purple-700 transition-colors">Settings</Link>
            <Link to="/about" className="hover:text-purple-700 transition-colors">About & Documentation</Link>
            <a
              href="https://docs.gnani.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-600 hover:underline"
            >
              Gnani AI Docs
            </a>
          </div>

          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Vaani AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
