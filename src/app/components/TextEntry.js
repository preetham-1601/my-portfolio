'use client';
import { useState } from 'react';
// Install react-icons if you haven't already: npm install react-icons
import { FaSearch, FaMicrophone } from 'react-icons/fa';

export default function TextEntry({ onSubmit }) {
  const [text, setText] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="flex items-center bg-white w-full max-w-xl p-3 rounded-full shadow-md">
      {/* Left Icon (Search) */}
      <button className="text-gray-400 hover:text-gray-600 transition-colors mr-2">
        <FaSearch size={18} />
      </button>

      {/* Text Input */}
      <input
        type="text"
        placeholder="Type your query here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow focus:outline-none text-gray-700 placeholder-gray-400"
      />

      {/* Right Icon (Microphone) */}
      <button className="text-gray-400 hover:text-gray-600 transition-colors ml-2">
        <FaMicrophone size={18} />
      </button>
    </div>
  );
}
