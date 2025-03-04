'use client';
import { useState } from 'react';
import Sidebar from '../app/components/Sidebar';
import TextEntry from '../app/components/TextEntry';

export default function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion === 'About Me') {
      setSidebarOpen(true);
    }
    // Add more suggestion logic if needed.
  };

  const handleTextSubmit = (text) => {
    if (text.toLowerCase().includes('about me')) {
      setSidebarOpen(true);
    }
    // Handle additional text-based queries here.
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#06647B] to-black">
      {/* Sidebar slides in from the left */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Central content */}
      <div className="text-center">
        {/* Welcome text */}
        <h1 className="text-white text-3xl mb-6">
          Welcome! What would you like to know?
        </h1>

        {/* GPT-like Text Entry */}
        <div className="flex justify-center mb-6">
          <TextEntry onSubmit={handleTextSubmit} />
        </div>

        {/* Suggestion Buttons */}
        <div>
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
      </div>
    </div>
  );
}
