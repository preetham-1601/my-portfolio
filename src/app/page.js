// src/app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Import Your Actual Components ---
import Welcome from './components/Welcome';
import CommandBar from './components/CommandBar';
import Sidebar from './components/Sidebar';

// --- Placeholder Content Components ---
// (No changes needed in these components)
const AboutContent = () => (
    <motion.div
        key="about"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-6 text-lg bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
    >
        <h2 className="text-3xl font-bold mb-4 text-white">About Me</h2>
        <p className="text-gray-200 leading-relaxed">
            [Preethams detailed bio, background, interests, and professional summary go here. Write a compelling narrative about your journey, skills, and aspirations. Make it engaging!]
        </p>
    </motion.div>
);

const SkillsContent = () => (
    <motion.div
        key="skills"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-6 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
    >
        <h2 className="text-3xl font-bold mb-4 text-white">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Programming Languages</h3>
                <p className="text-gray-200">Python, JavaScript, Java, C++, SQL</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Frameworks & Libraries</h3>
                <p className="text-gray-200">React, Next.js, Node.js, Express, Tailwind CSS, Framer Motion</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Databases</h3>
                <p className="text-gray-200">MongoDB, PostgreSQL, MySQL</p>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Tools & Platforms</h3>
                <p className="text-gray-200">Git, Docker, AWS, Vercel, Figma</p>
            </div>
        </div>
    </motion.div>
);

const ConnectContent = ({ onSubmit }) => {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        setStatus('Sending...');
        console.log("Attempting to send message:", message);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log("Message supposedly sent (simulation).");
            setStatus('Message sent successfully!');
            setMessage('');
            if (onSubmit) onSubmit(message);
            setTimeout(() => setStatus(''), 3000);
        } catch (error) {
            console.error("Connect form submission error:", error);
            setStatus('Failed to send message. Please try again.');
        }
    };

    return (
        <motion.div
            key="connect"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
        >
            <h2 className="text-3xl font-bold mb-4 text-white">Connect with Preetham</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-lg font-medium text-gray-200 mb-2">Send a message:</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-800/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 transition-colors duration-200"
                        placeholder="Let me know what you think or how we can collaborate..."
                        required
                        disabled={status === 'Sending...'}
                    ></textarea>
                </div>
                <div className="flex items-center justify-between h-10">
                     <button
                        type="submit"
                        disabled={!message.trim() || status === 'Sending...'}
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md font-semibold text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                    </button>
                    {status && status !== 'Sending...' && (
                         <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-sm ${status.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}
                         >
                            {status}
                         </motion.p>
                    )}
                </div>
            </form>
        </motion.div>
    );
};

const ProjectList = ({ projects, onSelectProject }) => (
    <motion.div
        key="project-list"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 space-y-4 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
    >
        <h2 className="text-3xl font-bold mb-4 text-white">Projects</h2>
        <p className="text-gray-300 mb-6">Select a project to view details:</p>
        <ul className="space-y-3">
            {projects.map(project => (
                <li key={project.id}>
                    <button
                        onClick={() => onSelectProject(project.id)}
                        className="w-full text-left px-4 py-3 bg-gray-800/40 hover:bg-gray-700/60 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-700/50"
                    >
                        <span className="text-lg font-semibold text-cyan-300">{project.title}</span>
                    </button>
                </li>
            ))}
        </ul>
    </motion.div>
);

const ProjectDetailContent = ({ project, onBack }) => (
    <motion.div
        key={`project-detail-${project.id}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.3 }}
        className="p-6 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 relative border border-white/10"
    >
         <button
            onClick={onBack}
            className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors text-sm mb-4 focus:outline-none z-10 p-2 rounded-md hover:bg-white/10"
          >
            &larr; Back to Projects
          </button>
        <h2 className="text-3xl font-bold mb-4 text-white pt-8">{project.title}</h2>
        <p className="text-gray-200 leading-relaxed mb-4">{project.description}</p>
        <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-2">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
                {project.tech.map(tech => (
                    <span key={tech} className="bg-gray-700/50 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-600">
                        {tech}
                    </span>
                ))}
            </div>
        </div>
         {project.link && (
             <div className="mt-6">
                 <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-cyan-600 text-white text-sm rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-300"
                 >
                     View Project/Demo &rarr;
                 </a>
             </div>
         )}
    </motion.div>
);


// --- Main Page Component (Root for this page) ---
export default function Home() {
    // --- State Variables ---
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
    const [activeSection, setActiveSection] = useState('none');
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // --- Placeholder Project Data ---
    const projects = [
        { id: 'p1', title: 'Project Alpha', description: 'Detailed description for Project Alpha. This project aimed to solve problem X using technology Y, resulting in Z improvements.', tech: ['React', 'Node.js', 'MongoDB'], link: '#' },
        { id: 'p2', title: 'Futuristic Portfolio', description: 'The very portfolio you are looking at. Built with Next.js and Framer Motion for a dynamic, interactive experience.', tech: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'], link: '#' },
        { id: 'p3', title: 'Data Analysis Tool', description: 'A web-based tool for uploading and analyzing datasets, providing insightful visualizations.', tech: ['Python', 'Pandas', 'Flask', 'Plotly'], link: '#' },
    ];

    // --- Event Handlers ---
    const handleWelcomeDismiss = () => {
        setIsWelcomeVisible(false);
    };

    const handleCommand = (command) => {
        const lowerCaseCommand = command.toLowerCase().trim();
        console.log("Command received:", lowerCaseCommand);

        if (isWelcomeVisible) {
            setIsWelcomeVisible(false);
        }
        if (!lowerCaseCommand.includes('project')) {
             setSelectedProject(null);
        }

        if (lowerCaseCommand.includes('about')) {
            setActiveSection('about');
            setShowSidebar(true);
        } else if (lowerCaseCommand.includes('project')) {
            setActiveSection('projectsList');
            setSelectedProject(null);
            setShowSidebar(true);
        } else if (lowerCaseCommand.includes('skill')) {
            setActiveSection('skills');
            setShowSidebar(false);
        } else if (lowerCaseCommand.includes('connect') || lowerCaseCommand.includes('contact')) {
            setActiveSection('connect');
            setShowSidebar(false);
        } else if (lowerCaseCommand === 'close sidebar' || lowerCaseCommand === 'hide sidebar') {
             setShowSidebar(false);
        } else if (lowerCaseCommand) {
            setActiveSection('none');
            console.log("Unrecognized command:", lowerCaseCommand);
        } else {
             setActiveSection('none');
        }
    };

    const handleProjectSelect = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            setActiveSection('projectDetail');
            setShowSidebar(true);
        } else {
            console.warn("Project not found for ID:", projectId);
            setActiveSection('projectsList');
        }
    };

    const handleBackToProjects = () => {
        setSelectedProject(null);
        setActiveSection('projectsList');
    };

     const handleConnectSubmit = (messageContent) => {
        console.log("Parent notified: Connect form submitted with message:", messageContent);
    };

    // --- Content Rendering Logic ---
    const renderMainContent = () => {
        return (
             <AnimatePresence mode="wait">
                {(() => {
                    switch (activeSection) {
                        case 'about':
                            return <AboutContent key="about" />;
                        case 'projectsList':
                             return <ProjectList key="projectsList" projects={projects} onSelectProject={handleProjectSelect} />;
                        case 'projectDetail':
                            return selectedProject ? <ProjectDetailContent key={`detail-${selectedProject.id}`} project={selectedProject} onBack={handleBackToProjects} /> : <ProjectList key="projectsList-fallback" projects={projects} onSelectProject={handleProjectSelect} />;
                        case 'skills':
                            return <SkillsContent key="skills" />;
                        case 'connect':
                            return <ConnectContent key="connect" onSubmit={handleConnectSubmit} />;
                        case 'none':
                             return <motion.div key="prompt" initial={{opacity:0}} animate={{opacity:1}} className="p-6 text-center text-gray-300 text-lg">Type a command lik</motion.div>;
                        default:
                            return <motion.div key="unknown" className="p-6 text-center text-red-400">Please enter a valid command.</motion.div>;
                    }
                })()}
            </AnimatePresence>
        );
    };

    // --- JSX Structure ---
    return (
        <div className="flex h-screen text-gray-100 overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence>
                {showSidebar && (
                    <Sidebar
                        isOpen={showSidebar}
                        onClose={() => setShowSidebar(false)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">

                 {/* Welcome Screen Overlay */}
                 <AnimatePresence>
                    {isWelcomeVisible && (
                         <motion.div
                            key="welcome-overlay"
                            // Apply the gradient directly to the overlay
                            // Use the same gradient as the body for consistency
                            // Added backdrop-blur-md for effect
                            className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#06647B] to-[#000000] backdrop-blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Welcome
                                onDismiss={handleWelcomeDismiss}
                                onCommandSubmit={handleCommand}
                            />
                         </motion.div>
                    )}
                 </AnimatePresence>

                {/* Command Bar */}
                {!isWelcomeVisible && (
                     <div className="w-full p-4 z-10">
                        <CommandBar onSubmit={handleCommand} autoFocus={true} />
                    </div>
                )}

                {/* Dynamic Content Area */}
                 <div className="flex-1 overflow-y-auto p-4 pt-0">
                     {!isWelcomeVisible && renderMainContent()}
                 </div>

            </main>
        </div>
    );
}
