// src/app/components/Sidebar.js
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image'; // Using Next.js Image component
import { FaTimes } from 'react-icons/fa'; // Icon for close button

// Animation variants for the sidebar slide-in/out effect
const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 }, // Start off-screen to the left
  visible: { x: 0, opacity: 1 }, // Slide in to position
  exit: { x: '-100%', opacity: 0 }, // Slide out to the left
};

// Sidebar component receives isOpen state and onClose callback from parent (page.js)
export default function Sidebar({ isOpen, onClose }) {
  return (
    // AnimatePresence handles the mounting/unmounting animation
    <AnimatePresence>
      {isOpen && ( // Only render the sidebar if isOpen is true
        <motion.aside
          // Styling: Fixed width, full height, glassy background matching theme, padding, flex layout
          className="h-full w-64 bg-[#0A4F60]/30 backdrop-blur-lg shadow-lg p-4 flex flex-col border-r border-white/10"
          initial="hidden" // Initial animation state
          animate="visible" // Animation state when mounted
          exit="exit" // Animation state when unmounting
          variants={sidebarVariants} // Apply defined variants
          transition={{ duration: 0.3, ease: "easeInOut" }} // Animation timing and easing
        >
          {/* Close Button */}
          <button
            onClick={onClose} // Call the onClose callback provided by parent
            aria-label="Close sidebar"
            // Styling: Positioned top-right, subtle hover effect
            className="text-gray-300 hover:text-white text-xl mb-4 self-end focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full p-1 transition-colors"
          >
            <FaTimes />
          </button>

          {/* Profile Section */}
          <div className="flex flex-col items-center mt-4"> {/* Added margin top */}
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-cyan-500/50 shadow-md">
              {/* Use Next/Image for optimized image loading */}
              {/* IMPORTANT: Ensure '/profile.jpg' exists in your 'public' directory */}
              <Image
                src="/profile.jpg" // Path relative to the 'public' folder
                alt="Profile Picture of Preetham"
                width={96}
                height={96}
                className="object-cover" // Ensure image covers the area
                priority // Load image eagerly as it's likely important
                // Optional: Add placeholder/blurDataURL for better loading experience
                // placeholder="blur"
                // blurDataURL="data:image/png;base64,..." // Generate a base64 placeholder
              />
            </div>
            {/* Profile Name/Title (Optional) */}
            <h2 className="text-xl font-semibold text-white mb-2">Preetham</h2>
            {/* Profile Description */}
            <p className="text-gray-200 text-center text-sm leading-relaxed">
              Hi, I&apos;m Preetham. A passionate developer and designer focused on creating engaging and interactive user experiences. Explore my work!
            </p>
          </div>

          {/* Navigation Section (Currently not implemented here, handled in page.js) */}
          {/* If you wanted navigation links *inside* the sidebar, they would go here */}
          {/* <nav className="mt-8 flex-1">
            <ul>
              <li><button className="text-gray-300 hover:text-white">About</button></li>
              <li><button className="text-gray-300 hover:text-white">Projects</button></li>
              {/* ... other links ... *}
            </ul>
          </nav> */}

        </motion.aside>
      )}
    </AnimatePresence>
  );
}
