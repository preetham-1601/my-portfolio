// src/app/components/ChatMessage.js
"use client";
import { motion } from "framer-motion";
import { FaUser, FaRobot } from "react-icons/fa"; // Icons for user/AI

// Component to display a single chat message
export default function ChatMessage({
  message, // The text content of the message
  isUser = false, // Boolean indicating if the message is from the user
  animate = true, // Boolean to enable/disable entry animation
}) {
  // Animation variants for fading/sliding in
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    // Outer container controlling alignment (user right, AI left)
    <motion.div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
      // Apply animation based on 'animate' prop
      initial={animate ? "hidden" : "visible"}
      animate="visible"
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      {/* Inner container with message content and styling */}
      <div
        // Base styling: flex layout, max width
        // Conditional styling based on 'isUser':
        // User: Cyan background, white text
        // AI: Dark glassy background, light text
        className={`flex max-w-[80%] rounded-2xl p-3 shadow-md ${
          isUser
            ? "bg-cyan-600/80 text-white" // User message style
            : "bg-black/30 backdrop-blur-md text-gray-200 border border-white/10" // AI message style
        }`}
      >
        {/* Icon Section */}
        <div className={`mr-3 flex-shrink-0 ${isUser ? 'order-2 ml-3 mr-0' : ''}`}> {/* Move user icon to right */}
          {isUser ? (
            // User Icon styling
            <div className="bg-cyan-700/50 rounded-full p-2 border border-cyan-600/50">
              <FaUser className="text-white h-4 w-4" />
            </div>
          ) : (
            // AI Icon styling
            <div className="bg-gray-700/50 rounded-full p-2 border border-gray-600/50">
              <FaRobot className="text-cyan-300 h-4 w-4" />
            </div>
          )}
        </div>
        {/* Text Content Section */}
        <div className="flex-1">
          {/* Optional: Display sender name (could be removed for cleaner look) */}
          {/* <p className={`font-medium mb-1 text-sm ${isUser ? 'text-cyan-100' : 'text-cyan-400'}`}>
            {isUser ? "You" : "Preetham AI"}
          </p> */}
          {/* Message Text */}
          <p className="leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
