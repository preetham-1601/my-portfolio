// src/app/components/Torch.js
"use client";
import React from 'react';
import { motion } from 'framer-motion';
// Removed icon import, using SVG directly

// Simple Torch component using SVG Placeholder
// Accepts rotation, onClick, and isActive props
export default function Torch({ rotation = 0, onClick, isActive = false, ...props }) {

  // Determine fill colors based on isActive state
  const bodyFill = isActive ? "#FFFFFF" : "#888888"; // White when active, darker grey when off
  const lensFill = isActive ? "#F0F0F0" : "#a1a1aa"; // Light grey/white when active
  const baseFill = isActive ? "#666666" : "#4b5563"; // Darker grey base

  return (
    <motion.button
      onClick={onClick}
      // Remove background/border for a cleaner look
      className="absolute p-0 bg-transparent border-none rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/30 focus:ring-cyan-400"
      style={{
        width: '50px',
        height: '50px', // Make it square for easier rotation origin
      }}
      animate={{ rotate: rotation }}
      transition={{ duration: 0.5, ease: "easeInOut" }} // Control rotation speed
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Activate spotlight"
      {...props}
    >
      {/* Basic SVG Placeholder for a Spotlight */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Main body (trapezoid) - Use dynamic fill */}
        <path d="M30 90 L40 20 L60 20 L70 90 Z" fill={bodyFill} transition="fill 0.3s ease"/>
        {/* Lens area - Use dynamic fill */}
        <ellipse cx="50" cy="20" rx="12" ry="5" fill={lensFill} transition="fill 0.3s ease"/>
        {/* Handle/Base - Use dynamic fill */}
        <rect x="45" y="90" width="10" height="5" fill={baseFill} transition="fill 0.3s ease"/>
      </svg>
    </motion.button>
  );
}
