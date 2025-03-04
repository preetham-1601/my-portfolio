// src/components/Sidebar.js
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 },
};

export default function Sidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="fixed top-0 left-0 w-80 h-full p-6 bg-white/10 backdrop-blur-md rounded-r-2xl shadow-lg z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={onClose}
            className="text-white text-sm mb-4 focus:outline-none"
          >
            Close
          </button>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
              <Image
                src="/profile.jpg"
                alt="Profile Picture"
                width={96}
                height={96}
              />
            </div>
            <p className="text-white text-center">
              Hi, I&apos;m [Your Name]. I&apos;m a developer passionate about
              creating interactive user experiences.
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
