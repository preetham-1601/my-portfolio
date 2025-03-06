'use client';
import { useState } from 'react';
import { FaPlusCircle, FaMicrophone, FaPaperPlane } from 'react-icons/fa';

export default function TextEntry({
  onSubmit,
  placeholder = 'Ask anything...',
  suggestions = [],
}) {
  const [text, setText] = useState('');

  // Handle "Enter" key submission
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      onSubmit(text);
      setText('');
    }
  };

  // When a suggestion bubble is clicked, fill the input
  const handleSuggestionClick = (suggestion) => {
    setText(suggestion);
  };

  // Handle clicking the send button
  const handleSendClick = () => {
    if (text.trim() !== '') {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="bg-white w-full max-w-xl p-4 rounded-xl shadow-md mx-auto">
      {/* Top row: Left icon, input, right icon or send button */}
      <div className="flex items-center">
        <FaPlusCircle className="text-gray-400 mr-2" />

        {/* Text Input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-grow focus:outline-none text-gray-700 placeholder-gray-400"
        />

        {/* Conditionally render mic icon OR send button */}
        {text.trim().length > 0 ? (
          <button
            onClick={handleSendClick}
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-full w-9 h-9 ml-2"
          >
            <FaPaperPlane size={14} />
          </button>
        ) : (
          <FaMicrophone className="text-gray-400 ml-2" />
        )}
      </div>

      {/* Bottom row: Suggestion bubbles (optional) */}
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {suggestions.map((sugg) => (
            <button
              key={sugg}
              onClick={() => handleSuggestionClick(sugg)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm"
            >
              {sugg}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
