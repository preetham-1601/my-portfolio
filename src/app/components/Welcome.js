// src/app/components/Welcome.js
"use client";
import React, { useState, useEffect, useRef } from "react";
// Import 'animate' function and layout prop
import { motion, AnimatePresence, useAnimation, animate, layout } from "framer-motion";
import TextEntry from "./TextEntry";
import FluidHeader from "./FluidHeader"; // Use FluidHeader that accepts glowMode/glowProgress
import Torch from "./Torch"; // Use Torch component that accepts isActive

export default function Welcome({ onDismiss, onCommandSubmit }) {
  const [stage, setStage] = useState('initial');
  const [glowMode, setGlowMode] = useState('idle'); // 'idle', 'row', 'full'
  const [glowProgress, setGlowProgress] = useState(0); // 0 to 1 for row glow
  const [isAnimatingStart, setIsAnimatingStart] = useState(false); // Lock during start sequence
  const [isAnimatingTorchClick, setIsAnimatingTorchClick] = useState(false); // Lock during torch click sequence
  // Removed individual torch active states
  const leftTorchControls = useAnimation();
  const rightTorchControls = useAnimation();
  const fluidHeaderContainerRef = useRef(null);

  const suggestions = ["About Me", "My Work", "Skills", "Connect with me", "Wanna play a small game?"];

  // Handler for the 'Start' button click - triggers initial animation THEN stage change
  const handleStart = async () => {
    if (isAnimatingStart || stage !== 'initial') return;
    setIsAnimatingStart(true); // Lock button & set torch color active

    // Ensure torches are reset visually if they were toggled on before start
    if (glowMode === 'full') {
        setGlowMode('idle');
        await Promise.all([
            leftTorchControls.start({ rotate: 0 }, { duration: 0.2 }),
            rightTorchControls.start({ rotate: 0 }, { duration: 0.2 })
        ]);
    }

    const leftTargetRotation = -55;
    const rightTargetRotation = 55;
    const torchAnimDuration = 0.5;
    const rowGlowDuration = 1.0;
    const fullGlowDuration = 600;

    try {
        // 1. Animate torches pointing (isActive will be true via isAnimatingStart)
        await Promise.all([
          leftTorchControls.start({ rotate: leftTargetRotation, transition: { duration: torchAnimDuration, ease: "easeInOut" } }),
          rightTorchControls.start({ rotate: rightTargetRotation, transition: { duration: torchAnimDuration, ease: "easeInOut" } })
      ]);

        // 2. Start Row Glow Animation
        setGlowMode('row');
          await animate(0, 1, {
              duration: rowGlowDuration,
              ease: "linear",
              onUpdate: latest => setGlowProgress(latest)
          });
          setGlowProgress(1);

          // 3. Switch to Full Glow
          setGlowMode('full');
          await new Promise(resolve => setTimeout(resolve, fullGlowDuration));

          // 4. Set glow back to idle (torches stay pointed for now)
          setGlowMode('idle');
          setGlowProgress(0);

          // 5. Trigger stage change - This will cause layout animation
          setStage('prompt');

          // 6. Animate torches back *after* stage change starts
          await Promise.all([
               leftTorchControls.start({ rotate: 0, transition: { duration: torchAnimDuration, ease: "easeInOut" } }),
               rightTorchControls.start({ rotate: 0, transition: { duration: torchAnimDuration, ease: "easeInOut" } })
          ]);

    } catch (error) {
        console.error("Start animation sequence failed:", error);
        setGlowMode('idle'); setGlowProgress(0);
        leftTorchControls.start({ rotate: 0 });
        rightTorchControls.start({ rotate: 0 });
        setStage('prompt');
    } finally {
        setIsAnimatingStart(false); // Release start sequence lock
    }
  };

  // --- MODIFIED: Handler for clicking torches (works in BOTH stages) ---
  const handleTorchClick = async () => {
      // Prevent clicks during the Start button sequence OR if already animating torch click
      if ( isAnimatingTorchClick) return;

      setIsAnimatingTorchClick(true); // Lock torch clicks

      // Determine the NEW state based on current glowMode
      const newGlowMode = glowMode === 'full' ? 'idle' : 'full';
      const targetRotationLeft = newGlowMode === 'full' ? -55 : 0;
      const targetRotationRight = newGlowMode === 'full' ? 55 : 0;
      const torchAnimDuration = 0.4;

      try {
          // Set glow mode immediately for visual feedback in FluidHeader
          setGlowMode(newGlowMode);
          // Animate BOTH torches to the new target rotation
          await Promise.all([
               leftTorchControls.start({ rotate: targetRotationLeft, transition: { duration: torchAnimDuration, ease: "easeInOut" } }),
               rightTorchControls.start({ rotate: targetRotationRight, transition: { duration: torchAnimDuration, ease: "easeInOut" } })
          ]);
      } catch (error) {
          console.error("Torch click animation failed:", error);
          // Reset state on error if needed
          setGlowMode('idle');
          leftTorchControls.start({ rotate: 0 });
          rightTorchControls.start({ rotate: 0 });
      } finally {
          setIsAnimatingTorchClick(false); // Release click lock
      }
  };


  // Internal submit handler passed to TextEntry
  const handleInternalSubmit = (command) => {
    if (onCommandSubmit) { onCommandSubmit(command); }
    if (onDismiss) { onDismiss(); } // Dismiss overlay after submit
  };

  // Container class - adjust alignment/justification based on stage
  const getContainerClasses = (currentStage) => {
      let base = "flex flex-col items-center text-center w-full max-w-3xl min-h-[450px] ";
      if (currentStage === 'initial') { return base + "justify-center"; }
      else { return base + "justify-start pt-10 md:pt-16"; }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 pointer-events-auto">
      {/* Main animated container - uses layout prop */}
      <motion.div
          layout // Animate layout changes
          key={stage} // Use stage as key if we want full remount, or keep static key if only children animate
          className={getContainerClasses(stage)} // Dynamic classes
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
      >
          {/* AnimatePresence manages exit/enter of stage-specific elements */}
          <AnimatePresence mode="wait">
              {/* --- Welcome Text (Stage 1 ONLY, Exits) --- */}
              {stage === 'initial' && (
                  <motion.h1
                      key="welcome-text-h1"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                      className="text-4xl md:text-5xl font-bold text-white mb-4 order-1"
                      >
                      Welcome to the world of
                  </motion.h1>
              )}
          </AnimatePresence>

          {/* --- Fluid Header (Shared via layoutId) --- */}
          <motion.div
              layoutId="fluid-header-container" // Shared ID
              layout="position" // Animate position
              ref={fluidHeaderContainerRef}
              className={`w-full my-4 relative ${
                  stage === 'initial' ? 'max-w-10xl h-[120px] order-2' : 'max-w-full h-[80px] order-1'
              }`}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              >
              {/* Ensure FluidHeader uses config.text="PREETHAM KASTURI" internally */}
              <FluidHeader glowMode={glowMode} glowProgress={glowProgress} />

              {/* --- Torches - Always rendered, positioned relative to header --- */}
              {/* Removed AnimatePresence wrapper, they persist */}
              <Torch
                  key="torch-left" // Consistent key
                  animate={leftTorchControls} // Controls handle rotation
                  className="absolute top-0 left-0 z-10 transform -translate-x-1/3 -translate-y-1/3"
                  initial={{ rotate: 0 }} // Start straight
                  onClick={handleTorchClick} // Click handler works in both stages (but locked during start anim)
                  // Color based on glowMode (indicates if spotlight is on)
                  // In initial stage, isAnimatingStart might override this briefly if needed, but glowMode is simpler
                  isActive={glowMode === 'full'}
              />
              <Torch
                  key="torch-right" // Consistent key
                  animate={rightTorchControls} // Controls handle rotation
                  className="absolute top-0 right-0 z-10 transform translate-x-1/3 -translate-y-1/3"
                  initial={{ rotate: 0 }} // Start straight
                  onClick={handleTorchClick} // Click handler works in both stages
                  // Color based on glowMode
                  isActive={glowMode === 'full'}
              />
              {/* ----------------------------------------- */}
          </motion.div>

          {/* --- Start Button (Stage 1 ONLY, Exits) --- */}
           <AnimatePresence>
            {stage === 'initial' && (
                <motion.div
                    key="start-button-div"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                    className="mt-3 order-3"
                    >
                    <motion.button
                        className={`px-20 py-3 bg-cyan-600 text-white rounded-full font-semibold ${isAnimatingStart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cyan-700'} transition-colors duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black/50`}
                        whileHover={!isAnimatingStart ? { scale: 1.05 } : {}} whileTap={!isAnimatingStart ? { scale: 0.95 } : {}}
                        onClick={handleStart} disabled={isAnimatingStart} >
                        Start
                    </motion.button>
                </motion.div>
            )}
          </AnimatePresence>

          {/* --- Text Entry (Stage 2 ONLY, Enters) --- */}
          <AnimatePresence>
            {stage === 'prompt' && (
                <motion.div
                    key="text-entry-div"
                    className="w-full max-w-2xl mt-6 order-2" // Comes after header in prompt stage
                    initial={{ opacity: 0, y: 20 }} // Animate in
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }} // Delay slightly longer
                    >
                    {/* Removed the prompt <p> tag */}
                    <TextEntry
                        onSubmit={handleInternalSubmit}
                        placeholder="Type your command or question..."
                        suggestions={suggestions}
                    />
                </motion.div>
            )}
          </AnimatePresence>

      </motion.div>
    </div>
  );
}
