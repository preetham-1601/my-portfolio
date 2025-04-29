// src/app/components/ProjectIndexNav.js
"use client";
import React from 'react';

export default function ProjectIndexNav({ sections = [], activeSectionId, onNavItemClick }) {
    if (!sections || sections.length === 0) {
        return null; // Don't render if no sections
    }

    return (
        // Container for the index - You can adjust width/styling here
        <div className="w-32 md:w-40"> {/* Example width */}
            {/* Relative container needed for positioning the active dot correctly */}
            <nav className="relative border-l-2 border-dotted border-gray-600/70 ml-2 space-y-4"> {/* Added ml-2 to offset from absolute edge */}
                {sections.map((section) => {
                    const isActive = section.id === activeSectionId;
                    return (
                        // Container for each item (dot + button)
                        <div key={section.id} className="relative pl-6">
                             {/* Active state indicator circle */}
                            {/* Positioned relative to the border-l line */}
                            <span
                                className={`absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                                    isActive ? 'bg-cyan-300 scale-110 ring-2 ring-cyan-300/50' : 'bg-gray-600'
                                }`}
                                // Add aria-hidden if it's purely decorative
                                aria-hidden="true"
                            ></span>
                            {/* Clickable Text */}
                            <button
                                onClick={() => onNavItemClick(section.id)}
                                className={`block w-full text-left transition-colors duration-200 text-sm ${
                                    isActive ? 'text-cyan-300 font-medium' : 'text-gray-400 hover:text-gray-200'
                                }`}
                            >
                                {section.title}
                            </button>
                        </div>
                    );
                })}
            </nav>
        </div>
    );
}