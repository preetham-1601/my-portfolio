// src/app/components/ProjectDetailSection.js
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Import Image component

// Component to display the details of a single selected project
// Accepts the project object and onBack callback from parent (page.js)
export default function ProjectDetailSection({ project, onBack }) {
  // Fallback if project data is somehow missing
  if (!project) {
    return (
      <motion.div className="p-6 text-center text-red-400">
        Project details not found.
        <button onClick={onBack} className="mt-4 text-cyan-400 hover:underline">Go Back</button>
      </motion.div>
    );
  }

  return (
    <motion.div
        key={`project-detail-${project.id}`} // Key ensures re-animation if project changes
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        // Styling for the detail view container
        className="p-4 md:p-6 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 relative border border-white/10 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 180px)' }} // Adjust max height to prevent overflow, consider header/footer height
    >
         {/* Close/Back Button */}
         <button
            onClick={onBack} // Call the onBack handler from page.js
            aria-label="Close project details"
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors text-2xl mb-4 focus:outline-none z-10 p-1 rounded-md hover:bg-white/10"
          >
            &times; {/* Close icon */}
          </button>

        {/* Project Title */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white pt-8">{project.title}</h2>

        {/* Project Image */}
        {project.imageUrl && (
             <div className="mb-6 aspect-video w-full max-w-2xl mx-auto overflow-hidden rounded-lg border border-gray-700">
                <Image
                    src={project.imageUrl}
                    alt={`Screenshot of ${project.title}`}
                    width={1280} // Provide appropriate dimensions for your largest image variant
                    height={720}
                    className="object-cover w-full h-full"
                    priority // Load image eagerly if it's the main content
                    onError={(e) => { e.target.style.display = 'none'; /* Hide broken image */ }}
                />
             </div>
        )}

        {/* Project Description */}
        <h3 className="text-xl font-semibold text-cyan-400 mb-2 mt-4">Description</h3>
        {/* Use whitespace-pre-line to respect line breaks (\n) in the description string */}
        <p className="text-gray-200 leading-relaxed mb-6 whitespace-pre-line">{project.description}</p>

        {/* Technologies Used */}
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">Technologies Used</h3>
        <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map(tech => (
                <span key={tech} className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                    {tech}
                </span>
            ))}
        </div>

         {/* Links Section */}
         {(project.liveLink || project.repoLink) && (
            <div className="mt-6 border-t border-white/10 pt-4 flex flex-wrap gap-4">
                {project.liveLink && (
                    <a
                        href={project.liveLink} target="_blank" rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-cyan-600 text-white text-sm rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-300"
                    >
                        View Live Demo &rarr;
                    </a>
                )}
                 {project.repoLink && (
                    <a
                        href={project.repoLink} target="_blank" rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-gray-600 text-white text-sm rounded-md font-semibold hover:bg-gray-700 transition-colors duration-300"
                    >
                        View Code &lt;/&gt;
                    </a>
                )}
            </div>
         )}
    </motion.div>
  );
}
