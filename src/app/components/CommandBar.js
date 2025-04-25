// src/app/components/CommandBar.js
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaPaperPlane } from "react-icons/fa"; // Using react-icons

// CommandBar component receives onSubmit callback and autoFocus preference
export default function CommandBar({ onSubmit, autoFocus = true }) {
  const [command, setCommand] = useState(""); // State for the input value
  const inputRef = useRef(null); // Ref to focus the input element

  // Effect to focus the input when the component mounts (if autoFocus is true)
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handles 'Enter' key press in the input field
  const handleKeyDown = (e) => {
    // Check if Enter key is pressed and the command is not just whitespace
    if (e.key === "Enter" && command.trim() !== "") {
      // Call the parent's onSubmit function with the trimmed, lowercased command
      onSubmit(command.trim().toLowerCase());
      setCommand(""); // Clear the input field
    }
  };

  // Handles clicking the send button
  const handleSubmit = () => {
    // Check if the command is not just whitespace
    if (command.trim() !== "") {
      // Call the parent's onSubmit function
      onSubmit(command.trim().toLowerCase());
      setCommand(""); // Clear the input field
    }
  };

  return (
    // Animated container for the command bar with glassy styling
    <motion.div
      // Styling: Glassy blue background, blur, rounded, shadow, border
      className="w-full max-w-3xl mx-auto bg-[#06647B]/30 backdrop-blur-lg rounded-full shadow-lg overflow-hidden border border-[#06647B]/50"
      initial={{ y: -50, opacity: 0 }} // Initial animation state (off-screen)
      animate={{ y: 0, opacity: 1 }} // Final animation state (in position)
      transition={{ duration: 0.3 }} // Animation duration
    >
      <div className="flex items-center px-4 py-2"> {/* Flex container for input elements */}
        {/* Search Icon */}
        <FaSearch className="text-cyan-200/70 mr-3 flex-shrink-0" />
        {/* Input Field */}
        <input
          ref={inputRef} // Assign ref for focusing
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)} // Update state on change
          onKeyDown={handleKeyDown} // Handle Enter key
          placeholder="Type a command (about me, projects, skills, connect)..." // User prompt
          // Styling: Transparent background, white text, cyan placeholder
          className="flex-grow bg-transparent text-white border-none outline-none placeholder-cyan-100/50 text-lg" // Increased text size
        />
        {/* Send Button */}
        <button
          onClick={handleSubmit} // Handle button click
          // Styling: Changes background on hover/focus when enabled
          className={`ml-3 p-2 rounded-full ${command.trim() ? "bg-cyan-500/30 hover:bg-cyan-500/50" : "text-cyan-100/30 cursor-not-allowed"} transition-colors flex-shrink-0`}
          disabled={!command.trim()} // Disable button if input is empty
        >
          <FaPaperPlane className="text-white" />
        </button>
      </div>
    </motion.div>
  );
}
