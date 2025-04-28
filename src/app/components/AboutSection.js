// src/app/components/AboutSection.js
"use client";
import React from 'react';
import { motion } from 'framer-motion'; // Import motion for animations

// Component to display the "About Me" content
export default function AboutSection() {
  return (
    // Motion div for potential animations controlled by the parent (page.js)
    <motion.div
        key="about" // Key helps AnimatePresence in the parent track this component
        initial={{ opacity: 0, y: 20 }} // Initial animation state (fade in, slide up)
        animate={{ opacity: 1, y: 0 }} // Animation target state
        exit={{ opacity: 0, y: -20 }} // Exit animation state (fade out, slide up)
        transition={{ duration: 0.3 }} // Animation duration
        // Styling for the section container
        className="p-6 text-lg bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
    >
        <h2 className="text-3xl font-bold mb-4 text-white">About Me</h2>
        {/* --- TODO: Replace this placeholder with your actual bio --- */}
        <p className="text-gray-200 leading-relaxed whitespace-pre-line">
            [Preethams detailed bio, background, interests, and professional summary go here.
            Write a compelling narrative about your journey, skills, and aspirations. Make it engaging!
            You can use multiple paragraphs. Use \n for line breaks if needed, thanks to whitespace-pre-line.]
            <br /><br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        {/* --------------------------------------------------------- */}
    </motion.div>
  );
}
