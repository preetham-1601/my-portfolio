// src/app/components/ProjectListSection.js
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Import Image component

// Component to display the list of project cards
// Accepts projects array and onSelectProject callback from parent (page.js)
export default function ProjectListSection({ projects = [], onSelectProject }) {
  return (
    <motion.div
        key="projectsList" // Key for AnimatePresence
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        // Container for the project cards list view
        className="w-full max-w-4xl mx-auto px-4 py-6" // Wider container for projects
    >
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white text-center md:text-left">
            My Work / Projects
        </h2>

        {/* Grid layout for project cards */}
        {/* Adjust columns (grid-cols-*) and gap as needed */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
                <motion.div
                    key={project.id}
                    // Card styling
                    className="flex flex-col bg-[#06647B]/20 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-[#06647B]/40 cursor-pointer transition-all duration-300 hover:border-[#06647B]/80 hover:shadow-cyan-glow/30"
                    // Card animation
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }} // Stagger animation
                    onClick={() => onSelectProject(project.id)} // Call handler on click
                    whileHover={{ y: -5 }} // Lift effect on hover
                >
                    {/* Project Image */}
                    {project.imageUrl ? (
                        <div className="w-full h-48 bg-gray-700/50 overflow-hidden">
                             <Image
                                src={project.imageUrl}
                                alt={`Preview of ${project.title}`}
                                width={400} // Adjust based on typical card width
                                height={225} // Adjust for 16:9 aspect ratio
                                className="object-cover w-full h-full"
                                onError={(e) => { e.target.style.display = 'none'; /* Hide broken image */ }}
                            />
                        </div>
                    ) : (
                        // Placeholder if no image
                        <div className="w-full h-48 bg-gray-800/30 flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}
                    {/* Text Content */}
                    <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold text-cyan-200 mb-2">{project.title}</h3>
                            <p className="text-sm text-gray-300 mb-3 line-clamp-3">{project.shortDesc}</p>
                        </div>
                         {/* Tech Tags */}
                         <div className="flex flex-wrap gap-1 mt-2">
                            {project.tech.slice(0, 3).map(tech => ( // Show first 3 techs
                                <span key={tech} className="bg-gray-600/60 text-gray-200 px-2 py-0.5 rounded-full text-xs border border-gray-500/50">
                                    {tech}
                                </span>
                            ))}
                            {project.tech.length > 3 && (
                                <span className="text-gray-400 text-xs py-0.5">...</span>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.div>
  );
}
