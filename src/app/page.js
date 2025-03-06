'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../app/components/Sidebar';
import TextEntry from '../app/components/TextEntry';

export default function Home() {
  // Sidebar open/close
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Switch between “home” or “projects”
  const [view, setView] = useState('home');

  // Handle typed input
  const handleTextSubmit = (text) => {
    const lowerText = text.toLowerCase();

    // If user types "about me", open sidebar
    if (lowerText.includes('about me')) {
      setSidebarOpen(true);
    }

    // If user types "projects", switch to Projects view
    if (lowerText.includes('projects')) {
      setView('projects');
    }
    // Extend logic for "work," etc.
  };

  // “Home” screen
  const HomeView = () => (
    <div className="text-center max-w-xl">
      <h1 className="text-white text-3xl sm:text-4xl font-semibold mb-6">
        Welcome! What would you like to know?
      </h1>

      {/* GPT-like text entry */}
      <div className="flex justify-center mb-6">
      <TextEntry
        onSubmit={handleTextSubmit}
        placeholder="Type your query here..."
        suggestions={['About Me', 'Projects', 'Work', 'Industries']}
      />

      </div>
      {/* No extra suggestion buttons below the search bar */}
    </div>
  );

  // “Projects” screen
  const ProjectsView = () => (
    <motion.div
      className="text-center max-w-xl text-white"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl mb-4 font-semibold">Projects</h2>
      <p className="mb-4">
        Preetham is a designer and developer. If you want to look into UX design,
        here are some of his best projects, structured by different industries:
        e-commerce, edtech, fintech. He also has research studies and critiques
        of various websites.
      </p>
      <p className="mb-4">
        If you&apos;d like to see his development work, he built this AI portfolio
        and many other projects. Enter or select which one you want to explore!
      </p>

      {/* GPT-like text entry for Projects */}
      <div className="flex justify-center mb-4">
        <TextEntry
          onSubmit={handleTextSubmit}
          placeholder="Choose design side or dev side..."
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full flex bg-gradient-to-b from-[#06647B] to-black">
      {/* Sidebar (fixed width if open) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 256 }} // w-64
            exit={{ width: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <HomeView />
            </motion.div>
          )}

          {view === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center"
            >
              <ProjectsView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
