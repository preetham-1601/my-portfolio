// src/components/TextEntry.js
'use client';
import { useState } from 'react';

export default function TextEntry({ onSubmit }) {
  const [text, setText] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && text.trim() !== '') {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Type your query here..."
      className="w-80 p-3 rounded-full focus:outline-none"
    />
  );
}
