// src/app/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Import Main Layout Components ---
import Welcome from './components/Welcome';
import TextEntry from './components/TextEntry'; // Using TextEntry as main input
import Sidebar from './components/Sidebar';
import FluidHeader from './components/FluidHeader'; // *** ADDED: Import FluidHeader ***
import TicTacToeGame from './components/TicTacToeGame'; // Keep if using game logic

// --- Import Section Components ---
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ConnectSection from './components/ConnectSection';
import ProjectListSection from './components/ProjectListSection';
import ProjectDetailSection from './components/ProjectDetailSection';
// ---------------------------------

// --- Main Page Component ---
export default function Home() {
    // --- State Variables ---
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
    const [activeSection, setActiveSection] = useState('none'); // 'none', 'about', 'projectsList', 'projectDetail', 'skills', 'connect', 'game'
    const [selectedProject, setSelectedProject] = useState(null); // Holds the *object* of the selected project
    const [showTopLeftHeader, setShowTopLeftHeader] = useState(false); // Controls top-left header visibility
    const [displayedCommand, setDisplayedCommand] = useState(""); // State for text in command bar
    const [isHeaderHovered, setIsHeaderHovered] = useState(false); // *** ADDED: State for hover effect ***

    // --- Data ---
    // Suggestions for command bar
    const suggestions = ["About Me", "My Work", "Skills", "Connect with me", "Wanna play a small game?"];

    // Project data (can be moved to a separate file later, e.g., src/data/projects.js)
    const projects = [
        {
            id: 'p1', // Example: Voodies (Make it wide)
            title: 'Voodies',
            shortDesc: 'A startup revolutionizing food discovery...',
            tech: ['React Native', 'Firebase', 'UX/UI'],
            imageUrl: '/images/voodies.jpg', // Replace with your actual image path
            liveLink: '#',
            repoLink: '...',
            layoutSpan: 2 // **** ADD THIS: 2 means span 2 columns ****
        },
        {
            id: 'p2', // Example: Neuroscience Foundation (Narrow)
            title: 'Neuroscience Foundation',
            shortDesc: 'Revamped the website...',
            description: '...',
            tech: ['Webflow', 'CMS', 'UI Design'],
            imageUrl: '/images/neuroscience.jpg',
            liveLink: '#',
            repoLink: null,
            layoutSpan: 1 // **** ADD THIS: 1 means span 1 column ****
        },
        {
            id: 'p3', // Example: Tee's Shirt (Make it wide)
            title: 'Tee\'s Shirt',
            shortDesc: 'A compelling e-commerce design...',
            description: '...',
            tech: ['Figma', 'Prototyping', 'E-commerce'],
            imageUrl: '/images/tees-shirt.jpg',
            liveLink: '#',
            repoLink: null,
            layoutSpan: 2 // **** ADD THIS: 2 means span 2 columns ****
        },
         {
            id: 'p4', // Example: Android Gifting (Narrow)
            title: 'An Android Gifting Application',
            shortDesc: 'E-commerce application like amazon...',
            description: '...',
            tech: ['Android', 'Java', 'XML'],
            imageUrl: '/images/gifting-app.jpg',
            liveLink: '#',
            repoLink: null,
            layoutSpan: 1 // **** ADD THIS: 1 means span 1 column ****
        },
        // ... add layoutSpan: 1 or layoutSpan: 2 to all your projects
    ];
    // --------------------------

    // --- Event Handlers ---

    // Called by Welcome component when it should be dismissed
    const handleWelcomeDismiss = () => {
        setIsWelcomeVisible(false); // Hide the overlay
        setShowTopLeftHeader(true); // Show the top-left back arrow/header
        if (activeSection === 'none') { /* Optionally set default section */ }
    };

    // Command Handler - Handles commands from Welcome or main TextEntry
    const handleCommand = (command) => {
        console.log("Command received in Page:", command);
        if (isWelcomeVisible) { setIsWelcomeVisible(false); setShowTopLeftHeader(true); }
        if (!command.includes('project') && !command.includes('work')) { // Clear project unless navigating within projects
             setSelectedProject(null);
        }

        let commandTextToShow = "";
        let nextSection = 'none'; // Default to 'none' if command not recognized
        let nextShowSidebar = false; // Default to hidden

        if (command.includes('about')) {
            nextSection = 'about'; nextShowSidebar = true; commandTextToShow = "About Me";
        } else if (command.includes('project') || command.includes('work')) {
            nextSection = 'projectsList'; nextShowSidebar = true; commandTextToShow = "My Work";
            // Don't clear selectedProject here, allow direct navigation via command if needed later
        } else if (command.includes('skill')) {
            nextSection = 'skills'; nextShowSidebar = false; commandTextToShow = "Skills";
        } else if (command.includes('connect') || command.includes('contact')) {
            nextSection = 'connect'; nextShowSidebar = false; commandTextToShow = "Connect with me";
        } else if (command.includes('game') || command.includes('play')) {
            nextSection = 'game'; nextShowSidebar = false; commandTextToShow = "Wanna play a small game?";
        } else if (command === 'close sidebar' || command === 'hide sidebar') {
            nextShowSidebar = false; commandTextToShow = displayedCommand; // Keep current text
            nextSection = activeSection; // Stay in current section
        } else if (command) { // Unrecognized command
            nextSection = 'none'; nextShowSidebar = false; commandTextToShow = command;
            console.log("Unrecognized command:", command);
        } else { // Empty command
            nextSection = 'none'; commandTextToShow = "";
        }

        setActiveSection(nextSection);
        setShowSidebar(nextShowSidebar);
        setDisplayedCommand(commandTextToShow);
    };

    
    // Handler for Back Arrow/Header Click - Modified to return to Welcome screen
 const handleGoBack = () => {
    console.log("Back arrow/header clicked! Returning to Welcome screen.");
    setIsWelcomeVisible(true);    // *** ADDED: Show Welcome overlay ***
    setShowTopLeftHeader(false);  // *** ADDED: Hide top-left header ***
    setActiveSection('none');     // Keep: Reset section state
    setDisplayedCommand('');      // Keep: Clear command bar text
    setShowSidebar(false);        // Keep: Ensure sidebar is closed
    setSelectedProject(null);     // Keep: Clear any selected project
    // Reset hover state for cleanliness, although the component is unmounting
    setIsHeaderHovered(false);
};
    // Handles selecting a project from list or sidebar
    const handleProjectSelect = (projectId) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project); // Store the full project object
            setActiveSection('projectDetail'); // Switch view
            setShowSidebar(true); // Keep sidebar open
            setDisplayedCommand(`My Work: ${project.title}`); // Update command bar text
        } else {
            console.warn("Project not found:", projectId);
            setActiveSection('projectsList'); // Fallback
            setDisplayedCommand("My Work");
        }
     };

    // Handles going back from project detail view
    const handleBackToProjects = () => {
        setSelectedProject(null); // Clear selected project
        setActiveSection('projectsList'); // Go back to the project list view
        setDisplayedCommand("My Work"); // Reset command bar text
     };

    const handleConnectSubmit = (messageContent) => {
        console.log("Connect submitted in Page:", messageContent);
        // Add logic here (e.g., show thank you message, clear section)
        setActiveSection('none'); // Example: go back to default prompt
        setDisplayedCommand("");
    };

    // --- Render main content based on activeSection ---
    const renderMainContent = () => {
         return (
              <AnimatePresence mode="wait">
                  {(() => {
                      switch (activeSection) {
                          case 'about':
                              return <AboutSection key="about" />;
                          case 'projectsList':
                              // Pass projects data and selection handler
                              return <ProjectListSection key="projectsList" projects={projects} onSelectProject={handleProjectSelect} />;
                          case 'projectDetail':
                              // Render detail only if a project is selected, otherwise show list
                              return selectedProject ? <ProjectDetailSection key={`detail-${selectedProject.id}`} project={selectedProject} onBack={handleBackToProjects} /> : <ProjectListSection key="projectsList-fallback" projects={projects} onSelectProject={handleProjectSelect} />;
                          case 'skills':
                              return <SkillsSection key="skills" />;
                          case 'connect':
                              // Pass the submission handler
                              return <ConnectSection key="connect" onSubmit={handleConnectSubmit} />;
                          case 'game':
                              return (
                                  <motion.div key="tic-tac-toe-main" className="flex justify-center items-start pt-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} >
                                      <TicTacToeGame />
                                  </motion.div>
                              );
                          case 'none':
                          default: // Default to prompt message
                               return <motion.div key="prompt" initial={{opacity:0}} animate={{opacity:1}} className="p-6 text-center text-gray-300 text-lg">Type a command like &apos;about&lsquo;.</motion.div>;
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
                        onClose={() => handleCommand('close sidebar')}
                        projects={projects}
                        activeSection={activeSection}
                        selectedProjectId={selectedProject?.id}
                        onSelectProject={handleProjectSelect}
                        onSelectSection={(sectionCmd) => handleCommand(sectionCmd)}
                    />
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative">

                {/* --- MODIFIED: Top-Left Header Interaction --- */}
                <AnimatePresence>
                    {showTopLeftHeader && (
                        <motion.div
                            // No layoutId needed here as it's not animating from Welcome center in this version
                            key="fluid-header-top-left-container" // Use a consistent key if preferred
                            // Use styling from Snippet 1's container for better fit with FluidHeader
                            className="absolute top-0 left-0 z-30 p-2 md:p-3 w-auto h-auto cursor-pointer group"
                            onMouseEnter={() => setIsHeaderHovered(true)} // *** ADDED ***
                            onMouseLeave={() => setIsHeaderHovered(false)} // *** ADDED ***
                            onClick={handleGoBack} // Keep existing handler
                            // Keep entry/exit animation from original Snippet 2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* AnimatePresence to switch between PK and Arrow */}
                            <AnimatePresence initial={false} mode="wait">
                                {/* Show FluidHeader "PK" when NOT hovered */}
                                {!isHeaderHovered && (
                                    <motion.div
                                        key="pk-header" // Unique key
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FluidHeader
                                            text="PK" // Use initials
                                            isTopLeft={true} // Indicate corner position
                                            // glowMode defaults to 'idle'
                                        />
                                    </motion.div>
                                )}
                                {/* Show FluidHeader "<" when hovered */}
                                {isHeaderHovered && (
                                    <motion.div
                                        key="back-arrow-header" // Unique key
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FluidHeader
                                            text="<" // Use back arrow character
                                            isTopLeft={true} // Indicate corner position
                                            glowMode="full"// glowMode defaults to 'idle'
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* ------------------------------------------- */}


                {/* Welcome Screen Overlay */}
                <AnimatePresence>
                    {isWelcomeVisible && (
                         <motion.div key="welcome-overlay" className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#06647B] to-[#000000] backdrop-blur-md pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} >
                             <Welcome
                                 onDismiss={handleWelcomeDismiss}
                                 onCommandSubmit={handleCommand}
                                 suggestions={suggestions}
                             />
                         </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Text Entry Bar */}
                {!isWelcomeVisible && (
                     <div className="w-full p-4 z-10 flex-shrink-0 pt-16 sm:pt-20 md:pt-24"> {/* Adjusted padding-top */}
                         <TextEntry
                             onSubmit={handleCommand}
                             placeholder="Type command or ask question..."
                             suggestions={suggestions}
                             currentCommand={displayedCommand} // Pass displayed command
                         />
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