// src/app/page.js
'use client';
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TextEntry from './components/TextEntry';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === 'About Me') {
      setSidebarOpen(true);
    }
    // Add more suggestion logic here if needed
  };

  const handleTextSubmit = (text) => {
    // If user types "about me" in any form, open the sidebar
    if (text.toLowerCase().includes('about me')) {
      setSidebarOpen(true);
    }
    // Handle additional text-based queries here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#06647B] to-black">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="text-center">
        <h1 className="text-white text-3xl mb-4">
          Welcome! What would you like to know?
        </h1>
        <div className="mb-6">
          <button
            onClick={() => handleSuggestionClick('About Me')}
            className="text-white hover:underline mx-2 focus:outline-none"
          >
            About Me
          </button>
          <button
            onClick={() => handleSuggestionClick('Projects')}
            className="text-white hover:underline mx-2 focus:outline-none"
          >
            Projects
          </button>
          <button
            onClick={() => handleSuggestionClick('Work')}
            className="text-white hover:underline mx-2 focus:outline-none"
          >
            Work
          </button>
        </div>
        <TextEntry onSubmit={handleTextSubmit} />
      </div>
    </div>
  );
}
