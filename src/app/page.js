// src/app/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { AnimatePresence, motion } from 'framer-motion';

// --- Import Main Layout Components ---
import Welcome from './components/Welcome';
import TextEntry from './components/TextEntry';
// No Sidebar import
import FluidHeader from './components/FluidHeader'; // For top-left PK / <
import TicTacToeGame from './components/TicTacToeGame'; // Keep if using game logic
import ProjectIndexNav from './components/ProjectIndexNav'; // IMPORT THE INDEX NAV

// --- Import Section Components ---
import AboutSection from './components/AboutSection';
import SkillsSection from './components/SkillsSection';
import ConnectSection from './components/ConnectSection';
import ProjectListSection from './components/ProjectListSection';
import ProjectDetailSection from './components/ProjectDetailSection'; // Needs forwardRef internally

// --- Main Page Component ---
export default function Home() {
    // --- State Variables ---
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
    const [activeSection, setActiveSection] = useState('none'); // 'none', 'about', 'projectsList', 'projectDetail', 'skills', 'connect', 'game'
    const [selectedProject, setSelectedProject] = useState(null); // Holds the *object* of the selected project
    const [showTopLeftHeader, setShowTopLeftHeader] = useState(false); // Controls top-left header visibility
    const [displayedCommand, setDisplayedCommand] = useState(""); // State for text in command bar
    const [isHeaderHovered, setIsHeaderHovered] = useState(false); // For top-left header interaction
    // State for active section within ProjectDetail view
    const [activeProjectSectionId, setActiveProjectSectionId] = useState(null);

    // --- Refs ---
    // Ref to call methods on ProjectDetailSection (like scrollToSection)
    const projectDetailRef = useRef();

    // --- Data ---
    const suggestions = ["About Me", "My Work", "Skills", "Connect with me", "Wanna play a small game?"];

    // Example Project data with detailSections (Replace with your actual data)
    const projects = [
        {
            id: 'p1',
            title: 'Voodies',
            shortDesc: 'A startup revolutionizing food discovery...',
            tech: ['React Native', 'Firebase', 'UX/UI'],
            imageUrl: '/images/voodies-preview.jpg', // Preview image for list view
            layoutSpan: 2, // For ProjectListSection layout if using spanning
            detailSections: [
                { id: 'overview', title: 'Overview', content: `Voodies aimed to revolutionize food discovery using location-based recommendations and short-form videos... Key objectives included enhancing user experience, boosting engagement, and fostering community interaction. Our approach involved iterative design, prototyping, and user feedback loops.`, image: '/images/voodies-overview.png' }, // Example path
                { id: 'process', title: 'Process', content: `We followed a user-centered design process encompassing research, ideation, prototyping, design implementation, and usability testing to ensure the final product met user needs effectively.` },
                { id: 'research', title: 'Research', content: `Conducted competitor analysis, user interviews, and surveys to understand pain points and opportunities in the food discovery market. Identified key user personas and their journey maps.`, image: '/images/voodies-research.png' }, // Example path
                { id: 'design', title: 'Design', content: `Developed wireframes and high-fidelity prototypes in Figma, focusing on intuitive navigation and engaging visual elements. Created a design system for consistency across the application.`, image: '/images/voodies-design.png' } // Example path
            ]
        },
        {
            id: 'p2',
            title: 'Neuroscience Foundation',
            shortDesc: 'Revamped the website...',
            tech: ['Webflow', 'CMS', 'UI Design'],
            imageUrl: '/images/neuro-preview.jpg', // Example path
            layoutSpan: 1,
             detailSections: [
                 { id: 'intro', title: 'Introduction', content: 'Content about the Neuroscience project intro...' },
                 { id: 'challenges', title: 'Challenges', content: 'Content about the challenges faced...' },
                 { id: 'solution', title: 'Solution', content: 'Content about the solution implemented...', image: '/images/neuro-solution.png' }, // Example path
            ]
        },
        // Add all your projects with detailSections structure
    ];
    // --------------------------

    // --- Event Handlers ---
    const handleWelcomeDismiss = () => {
        setIsWelcomeVisible(false);
        setShowTopLeftHeader(true);
    };

    const handleCommand = (command) => {
        console.log("Command received in Page:", command);
        const lowerCmd = command.toLowerCase(); // Use lowercased command

        // Dismiss welcome if visible
        if (isWelcomeVisible) {
            setIsWelcomeVisible(false);
            setShowTopLeftHeader(true);
        }

        let commandTextToShow = "";
        let nextSection = 'none';

        // Command Routing
        if (lowerCmd.includes('about')) {
            nextSection = 'about'; commandTextToShow = "About Me";
        } else if (lowerCmd.includes('project') || lowerCmd.includes('work')) {
            nextSection = 'projectsList'; commandTextToShow = "My Work";
            // Keep selected project if already viewing one, otherwise clear it
             if (activeSection !== 'projectDetail') setSelectedProject(null);
        } else if (lowerCmd.includes('skill')) {
            nextSection = 'skills'; commandTextToShow = "Skills";
        } else if (lowerCmd.includes('connect') || lowerCmd.includes('contact')) {
            nextSection = 'connect'; commandTextToShow = "Connect with me";
        } else if (lowerCmd.includes('game') || lowerCmd.includes('play')) {
            nextSection = 'game'; commandTextToShow = "Wanna play a small game?";
        } else if (lowerCmd) { // Unrecognized command
            nextSection = 'none'; commandTextToShow = command; // Show the typed command
            console.log("Unrecognized command:", command);
        } else { // Empty command
            nextSection = 'none'; commandTextToShow = "";
        }

        // Update states
        setActiveSection(nextSection);
        setDisplayedCommand(commandTextToShow);

        // Clear project-specific states if not navigating to/within projects
        if (nextSection !== 'projectDetail' && nextSection !== 'projectsList') {
            setSelectedProject(null);
            setActiveProjectSectionId(null);
        } else if (nextSection === 'projectsList') {
             // If going to list from detail, clear specific selections
             if (activeSection === 'projectDetail') setSelectedProject(null);
             setActiveProjectSectionId(null);
        } else if (nextSection === 'projectDetail' && selectedProject?.detailSections?.length > 0) {
             // Set initial active section when entering project detail
             if (!activeProjectSectionId) setActiveProjectSectionId(selectedProject.detailSections[0].id);
        } else if (nextSection === 'projectDetail') {
             // Handle project with no sections
             setActiveProjectSectionId(null);
        }
    };

    const handleGoBack = () => { // Handles click on top-left FluidHeader (PK / <)
        console.log("Back arrow/header clicked! Returning to Welcome screen.");
        setIsWelcomeVisible(true);
        setShowTopLeftHeader(false);
        setActiveSection('none');
        setDisplayedCommand('');
        setSelectedProject(null);
        setActiveProjectSectionId(null);
        setIsHeaderHovered(false);
    };

    const handleProjectSelect = (projectId) => { // Called from ProjectListSection
        const project = projects.find(p => p.id === projectId);
        if (project) {
            setSelectedProject(project);
            setActiveSection('projectDetail');
            setDisplayedCommand(`My Work: ${project.title}`);
            if (project.detailSections && project.detailSections.length > 0) {
                setActiveProjectSectionId(project.detailSections[0].id); // Set first section active
            } else {
                setActiveProjectSectionId(null);
            }
        } else {
            console.warn("Project not found:", projectId);
            setActiveSection('projectsList'); // Fallback to list
            setDisplayedCommand("My Work");
             setActiveProjectSectionId(null);
        }
     };

    const handleBackToProjects = () => { // Called from ProjectDetailSection
        setSelectedProject(null);
        setActiveSection('projectsList');
        setDisplayedCommand("My Work");
        setActiveProjectSectionId(null);
     };

    const handleConnectSubmit = (messageContent) => {
        console.log("Connect submitted in Page:", messageContent);
        setActiveSection('none');
        setDisplayedCommand("");
    };

    // Handler passed to ProjectIndexNav, calls method on ProjectDetailSection via ref
    const handleScrollToProjectSection = (id) => {
        projectDetailRef.current?.scrollToSection(id);
    };

    // --- Render main content based on activeSection ---
    const renderMainContent = () => {
         return (
             <AnimatePresence mode="wait">
                {(() => {
                    switch (activeSection) {
                        case 'about': return <AboutSection key="about" />;
                        case 'projectsList': return <ProjectListSection key="projectsList" projects={projects} onSelectProject={handleProjectSelect} />;
                        case 'projectDetail':
                             return selectedProject ? (
                                 <ProjectDetailSection
                                     key={`detail-${selectedProject.id}`}
                                     ref={projectDetailRef} // Pass the ref
                                     project={selectedProject}
                                     onBack={handleBackToProjects}
                                     onSectionChange={setActiveProjectSectionId} // Pass setter function down
                                 />
                             ) : (
                                 // Fallback if no project selected (should ideally not happen with proper logic)
                                 <ProjectListSection key="projectsList-fallback" projects={projects} onSelectProject={handleProjectSelect} />
                             );
                        case 'skills': return <SkillsSection key="skills" />;
                        case 'connect': return <ConnectSection key="connect" onSubmit={handleConnectSubmit} />;
                        case 'game': return ( <motion.div key="tic-tac-toe-main" className="flex justify-center items-start pt-8" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} > <TicTacToeGame /> </motion.div> );
                        case 'none': default: return <motion.div key="prompt" initial={{opacity:0}} animate={{opacity:1}} className="p-6 text-center text-gray-300 text-lg">Type a command like 'about', 'projects', 'skills', or 'connect'.</motion.div>;
                    }
                })()}
            </AnimatePresence>
        );
    };


    // --- JSX Structure ---
    return (
        // Main flex container
        <div className="flex h-screen text-gray-100 overflow-hidden"> {/* Added example background */}

            {/* Fixed Project Index Nav (Conditionally Rendered) */}
            <AnimatePresence>
                {activeSection === 'projectDetail' && selectedProject?.detailSections?.length > 0 && (
                    <motion.div
                        key="project-index-nav-fixed"
                        className="fixed left-4 md:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 z-30 hidden md:block" // Position fixed left-center
                        initial={{ x: '-150%', opacity: 0 }}
                        animate={{ x: '0%', opacity: 1 }}
                        exit={{ x: '-150%', opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        <ProjectIndexNav
                            sections={selectedProject.detailSections}
                            activeSectionId={activeProjectSectionId}
                            onNavItemClick={handleScrollToProjectSection}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative overflow-hidden">

                 {/* Top-Left Fluid Header (PK / <) */}
                <AnimatePresence>
                    {showTopLeftHeader && (
                         <motion.div
                            key="fluid-header-top-left-container"
                            className="absolute top-0 left-0 z-40 p-2 md:p-3 w-auto h-auto cursor-pointer group" // Higher Z-index
                            onMouseEnter={() => setIsHeaderHovered(true)}
                            onMouseLeave={() => setIsHeaderHovered(false)}
                            onClick={handleGoBack}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <AnimatePresence initial={false} mode="wait">
                                {!isHeaderHovered && ( <motion.div key="pk-header" /* ...anim... */ > <FluidHeader text="PK" isTopLeft={true} /> </motion.div> )}
                                {isHeaderHovered && ( <motion.div key="back-arrow-header" /* ...anim... */ > <FluidHeader text="<" isTopLeft={true} glowMode="active" /> </motion.div> )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Welcome Screen Overlay */}
                <AnimatePresence>
                    {isWelcomeVisible && ( <motion.div key="welcome-overlay" className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#06647B] to-[#000000] backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} > <Welcome onDismiss={handleWelcomeDismiss} onCommandSubmit={handleCommand} suggestions={suggestions} /> </motion.div> )}
                </AnimatePresence>

                {/* Main Text Entry Bar */}
                 {!isWelcomeVisible && ( <div className="w-full p-4 z-20 flex-shrink-0 pt-16 sm:pt-20 md:pt-24"> <TextEntry onSubmit={handleCommand} placeholder="Type command or ask question..." suggestions={suggestions} currentCommand={displayedCommand} /> </div> )}

                {/* Dynamic Content Area - Scrollable */}
                 <div
                    className={`flex-1 overflow-y-auto p-4 pt-0 transition-padding duration-300 ease-in-out ${
                        // Add left padding ONLY when index nav is visible on medium+ screens
                        (activeSection === 'projectDetail' && selectedProject?.detailSections?.length > 0)
                        ? 'md:pl-24 lg:pl-32 xl:pl-40' // Adjust these values based on index nav width + desired gap
                        : 'pl-4' // Default padding
                    }`}
                    style={{ scrollBehavior: 'smooth' }}
                 >
                    {!isWelcomeVisible && renderMainContent()}
                </div>

            </main>

        </div>
    );
}