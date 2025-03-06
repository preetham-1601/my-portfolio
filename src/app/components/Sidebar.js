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
          className="h-full w-64 bg-white/10 backdrop-blur-md shadow-lg p-4 flex flex-col"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={sidebarVariants}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={onClose}
            className="text-white text-sm mb-4 self-end focus:outline-none"
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
              Hi, I&apos;m Preetham. I&apos;m a developer and designer passionate about
              creating interactive user experiences.
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
