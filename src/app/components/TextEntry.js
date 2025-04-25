// src/app/components/TextEntry.js
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa"; // Removed FaPlusCircle

// TextEntry component for user input
export default function TextEntry({
  onSubmit,
  placeholder = "Ask anything...",
  suggestions = [], // Expecting the new suggestions list
  onVoiceStart,
  onVoiceEnd,
}) {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const inputRef = useRef(null);

  // Initialize speech recognition API (no changes needed here)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setText(transcript);
          setIsListening(false);
          if (onVoiceEnd) onVoiceEnd();
        };
        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (onVoiceEnd) onVoiceEnd();
        };
        recognitionInstance.onend = () => {
          setIsListening(false);
          if (onVoiceEnd) onVoiceEnd();
        };
        setRecognition(recognitionInstance);
      } else {
        console.warn("Speech Recognition not supported by this browser.");
      }
    }
  }, [onVoiceEnd]); // Removed onSubmit from dependency array as it shouldn't change

  // Auto-focus input on mount (no changes needed here)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle "Enter" key (no changes needed here)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim() !== "") {
      onSubmit(text.trim().toLowerCase());
      setText("");
    }
  };

  // Handle suggestion click (no changes needed here, but styling applied below)
  const handleSuggestionClick = (suggestion) => {
    // Submit the suggestion directly when clicked
    onSubmit(suggestion.toLowerCase());
    setText(""); // Clear input after submitting suggestion
    // inputRef.current?.focus(); // Optional: refocus input
  };

  // Handle send click (no changes needed here)
  const handleSendClick = () => {
    if (text.trim() !== "") {
      onSubmit(text.trim().toLowerCase());
      setText("");
    }
  };

  // Toggle voice recognition (no changes needed here)
  const toggleVoiceRecognition = () => {
     if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        setText("");
        try {
            recognition.start();
            setIsListening(true);
            if (onVoiceStart) onVoiceStart();
        } catch (error) {
            console.error("Error starting speech recognition:", error);
            setIsListening(false);
        }
      }
    } else {
        console.error("Speech recognition not available or initialized.");
    }
  };

  // --- Glow Style for Buttons ---
  // Define a reusable style object or class string for the glow effect
  const glowStyle = {
    textShadow: '0 0 8px rgba(56, 189, 248, 0.7)', // Cyan glow (adjust color/intensity as needed)
  };
  // Or as a Tailwind class string if you configure textShadow in tailwind.config.js
  // const glowClass = "shadow-cyan-glow"; // Example custom utility

  return (
    // Main container with glassy theme
    <div className="w-full max-w-2xl mx-auto bg-[#06647B]/30 backdrop-blur-lg rounded-xl shadow-lg border border-[#06647B]/50 p-4">
      {/* Top row: Input field and buttons */}
      <div className="flex items-center">
        {/* Text Input Field - Increased height via padding */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : placeholder}
          // Increased vertical padding (py-3), adjusted text size
          className="flex-grow bg-transparent text-white border-none outline-none placeholder-cyan-100/50 text-xl px-3 py-3"
        />

        {/* Conditionally render mic or send button */}
        {text.trim().length > 0 ? (
          // Send Button
          <button
            onClick={handleSendClick}
            aria-label="Send message"
            className="ml-3 p-3 rounded-full bg-cyan-500/30 hover:bg-cyan-500/50 transition-colors flex-shrink-0" // Increased padding
          >
            <FaPaperPlane className="text-white h-5 w-5" /> {/* Adjusted icon size if needed */}
          </button>
        ) : (
          // Microphone Button
          <button
            onClick={toggleVoiceRecognition}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            className={`ml-3 p-3 rounded-full ${isListening ? "bg-red-500/70 animate-pulse" : "bg-cyan-500/30 hover:bg-cyan-500/50"} transition-colors flex-shrink-0`} // Increased padding
          >
            <FaMicrophone className="text-white h-5 w-5" /> {/* Adjusted icon size if needed */}
          </button>
        )}
      </div>

      {/* Bottom row: Suggestion bubbles */}
      {/* Show suggestions only when input is empty and not listening */}
      {suggestions.length > 0 && !text && !isListening && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center mt-5" // Added justify-center and increased gap/margin
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {suggestions.map((sugg) => (
            <button
              key={sugg}
              onClick={() => handleSuggestionClick(sugg)}
              // Styling for suggestion bubbles with GLOW effect
              className="bg-cyan-800/50 hover:bg-cyan-700/60 text-cyan-100 rounded-full px-4 py-2 text-sm transition-all duration-300 border border-cyan-700/50 hover:shadow-cyan-glow hover:scale-105" // Added hover scale/shadow
              // Apply glow style directly (alternative to hover:shadow-cyan-glow if defined)
              // style={glowStyle}
            >
              {/* Apply glow style directly to text if preferred */}
               <span style={glowStyle}>{sugg}</span>
               {/* Or just use the button class */}
               {/* {sugg} */}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// --- Optional: Add glow utility in globals.css or tailwind.config.js ---
/*
// In globals.css (if not using @apply much):
.text-glow-cyan {
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.7);
}
.hover\:shadow-cyan-glow:hover {
   box-shadow: 0 0 15px rgba(56, 189, 248, 0.5);
}

// Or in tailwind.config.js (Recommended for utilities):
module.exports = {
  theme: {
    extend: {
      textShadow: {
        'cyan-glow': '0 0 8px rgba(56, 189, 248, 0.7)',
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(56, 189, 248, 0.5)',
      }
    },
  },
  plugins: [
     require('tailwindcss-textshadow') // If using a plugin
  ],
}
// Then use className="text-shadow-cyan-glow" or className="hover:shadow-cyan-glow"
*/
