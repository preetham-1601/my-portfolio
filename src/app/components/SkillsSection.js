// src/app/components/SkillsSection.js
"use client";
import React from 'react';
import { motion } from 'framer-motion';

// Component to display the Skills & Technologies section
export default function SkillsSection() {
  // --- TODO: Replace placeholder skills with your actual skills ---
  const skillsData = {
        languages: ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'HTML', 'CSS'],
        frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS', 'Framer Motion', 'Flask', 'Django'],
        databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Supabase'],
        tools: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'Linux', 'Jira'],
  };
  // -------------------------------------------------------------

  return (
    <motion.div
        key="skills" // Key for AnimatePresence
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
    >
        <h2 className="text-3xl font-bold mb-4 text-white">Skills & Technologies</h2>
        {/* Grid layout for skill categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Map through the skillsData object */}
            {Object.entries(skillsData).map(([category, skills]) => (
                <div key={category}>
                    {/* Category Title */}
                    <h3 className="text-xl font-semibold text-cyan-400 mb-2 capitalize">
                        {category.replace(/([A-Z])/g, ' $1').trim()} {/* Add space before capitals */}
                    </h3>
                    {/* List of skills in the category */}
                    <div className="flex flex-wrap gap-2">
                         {skills.map(skill => (
                            <span key={skill} className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </motion.div>
  );
}
