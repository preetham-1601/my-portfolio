// src/app/components/Welcome.js
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation, animate } from "framer-motion"; // Removed 'layout' import
import TextEntry from "./TextEntry";
import FluidHeader from "./FluidHeader"; // Use FluidHeader that accepts glowMode/glowProgress
import Torch from "./Torch"; // Use Torch component that accepts isActive

export default function Welcome({ onDismiss, onCommandSubmit }) {
    // Removed 'stage' and 'isAnimatingStart' state
    const [glowMode, setGlowMode] = useState('idle'); // 'idle', 'row', 'full' - Keep for torch interaction
    const [glowProgress, setGlowProgress] = useState(0); // Keep for potential future effects if needed
    const [isAnimatingTorchClick, setIsAnimatingTorchClick] = useState(false); // Lock during torch click sequence
    const leftTorchControls = useAnimation();
    const rightTorchControls = useAnimation();
    const fluidHeaderContainerRef = useRef(null);

    // Suggestions remain the same
    const suggestions = ["About Me", "My Work", "Skills", "Connect with me", "Wanna play a small game?"];

    // Removed handleStart function entirely

    // --- Handler for clicking torches (remains largely the same) ---
    const handleTorchClick = async () => {
        if (isAnimatingTorchClick) return; // Prevent clicks if already animating
        setIsAnimatingTorchClick(true);

        const newGlowMode = glowMode === 'full' ? 'idle' : 'full';
        const targetRotationLeft = newGlowMode === 'full' ? -55 : 0;
        const targetRotationRight = newGlowMode === 'full' ? 55 : 0;
        const torchAnimDuration = 0.4;

        try {
            setGlowMode(newGlowMode); // Set glow mode immediately
            await Promise.all([
                leftTorchControls.start({ rotate: targetRotationLeft, transition: { duration: torchAnimDuration, ease: "easeInOut" } }),
                rightTorchControls.start({ rotate: targetRotationRight, transition: { duration: torchAnimDuration, ease: "easeInOut" } })
            ]);
        } catch (error) {
            console.error("Torch click animation failed:", error);
            setGlowMode('idle'); // Reset on error
            leftTorchControls.start({ rotate: 0 });
            rightTorchControls.start({ rotate: 0 });
        } finally {
            setIsAnimatingTorchClick(false); // Release click lock
        }
    };

    // Internal submit handler passed to TextEntry (remains the same)
    const handleInternalSubmit = (command) => {
        const lowerCmd = command.toLowerCase();
        if (onCommandSubmit) {
            onCommandSubmit(lowerCmd);
        }
        if (onDismiss) {
            onDismiss();
        }
    };

    // --- JSX Structure (Single Stage) ---
    return (
        // Main container: vertically centered, takes full height/width of its parent (the overlay)
        <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-auto">
            {/* Content wrapper: controls max width and holds the elements */}
            <motion.div
                // No layout prop needed here
                className="flex flex-col items-center text-center w-full max-w-3xl" // Adjusted max-width if needed
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
            >
                {/* 1. Welcome Text */}
                <motion.h1
                    // No key needed if always present
                    // No exit animation needed
                    className="text-4xl md:text-5xl font-bold text-white mb-4" // Spacing adjusted
                >
                    Welcome to the world of
                </motion.h1>

                {/* 2. Fluid Header & Torches Container */}
                <motion.div
                    // Removed layoutId and layout props
                    ref={fluidHeaderContainerRef}
                    className="w-full max-w-10xl h-[100px] md:h-[120px] my-4 relative" // Consistent size, adjusted max-width/height
                >
                    <FluidHeader glowMode={glowMode} glowProgress={glowProgress} />

                    {/* Torches - Always rendered, positioned relative to header */}
                    <Torch
                        key="torch-left"
                        animate={leftTorchControls}
                        className="absolute top-0 left-0 z-10 transform -translate-x-1/3 -translate-y-1/3 cursor-pointer" // Added cursor-pointer
                        initial={{ rotate: 0 }}
                        onClick={handleTorchClick} // Click handler
                        isActive={glowMode === 'full'} // Color based on glowMode
                    />
                    <Torch
                        key="torch-right"
                        animate={rightTorchControls}
                        className="absolute top-0 right-0 z-10 transform translate-x-1/3 -translate-y-1/3 cursor-pointer" // Added cursor-pointer
                        initial={{ rotate: 0 }}
                        onClick={handleTorchClick} // Click handler
                        isActive={glowMode === 'full'} // Color based on glowMode
                    />
                </motion.div>

                {/* 3. Text Entry Box */}
                <motion.div
                    // No key needed
                    className="w-full max-w-2xl mt-6" // Added margin-top for spacing
                    // Optional simple fade-in:
                    // initial={{ opacity: 0 }}
                    // animate={{ opacity: 1 }}
                    // transition={{ duration: 0.5, delay: 0.3 }} // Slight delay after header
                >
                    <TextEntry
                        onSubmit={handleInternalSubmit}
                        placeholder="Type your command or question..."
                        suggestions={suggestions} // Pass suggestions here
                    />
                </motion.div>

                {/* 4. Suggestions - Handled internally by TextEntry */}
                {/* No separate suggestion rendering needed here if TextEntry handles it */}

            </motion.div>
        </div>
    );
}