// src/app/components/FluidHeader.js
"use client";

import React, { useRef, useEffect, useState, useMemo } from 'react';

// Default Configuration
const defaultConfig = {
    // text: "PREETHAM KASTURI", // Text is now a prop
    fontSize: 70, // Default font size for centered name
    smallFontSize: 50, // Font size for top-left corner
    fontFamily: "Arial, sans-serif",
    particleSize: 2,
    particleColor: "rgb(56, 189, 248)", // Bright color
    dimmedParticleColor: "rgba(56, 189, 248, 0.3)", // Dim color
    glowColor: "rgba(56, 189, 248, 0.8)", // Mouse hover glow
    glowBlur: 10,                        // Mouse hover glow blur
    spotlightGlowColor: "rgba(135, 206, 250, 0.95)", // Full/Row glow
    spotlightGlowBlur: 18,                        // Full/Row glow blur
    mouseRepelRadius: 90, // Default radius
    smallMouseRepelRadius: 40, // Smaller radius for corner
    repelStrength: 1.2,
    smallRepelStrength: 0.8, // Less repulsion in corner
    returnStrength: 0.05,
    damping: 0.9,
    densityFactor: 5,
    rowGlowHeight: 15, // Keep for glow logic
};

// Particle class
class Particle {
    constructor(originX, originY, canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.originX = originX;
        this.originY = originY;
        this.x = this.originX + (Math.random() - 0.5) * 50;
        this.y = this.originY + (Math.random() - 0.5) * 50;
        this.vx = 0;
        this.vy = 0;
        this.size = defaultConfig.particleSize; // Randomized size
        this.distMouseSq = Infinity;
        this.isNearMouse = false;
    }

    update(mouseX, mouseY, config) { // Pass config object
        // Calculate distance to mouse and update proximity flag
        const dxMouse = this.x - mouseX;
        const dyMouse = this.y - mouseY;
        this.distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        // Use appropriate repel radius from config
        const repelRadiusSq = config.mouseRepelRadius * config.mouseRepelRadius;
        this.isNearMouse = (this.distMouseSq < repelRadiusSq && this.distMouseSq > 0);

        let forceX = 0, forceY = 0;

        // Apply repulsion force if near mouse
        if (this.isNearMouse) {
            const distMouse = Math.sqrt(this.distMouseSq);
            const angleMouse = Math.atan2(dyMouse, dxMouse);
            // Use appropriate repel strength from config
            const repelForce = (config.mouseRepelRadius - distMouse) / config.mouseRepelRadius;
            forceX += Math.cos(angleMouse) * repelForce * config.repelStrength;
            forceY += Math.sin(angleMouse) * repelForce * config.repelStrength;
        }

        // Apply attraction force towards origin
        const dxOrigin = this.originX - this.x;
        const dyOrigin = this.originY - this.y;
        forceX += dxOrigin * config.returnStrength;
        forceY += dyOrigin * config.returnStrength;

        // Apply forces and damping
        this.vx += forceX;
        this.vy += forceY;
        this.vx *= config.damping;
        this.vy *= config.damping;

        // Stop tiny movements when idle and near origin
        if (!this.isNearMouse && Math.abs(dxOrigin) < 0.5 && Math.abs(dyOrigin) < 0.5) {
             if (Math.abs(this.vx) < 0.01) this.vx = 0;
             if (Math.abs(this.vy) < 0.01) this.vy = 0;
        }

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision
        if (this.x < this.size || this.x > this.canvasWidth - this.size) { this.vx *= -0.5; this.x = Math.max(this.size, Math.min(this.x, this.canvasWidth - this.size)); }
        if (this.y < this.size || this.y > this.canvasHeight - this.size) { this.vy *= -0.5; this.y = Math.max(this.size, Math.min(this.y, this.canvasHeight - this.size)); }
    }

    // Draw method accepts glowMode and glowProgress
    draw(context, glowMode, glowProgress, minY, maxY, config) { // Pass config
        let applyGlow = false;
        let useSpotlightGlow = false; // Differentiate between mouse glow and spotlight/row glow

        if (glowMode === 'full') {
            applyGlow = true;
            useSpotlightGlow = true; // Use intense glow for full mode
        } else if (glowMode === 'row') {
            const targetY = minY + (maxY - minY) * glowProgress;
            if (Math.abs(this.originY - targetY) < config.rowGlowHeight / 2) {
                applyGlow = true;
                useSpotlightGlow = true; // Use intense glow for row mode too
            }
        } else { // glowMode === 'idle' or default
            // --- CORRECTED: Check isNearMouse for idle glow ---
            applyGlow = this.isNearMouse; // Glow only if near mouse
            useSpotlightGlow = false; // Use regular glow for mouse interaction
            // -------------------------------------------------
        }

        // Set drawing styles based on glow state
        if (applyGlow) {
            context.fillStyle = config.particleColor; // Bright color
            context.shadowColor = useSpotlightGlow ? config.spotlightGlowColor : config.glowColor;
            context.shadowBlur = useSpotlightGlow ? config.spotlightGlowBlur : config.glowBlur;
        } else {
            context.fillStyle = config.dimmedParticleColor; // Dimmed color
            context.shadowBlur = 0; // No glow
        }

        // Draw the particle (rounded coords)
        context.beginPath();
        const drawX = Math.round(this.x);
        const drawY = Math.round(this.y);
        context.arc(drawX, drawY, this.size, 0, Math.PI * 2);
        context.fill();

        // Reset shadowBlur after each draw
        context.shadowBlur = 0;
    }
}

// --- Accept text and isTopLeft props ---
export default function FluidHeader({
    text = "PREETHAM KASTURI", // Default text
    glowMode = 'idle',
    glowProgress = 0,
    isTopLeft = false // Flag to indicate corner position
}) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameIdRef = useRef(null);
    const mousePosRef = useRef({ x: -1000, y: -1000 });
    const containerRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const yRangeRef = useRef({ minY: Infinity, maxY: -Infinity });

    // --- Determine config based on props ---
    const currentConfig = useMemo(() => ({
        ...defaultConfig,
        text: text,
        fontSize: isTopLeft ? defaultConfig.smallFontSize : defaultConfig.fontSize,
        mouseRepelRadius: isTopLeft ? defaultConfig.smallMouseRepelRadius : defaultConfig.mouseRepelRadius,
        repelStrength: isTopLeft ? defaultConfig.smallRepelStrength : defaultConfig.repelStrength,
    }), [text, isTopLeft]);

    // Calculate height based on current font size
    const height = useMemo(() => Math.max(isTopLeft ? 50 : 100, currentConfig.fontSize * 1.5), [currentConfig.fontSize, isTopLeft]);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: height });

    // --- Initialization & Resize Effect ---
    useEffect(() => {
        // console.log(`Init Effect: text="${currentConfig.text}", isTopLeft=${isTopLeft}, size=${canvasSize.width}x${canvasSize.height}`);
        const canvas = canvasRef.current; const container = containerRef.current; if (!canvas || !container) return;
        const context = canvas.getContext('2d', { willReadFrequently: true }); let currentContainerWidth = container.offsetWidth; let currentHeight = height;

        if (currentContainerWidth <= 0) { const checkTimer = setTimeout(() => { if (container.offsetWidth > 0) { setCanvasSize({ width: container.offsetWidth, height: currentHeight }); } }, 100); return () => clearTimeout(checkTimer); }
        // Update size state only if needed, triggers re-run
        if (currentContainerWidth !== canvasSize.width || currentHeight !== canvasSize.height) { setCanvasSize({ width: currentContainerWidth, height: currentHeight }); setIsInitialized(false); return; }

        // Initialize particles only if size is correct
        if (canvasSize.width > 0 && canvasSize.height > 0 /* && !isInitialized - Let deps handle re-init */) {
            canvas.width = canvasSize.width; canvas.height = canvasSize.height;
            particlesRef.current = []; yRangeRef.current = { minY: Infinity, maxY: -Infinity };

            // Use currentConfig values
            context.fillStyle = 'white'; context.font = `bold ${currentConfig.fontSize}px ${currentConfig.fontFamily}`;
            context.textAlign = isTopLeft ? 'left' : 'center';
            context.textBaseline = 'middle';
            const textX = isTopLeft ? 10 : canvasSize.width / 2;
            const textY = canvasSize.height / 2 + currentConfig.fontSize * 0.1;
            context.fillText(currentConfig.text, textX, textY); // Use text from config

            try {
                const textImageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height); context.clearRect(0, 0, canvasSize.width, canvasSize.height);
                for (let y = 0; y < textImageData.height; y += currentConfig.densityFactor) { for (let x = 0; x < textImageData.width; x += currentConfig.densityFactor) { const alphaIndex = (y * textImageData.width + x) * 4 + 3; if (textImageData.data[alphaIndex] > 128) { particlesRef.current.push(new Particle(x, y, canvasSize.width, canvasSize.height)); if (y < yRangeRef.current.minY) yRangeRef.current.minY = y; if (y > yRangeRef.current.maxY) yRangeRef.current.maxY = y; } } }
                console.log(`Initialized ${particlesRef.current.length} particles for "${currentConfig.text}".`);
                setIsInitialized(true); // Mark as ready
            } catch (error) { console.error("Error getting image data:", error); setIsInitialized(false); }
        }

        const handleResize = () => { if (!container) return; const newWidth = container.offsetWidth; if (newWidth > 0 && newWidth !== canvasSize.width) { if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); animationFrameIdRef.current = null; } setIsInitialized(false); setCanvasSize({ width: newWidth, height: height }); } };
        let resizeTimeout; const debouncedHandler = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(handleResize, 200); }; window.addEventListener('resize', debouncedHandler);
        return () => { clearTimeout(resizeTimeout); window.removeEventListener('resize', debouncedHandler); if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); } };
    // Depend on values used inside the effect that define the state
    }, [canvasSize.width, canvasSize.height, height, currentConfig.text, currentConfig.fontSize, isTopLeft]); // Removed isInitialized


    // --- Mouse Move Effect --- (Using canvas listener)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const handleMouseMove = (event) => { const rect = canvas.getBoundingClientRect(); mousePosRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
        const handleMouseLeave = () => { mousePosRef.current = { x: -1000, y: -1000 }; };
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        return () => { canvas.removeEventListener('mousemove', handleMouseMove); canvas.removeEventListener('mouseleave', handleMouseLeave); };
    }, []); // Runs once


    // --- Animation Loop Effect ---
    useEffect(() => {
        if (!isInitialized || !canvasRef.current || canvasSize.width <= 0 || canvasSize.height <= 0) { return; }
        const canvas = canvasRef.current; const context = canvas.getContext('2d'); let isActive = true;
        const animate = () => {
            if (!isActive || !context || !canvas) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
            const currentMouseX = mousePosRef.current.x; const currentMouseY = mousePosRef.current.y;
            if (particlesRef.current?.length > 0) {
                particlesRef.current.forEach(particle => {
                    // Pass currentConfig to update method
                    particle.update(currentMouseX, currentMouseY, currentConfig);
                    // Pass necessary props to draw method
                    particle.draw(context, glowMode, glowProgress, yRangeRef.current.minY, yRangeRef.current.maxY, currentConfig);
                });
            }
            animationFrameIdRef.current = requestAnimationFrame(animate);
        };
        animate(); // Start loop
        return () => { isActive = false; if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); } };
    // Depend on relevant state/props that affect animation
    }, [isInitialized, canvasSize.width, canvasSize.height, glowMode, glowProgress, currentConfig]);


    return (
        // Use calculated height for container
        <div ref={containerRef} style={{ width: '100%', height: `${height}px` }}>
            <canvas
                ref={canvasRef}
                // Use calculated height for canvas style
                style={{ display: 'block', width: '100%', height: `${height}px` }}
                className="fluid-header-canvas"
            />
        </div>
    );
}
