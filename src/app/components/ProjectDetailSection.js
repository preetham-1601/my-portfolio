// src/app/components/ProjectDetailSection.js
"use client";

import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Main Detail Section Component - Uses forwardRef
const ProjectDetailSection = forwardRef(({ project, onBack, onSectionChange }, ref) => {
    // No local state needed for activeSectionId, it's managed in page.js

    const sectionRefs = useRef({}); // Store refs { id: ref element, ... }

    // Memoize sections array derived from prop
    const sections = useMemo(() => project?.detailSections || [], [project]);

    // Expose scrollToSection method to parent (page.js) via ref
    useImperativeHandle(ref, () => ({
        scrollToSection(id) {
            // Find the element associated with the ref by ID
            const element = sectionRefs.current[id];
            if (element) {
                 element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start', // Align top of section slightly below top edge
                 });
            } else {
                 console.warn(`Attempted to scroll to non-existent section ref: ${id}`);
            }
        }
    }));

    // Effect for Intersection Observer (Scroll Spy)
    useEffect(() => {
        // Ensure sections exist and onSectionChange is a function
        if (!sections || sections.length === 0 || typeof onSectionChange !== 'function') {
             console.log("Observer setup skipped: No sections or onSectionChange handler.");
             return;
        }

        const observerOptions = {
            root: null, // Use viewport
            rootMargin: '-20% 0px -20% 0px', // Adjust: Trigger when section top is 25% from viewport top or bottom is 70% from viewport bottom
            threshold: 0.01, // Trigger even if only a small part is visible within margins
        };

        const observerCallback = (entries) => {
            entries.forEach(entry => {
                // Check if intersecting AND if it's reasonably visible within margins
                if (entry.isIntersecting) {
                     console.log(`Intersecting: ${entry.target.id}`);
                     onSectionChange(entry.target.id); // Call callback prop from page.js
                }
             });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Clear previous refs before setting new ones
        sectionRefs.current = {};

        // Observe each section element
        let observedCount = 0;
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
                sectionRefs.current[section.id] = element; // Store element ref
                observer.observe(element);
                observedCount++;
            } else {
                console.warn(`Element with ID ${section.id} not found for observer.`);
            }
        });
         console.log(`Observer setup complete. Observed ${observedCount} elements.`);

        // Cleanup observer on component unmount or when sections/callback change
        return () => {
            console.log("Cleaning up observer...");
            Object.values(sectionRefs.current).forEach((element) => {
                if (element) observer.unobserve(element);
            });
            observer.disconnect();
            sectionRefs.current = {}; // Clear stored refs
        };
    }, [sections, onSectionChange]); // Dependencies for the effect


    // Render checks
    if (!project) {
        return <div className="p-6 text-center text-gray-400">Loading project details...</div>;
    }
    if (!sections || sections.length === 0) {
         return (
            <div className="p-6">
                 <button onClick={onBack} className="mb-6 text-cyan-400 hover:text-cyan-200 transition-colors text-sm inline-flex items-center">&larr; Back to Projects</button>
                 <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{project.title}</h2>
                 <p className="text-gray-400">No detailed sections available for this project yet.</p>
             </div>
         );
    }

    return (
        <motion.div
            key={`detail-${project.id}-content`} // Changed key slightly
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            // Adjust max-width and padding as needed for content area
            className="max-w-4xl mx-auto px-4 py-6"
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-8 text-cyan-400 hover:text-cyan-200 transition-colors text-sm inline-flex items-center group" // Added group
            >
                 <span className="transition-transform duration-200 group-hover:-translate-x-1">&larr;</span> Back to Projects
            </button>

            {/* Main Content Article */}
             <article className="space-y-12 md:space-y-16"> {/* Increased spacing */}
                 {/* Project Title (optional if displayed elsewhere) */}
                 <h2 className="text-3xl md:text-4xl font-bold text-white">{project.title}</h2>

                 {/* Render dynamic sections */}
                 {sections.map((section) => (
                    <section
                        key={section.id}
                        id={section.id} // ID for scrolling & observer target
                        className="scroll-mt-24" // Offset scroll target (adjust based on sticky header height)
                    >
                        <h3 className="text-2xl font-semibold text-cyan-300 mb-4">{section.title}</h3>
                         {section.content && (
                            <p className="text-gray-300 leading-relaxed whitespace-pre-line"> {/* Preserve line breaks */}
                                {section.content}
                            </p>
                         )}
                         {/* Render optional image for the section */}
                         {section.image && (
                            <div className="mt-6 rounded-lg overflow-hidden shadow-lg border border-white/10 aspect-video relative bg-gray-900/30">
                                 {/* Using layout="fill" for better responsive handling within aspect-ratio box */}
                                <Image
                                    src={section.image}
                                    alt={`${section.title} illustration`}
                                    layout="fill"
                                    className="object-contain" // Use 'contain' if you don't want cropping, 'cover' if you do
                                    onError={(e) => { e.target.style.display = 'none'; /* Hide broken image */ }}
                                />
                            </div>
                        )}
                        {/* You can add more complex rendering here based on section data structure */}
                    </section>
                ))}
            </article>
        </motion.div>
    );
});

// Add display name for DevTools
ProjectDetailSection.displayName = 'ProjectDetailSection';

export default ProjectDetailSection;