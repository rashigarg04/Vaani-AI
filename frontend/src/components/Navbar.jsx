import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, Sparkles, Settings, Info, Menu, X, Globe, Radio } from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';

export const Navbar = () => {
  const location = useLocation();
  const { systemHealth, language, setLanguage } = useChat();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGnaniConfigured = Boolean(
    systemHealth?.services?.gnaniPrisma?.configured &&
    systemHealth?.services?.gnaniTimbre?.configured
  );

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Assistant', path: '/assistant' },
    { name: 'Settings', path: '/settings' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-purple-100/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-gray-900 group-hover:text-purple-700 transition-colors">
                Vaani<span className="text-violet-600"> AI</span>
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-purple-50 text-purple-700 border border-purple-200/60 hidden sm:inline-block">
                वाणी
              </span>
            </div>
            <p className="text-[10px] text-gray-500 hidden sm:block -mt-1 font-medium">Your Voice. Your Language. Your AI.</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-violet-700 bg-violet-50 font-semibold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Fast Toggle */}
          <div className="flex items-center bg-gray-50 border border-purple-100 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setLanguage('hi-IN')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                language === 'hi-IN' ? 'bg-violet-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Hindi (हिंदी)"
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('hi-IN,en-IN')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                language === 'hi-IN,en-IN' ? 'bg-violet-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Hinglish (हिंग्लिश)"
            >
              Hinglish
            </button>
            <button
              onClick={() => setLanguage('en-IN')}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                language === 'en-IN' ? 'bg-violet-600 text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="English (Indian)"
            >
              English
            </button>
          </div>

          {/* Gnani AI Connection Pill */}
          <Link
            to="/settings"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors bg-white hover:bg-gray-50"
            title={isGnaniConfigured ? 'Gnani AI Connected' : 'Click to configure Gnani API Key'}
          >
            <span className={`w-2 h-2 rounded-full ${isGnaniConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-gray-600 text-[11px]">
              {isGnaniConfigured ? 'Gnani Live' : 'Gnani Setup'}
            </span>
          </Link>

          {/* Launch App Button */}
          {location.pathname !== '/assistant' && (
            <Link
              to="/assistant"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-sm shadow-purple-500/25 transition-all hover:shadow"
            >
              <Mic className="w-4 h-4" />
              <span>Start Talking</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/assistant"
            className="p-2 rounded-lg bg-violet-600 text-white"
            title="Assistant"
          >
            <Mic className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-purple-100 bg-white px-4 pt-2 pb-5 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive ? 'text-violet-700 bg-violet-50 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2 font-medium">Select Language:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setLanguage('hi-IN'); setMobileMenuOpen(false); }}
                className={`py-2 text-center rounded-lg text-xs font-medium border ${
                  language === 'hi-IN' ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => { setLanguage('hi-IN,en-IN'); setMobileMenuOpen(false); }}
                className={`py-2 text-center rounded-lg text-xs font-medium border ${
                  language === 'hi-IN,en-IN' ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                Hinglish
              </button>
              <button
                onClick={() => { setLanguage('en-IN'); setMobileMenuOpen(false); }}
                className={`py-2 text-center rounded-lg text-xs font-medium border ${
                  language === 'en-IN' ? 'bg-violet-600 text-white border-violet-600' : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
