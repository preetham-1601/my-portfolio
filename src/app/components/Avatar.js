// src/app/components/Avatar.js
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaRegHandPeace } from "react-icons/fa"; // Example icon

// Basic placeholder Avatar component
// In a real app, this would be an SVG or Image with different poses
export default function Avatar({ pose, ...props }) {
  // Simple visual change based on pose (example)
  const styles = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#2dd4bf', // Teal color
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'black',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    cursor: 'pointer', // Make it look clickable
  };

  // Add a simple wave animation using rotation
  const waveAnimation = {
      rotate: [0, -15, 15, -15, 0], // Simple wave rotation
      transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }
  };

  return (
    // Use motion.div to allow animation props to be passed
    <motion.div style={styles} {...props}>
      {/* Example: Show different content based on pose */}
      {pose === 'waving' ? (
        <motion.span animate={waveAnimation} style={{ display: 'inline-block' }}>
          <FaRegHandPeace />
        </motion.span>
      ) : pose === 'standing' ? (
        '🧍' // Simple emoji representation
      ) : pose === 'running' ? (
        '🏃' // Simple emoji representation
      ) : (
        '😊' // Default sitting/smiling
      )}
    </motion.div>
  );
}
