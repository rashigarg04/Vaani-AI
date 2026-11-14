import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { AssistantPage } from './pages/AssistantPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <ChatProvider>
        <div className="min-h-screen flex flex-col bg-[#FBFBFE] text-[#1E1B4B]">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </ChatProvider>
    </BrowserRouter>
  );
};

export default App;
