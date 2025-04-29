// src/app/components/AboutSection.js
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // If using Next/Image for logos

// Placeholder data for logos and accomplishments (replace with real data)
const companyLogos = {
    voodies: '/logos/voodies-logo.svg', // Replace with actual path
    neuroscience: '/logos/neuroscience-logo.svg', // Replace with actual path
    // Add logos for companies critiqued if available
    critiqueCompany1: '/logos/critique-logo1.svg',
};

const accomplishmentsData = [
    { id: 'a1', title: 'Google UX Design Certificate', date: 'Jul 2024', description: 'Completed the Google UX Design Certificate, a rigorous hands-on program covering the entire UX design process...', image: '/images/google-ux-cert.png'}, // Replace with actual path
    { id: 'a2', title: 'UX & Rapid Prototyping Graduate Teaching Assistant', date: 'Jan 2023 - May 2024', description: 'Assisted in class delivery, focusing on prototype development from conceptualization to execution...', image: '/images/teaching-assistant.png'}, // Replace with actual path
    { id: 'a3', title: 'Mobile Application Development Lead - GDSC', date: 'Aug 2021 - Aug 2022', description: 'Led a team in conducting sessions and interacting with students for Android Application Development...', image: '/images/gdsc-lead.png'}, // Replace with actual path
];

// Simple Floating Logo Component (Example)
const FloatingLogo = ({ src, alt, size = 'w-16 h-16', positionClass = '', bgColor = 'bg-white' }) => (
    <motion.div
        className={`absolute rounded-full shadow-lg ${bgColor} ${size} ${positionClass} flex items-center justify-center overflow-hidden border-2 border-white/50`}
        animate={{ y: [-3, 3, -3], transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 1 } }} // Subtle float animation
    >
        {src ? (
             <Image src={src} alt={alt} width={parseInt(size.split('-')[1])*3} height={parseInt(size.split('-')[1])*3} className="p-1 object-contain"/>
        ) : (
            <div className="w-full h-full bg-gray-400"></div> // Placeholder circle if no src
        )}
    </motion.div>
);

export default function AboutSection() {
    const quote = `"The future belongs to those who believe in the beauty of their dreams... and can build them."`;

    return (
        <motion.div
            key="about-redesigned"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            // Main container: Maintain glass background, padding, etc.
            className="p-6 md:p-8 max-w-4xl mx-auto space-y-12 text-lg leading-relaxed text-gray-200 bg-black/40 backdrop-blur-xl rounded-lg shadow-xl border border-white/10"
        >
            {/* 1. Quote with lines on both sides */}
            <div className="relative text-center py-4">
                {/* Lines using pseudo-elements or divs */}
                <span className="absolute left-0 top-1/2 w-1/4 h-px bg-gradient-to-l from-cyan-500/50 via-cyan-500/20 to-transparent transform -translate-y-1/2"></span>
                <blockquote className="italic text-cyan-300 text-xl md:text-2xl px-4 z-10 relative inline-block">
                    {quote}
                    <span className="block text-sm text-cyan-400/80 mt-2">- Bridging Design & Code</span>
                </blockquote>
                <span className="absolute right-0 top-1/2 w-1/4 h-px bg-gradient-to-r from-cyan-500/50 via-cyan-500/20 to-transparent transform -translate-y-1/2"></span>
            </div>

            {/* 2. Core Bio */}
            <p className="text-center max-w-3xl mx-auto">
                 Hello! I&apos;m Preetham Kasturi, a passionate creator thriving at the intersection of human-centered design and robust development. As a recent Master&apos;s graduate, I&apos;m driven to craft digital experiences that are not only visually stunning and intuitive but also technically sound and performant. This very portfolio is a playground for that philosophy, built with Next.js, Tailwind, and Framer Motion to showcase work in an interactive way.
            </p>

            {/* 3. Experience Section Divider */}
            <hr className="border-t border-white/10 my-10" />

            {/* 4. Products Designed Section */}
            <section className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[150px] md:min-h-[200px]">
                 {/* Logos on the Right (Absolute positioning relative to the section) */}
                <div className="relative h-full order-1 md:order-2 min-h-[100px] md:min-h-full">
                    <FloatingLogo src={companyLogos.voodies} alt="Voodies Logo" size="w-20 h-20" positionClass="top-0 right-10" bgColor="bg-green-900/50"/>
                    <FloatingLogo src={companyLogos.neuroscience} alt="Neuroscience Logo" size="w-16 h-16" positionClass="bottom-0 right-1/4" bgColor="bg-white/80"/>
                     {/* Add more logos as needed */}
                </div>
                 {/* Text on the Left */}
                <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-bold text-white mb-3">Products Designed an built for companies</h3>
                    
                </div>
            </section>

            {/* 5. Design Critiques Section */}
             <section className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[150px] md:min-h-[200px]">
                 {/* Text on the Right */}
                <div className="order-2 text-right">
                     <h3 className="text-2xl font-bold text-white mb-3 ">Design Critiques for Companies</h3>
                    
                </div>
                 {/* Logos on the Left (Absolute positioning relative to the section) */}
                <div className="relative h-full order-1 min-h-[100px] md:min-h-full">
                     {/* Using placeholders */}
                     <FloatingLogo src={companyLogos.critiqueCompany1} alt="Critique Company 1 Logo" size="w-16 h-16" positionClass="top-5 left-1/4" bgColor="bg-purple-900/50"/>
                     <FloatingLogo src={null} alt="Placeholder Logo" size="w-20 h-20" positionClass="bottom-5 left-5" bgColor="bg-white/80"/>
                      {/* Add more logos as needed */}
                </div>
            </section>

             {/* 6. Accomplishments Section */}
            <section>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Accomplishments</h3>
                 {/* Grid for Accomplishment Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accomplishmentsData.map((item) => (
                        <motion.div
                            key={item.id}
                            className="flex flex-col bg-black/30 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-white/15 p-4 text-sm transition-shadow duration-300 hover:shadow-cyan-glow/20"
                            whileHover={{ y: -3 }}
                         >
                            {item.image && (
                                <div className="w-full h-32 bg-gray-700/30 rounded mb-3 overflow-hidden">
                                    <Image src={item.image} alt={item.title} width={300} height={160} className="object-cover w-full h-full"/>
                                </div>
                            )}
                            <h4 className="font-semibold text-cyan-300 mb-1">{item.title}</h4>
                            {item.date && <p className="text-xs text-gray-400 mb-2">{item.date}</p>}
                            <p className="text-gray-300 line-clamp-4">{item.description}</p>
                         </motion.div>
                    ))}
                </div>
            </section>

        </motion.div>
    );
}