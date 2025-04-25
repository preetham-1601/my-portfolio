// src/app/components/FluidHeader.js
"use client";

// Import useMemo along with other hooks
import React, { useRef, useEffect, useState, useMemo } from 'react';

// Configuration for the particle effect
const config = {
    text: "PREETHAM KASTURI",
    fontSize: 70,
    fontFamily: "Arial, sans-serif",
    particleSize: 2,
    particleColor: "rgb(56, 189, 248)", // Bright color
    dimmedParticleColor: "rgba(56, 189, 248, 0.3)", // Dim color
    glowColor: "rgba(56, 189, 248, 0.8)", // Mouse hover glow
    glowBlur: 10,
    spotlightGlowColor: "rgba(135, 206, 250, 0.95)", // Lighter blue/white for spotlight/row glow
    spotlightGlowBlur: 18, // More intense blur for spotlight/row glow
    mouseRepelRadius: 90,
    repelStrength: 1.2,
    returnStrength: 0.05,
    damping: 0.9, // Lower damping without drift
    densityFactor: 5,
    // Row Glow Config
    rowGlowHeight: 15, // Height (in pixels) of the glowing row band
};

// Particle class
class Particle {
    constructor(originX, originY, canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.originX = originX;
        this.originY = originY; // Store original Y for row calculation
        this.x = this.originX + (Math.random() - 0.5) * 50;
        this.y = this.originY + (Math.random() - 0.5) * 50;
        this.vx = 0;
        this.vy = 0;
        this.size = config.particleSize;
        this.distMouseSq = Infinity;
        this.isNearMouse = false;
    }

    update(mouseX, mouseY) {
        // ... (update logic remains the same - no drift) ...
        const dxMouse = this.x - mouseX;
        const dyMouse = this.y - mouseY;
        this.distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
        const repelRadiusSq = config.mouseRepelRadius * config.mouseRepelRadius;
        this.isNearMouse = (this.distMouseSq < repelRadiusSq && this.distMouseSq > 0);
        let forceX = 0, forceY = 0;
        if (this.isNearMouse) {
            const distMouse = Math.sqrt(this.distMouseSq);
            const angleMouse = Math.atan2(dyMouse, dxMouse);
            const repelForce = (config.mouseRepelRadius - distMouse) / config.mouseRepelRadius;
            forceX += Math.cos(angleMouse) * repelForce * config.repelStrength;
            forceY += Math.sin(angleMouse) * repelForce * config.repelStrength;
        }
        const dxOrigin = this.originX - this.x;
        const dyOrigin = this.originY - this.y;
        forceX += dxOrigin * config.returnStrength;
        forceY += dyOrigin * config.returnStrength;
        this.vx += forceX; this.vy += forceY;
        this.vx *= config.damping; this.vy *= config.damping;
        if (Math.abs(this.vx) < 0.01) this.vx = 0; if (Math.abs(this.vy) < 0.01) this.vy = 0;
        this.x += this.vx; this.y += this.vy;
        if (this.x < this.size || this.x > this.canvasWidth - this.size) { this.vx *= -0.5; this.x = Math.max(this.size, Math.min(this.x, this.canvasWidth - this.size)); }
        if (this.y < this.size || this.y > this.canvasHeight - this.size) { this.vy *= -0.5; this.y = Math.max(this.size, Math.min(this.y, this.canvasHeight - this.size)); }
    }

    // Draw method accepts glowMode and glowProgress
    draw(context, glowMode, glowProgress, minY, maxY) {
        let applyGlow = false;
        let useSpotlightGlow = false; // Differentiate between mouse glow and spotlight/row glow

        if (glowMode === 'full') {
            applyGlow = true;
            useSpotlightGlow = true; // Use intense glow for full mode
        } else if (glowMode === 'row') {
            // Calculate the center Y position of the glowing band
            const targetY = minY + (maxY - minY) * glowProgress;
            // Check if particle's origin is within the band
            if (Math.abs(this.originY - targetY) < config.rowGlowHeight / 2) {
                applyGlow = true;
                useSpotlightGlow = true; // Use intense glow for row mode too
            }
        } else { // glowMode === 'idle' or default
            applyGlow = this.isNearMouse; // Glow only if near mouse
            useSpotlightGlow = false; // Use regular glow for mouse interaction
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

// React component - Accept glowMode and glowProgress props
export default function FluidHeader({
    glowMode = 'idle', // 'idle', 'row', 'full'
    glowProgress = 0, // 0 to 1, relevant for 'row' mode
}) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameIdRef = useRef(null);
    const mousePosRef = useRef({ x: -1000, y: -1000 });
    const containerRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    // Store min/max Y origin values for row glow calculation
    const yRangeRef = useRef({ minY: Infinity, maxY: -Infinity });

    // Use useMemo for stable initialHeight
    const initialHeight = useMemo(() => Math.max(100, config.fontSize * 1.5), []);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: initialHeight });

    // --- Initialization & Resize Effect ---
    useEffect(() => {
        const canvas = canvasRef.current; const container = containerRef.current; if (!canvas || !container) return;
        const context = canvas.getContext('2d', { willReadFrequently: true }); let currentContainerWidth = container.offsetWidth; let currentHeight = initialHeight;
        if (currentContainerWidth <= 0) { const checkTimer = setTimeout(() => { if (container.offsetWidth > 0) { setCanvasSize({ width: container.offsetWidth, height: initialHeight }); } }, 100); return () => clearTimeout(checkTimer); }
        if (currentContainerWidth !== canvasSize.width || currentHeight !== canvasSize.height) { setCanvasSize({ width: currentContainerWidth, height: currentHeight }); return; }

        if (canvasSize.width > 0 && canvasSize.height > 0) {
            canvas.width = canvasSize.width; canvas.height = canvasSize.height;
            particlesRef.current = [];
            // Reset Y range calculation
            yRangeRef.current = { minY: Infinity, maxY: -Infinity };

            context.fillStyle = 'white'; context.font = `bold ${config.fontSize}px ${config.fontFamily}`; context.textAlign = 'center'; context.textBaseline = 'middle'; const textY = canvasSize.height / 2 + config.fontSize * 0.1; context.fillText(config.text, canvasSize.width / 2, textY);
            try {
                const textImageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height); context.clearRect(0, 0, canvasSize.width, canvasSize.height);
                for (let y = 0; y < textImageData.height; y += config.densityFactor) { for (let x = 0; x < textImageData.width; x += config.densityFactor) { const alphaIndex = (y * textImageData.width + x) * 4 + 3; if (textImageData.data[alphaIndex] > 128) {
                            particlesRef.current.push(new Particle(x, y, canvasSize.width, canvasSize.height));
                            // Track min/max Y origin
                            if (y < yRangeRef.current.minY) yRangeRef.current.minY = y;
                            if (y > yRangeRef.current.maxY) yRangeRef.current.maxY = y;
                        } } }
                setIsInitialized(true);
            } catch (error) { console.error("Error getting image data:", error); setIsInitialized(false); }
        }
        const handleResize = () => { if (!container) return; const newWidth = container.offsetWidth; if (newWidth > 0 && newWidth !== canvasSize.width) { if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); animationFrameIdRef.current = null; } setIsInitialized(false); setCanvasSize({ width: newWidth, height: initialHeight }); } };
        let resizeTimeout; const debouncedHandler = () => { clearTimeout(resizeTimeout); resizeTimeout = setTimeout(handleResize, 200); }; window.addEventListener('resize', debouncedHandler);
        return () => { clearTimeout(resizeTimeout); window.removeEventListener('resize', debouncedHandler); if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); } };
    }, [canvasSize.width, canvasSize.height, initialHeight]);


    // --- Mouse Move Effect --- (Using canvas listener)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // Exit if canvas is not ready
        const handleMouseMove = (event) => { const rect = canvas.getBoundingClientRect(); mousePosRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
        const handleMouseLeave = () => { mousePosRef.current = { x: -1500, y: -1500 }; };
        canvas.addEventListener('mousemove', handleMouseMove); // Listen on canvas
        canvas.addEventListener('mouseleave', handleMouseLeave); // Listen on canvas
        return () => { canvas.removeEventListener('mousemove', handleMouseMove); canvas.removeEventListener('mouseleave', handleMouseLeave); };
    }, []); // Runs once on mount


    // --- Animation Loop Effect ---
    useEffect(() => {
        if (!isInitialized || !canvasRef.current || canvasSize.width <= 0 || canvasSize.height <= 0) { return; }
        const canvas = canvasRef.current; const context = canvas.getContext('2d'); let isActive = true;
        const animate = (timestamp) => {
            if (!isActive || !context || !canvas) return;
            context.clearRect(0, 0, canvas.width, canvas.height);
            const currentMouseX = mousePosRef.current.x; const currentMouseY = mousePosRef.current.y;
            if (particlesRef.current?.length > 0) {
                particlesRef.current.forEach(particle => {
                    particle.update(currentMouseX, currentMouseY);
                    // Pass necessary props to draw method
                    particle.draw(context, glowMode, glowProgress, yRangeRef.current.minY, yRangeRef.current.maxY);
                });
            }
            animationFrameIdRef.current = requestAnimationFrame(animate);
        };
        animate(0); // Start loop
        return () => { isActive = false; if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); } };
    // Depend on glowMode and glowProgress now
    }, [isInitialized, canvasSize.width, canvasSize.height, glowMode, glowProgress]);


    return (
        <div ref={containerRef} style={{ width: '100%', height: `${initialHeight}px` }}>
            <canvas
                ref={canvasRef}
                style={{ display: 'block', width: '100%', height: `${initialHeight}px` }}
                className="fluid-header-canvas"
            />
        </div>
    );
}
