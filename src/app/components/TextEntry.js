// src/app/components/TextEntry.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMicrophone, FaPaperPlane } from "react-icons/fa";

// TextEntry component for user input, styled like CommandBar
export default function TextEntry({
  onSubmit,
  placeholder = "Ask anything...",
  suggestions = [],
  currentCommand = "", // <<< Prop from page.js
  onVoiceStart,
  onVoiceEnd,
}) {
  // --- MODIFIED: Initialize internal state directly from prop ---
  const [text, setText] = useState(currentCommand || "");
  // -----------------------------------------------------------
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const inputRef = useRef(null);

  // --- MODIFIED: useEffect to sync state if prop changes AFTER initial render ---
  useEffect(() => {
    // If the prop changes and differs from the internal state, update internal state
    if (currentCommand !== text) {
        setText(currentCommand || "");
    }
    // Only run when the prop changes
  }, [currentCommand]);
  // --------------------------------------------------------------------------


  // Initialize speech recognition API
  useEffect(() => {
    // ... (speech recognition setup remains the same) ...
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) { /* ... */ } else { console.warn("Speech Recognition not supported."); }
    }
  }, [onVoiceEnd]); // Removed dependency - only needs onVoiceEnd

  // Removed auto-focus useEffect as it might interfere

  // Handle "Enter" key submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim() !== "") {
      onSubmit(text.trim().toLowerCase());
      // setText(""); // Keep text in input after submit
    }
  };

  // Handle clicking a suggestion bubble
  const handleSuggestionClick = (suggestion) => {
    const command = suggestion.toLowerCase();
    onSubmit(command); // Submit the command immediately
    setText(suggestion); // Set the input field value
  };

  // Handle clicking the send button
  const handleSendClick = () => {
    if (text.trim() !== "") {
      onSubmit(text.trim().toLowerCase());
      // setText(""); // Keep text in input after submit
    }
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => { /* ... */ };

  // Glow Style for Buttons
  const glowStyle = { textShadow: '0 0 8px rgba(56, 189, 248, 0.7)' };

  return (
    <div className="w-full flex flex-col items-center">
        {/* Input Bar Container */}
        <motion.div
            className="w-full max-w-2xl mx-auto bg-[#06647B]/30 backdrop-blur-lg rounded-full shadow-lg overflow-hidden border border-[#06647B]/50"
        >
            <div className="flex items-center px-4 py-2">
                <FaSearch className="text-cyan-200/70 mr-3 flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={text} // Controlled by internal state 'text'
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isListening ? "Listening..." : placeholder}
                    className="flex-grow bg-transparent text-white border-none outline-none placeholder-cyan-100/50 text-lg py-1"
                />
                <button
                    onClick={handleSendClick}
                    aria-label="Send message"
                    className={`ml-3 p-2 rounded-full ${text.trim() ? 'bg-cyan-500/30 hover:bg-cyan-500/50' : 'bg-cyan-500/10 text-white/50 cursor-not-allowed'} transition-colors flex-shrink-0`}
                    disabled={!text.trim()}
                >
                    <FaPaperPlane className="text-white h-5 w-5" />
                </button>
            </div>
        </motion.div>

        {/* Suggestion Bubbles Container */}
        {suggestions.length > 0 && !isListening && (
            <motion.div
                className="flex flex-wrap gap-3 justify-center mt-5 w-full max-w-2xl px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
             {/* Filter suggestions based on internal 'text' state */}
            {suggestions
                .filter(sugg => sugg.toLowerCase() !== text.toLowerCase())
                .map((sugg) => (
                    <button
                        key={sugg}
                        onClick={() => handleSuggestionClick(sugg)}
                        className="bg-cyan-800/50 hover:bg-cyan-700/60 text-cyan-100 rounded-full px-4 py-2 text-sm transition-all duration-300 border border-cyan-700/50 hover:shadow-cyan-glow hover:scale-105"
                    >
                        <span style={glowStyle}>{sugg}</span>
                    </button>
             ))}
            </motion.div>
        )}
    </div>
  );
}
