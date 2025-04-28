// src/app/components/ConnectSection.js
"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Component for the Connect/Contact form
// Accepts an onSubmit prop from the parent (page.js) to handle submission logic
export default function ConnectSection({ onSubmit }) {
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(''); // Feedback state: '', 'Sending...', 'Sent!', 'Error!'

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        if (!message.trim()) return; // Prevent sending empty messages

        setStatus('Sending...'); // Set status to indicate sending
        console.log("Attempting to send message:", message);

        // --- !!! IMPORTANT: Replace simulation with actual email sending logic !!! ---
        // This usually involves calling an API route you create in your Next.js app
        // which then uses a service like Resend, SendGrid, or Nodemailer (on a serverless function)
        // to actually send the email.
        try {
            // Example using fetch to call a hypothetical API route:
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ message }),
            // });
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }
            // const result = await response.json();
            // console.log("API Response:", result);

            // --- Simulation ---
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            console.log("Message supposedly sent (simulation).");
            // --- End Simulation ---

            setStatus('Message sent successfully!');
            setMessage(''); // Clear the input field
            if (onSubmit) {
                onSubmit(message); // Notify parent component (page.js)
            }
            // Optionally clear the status message after a few seconds
            setTimeout(() => setStatus(''), 4000);

        } catch (error) {
            console.error("Connect form submission error:", error);
            setStatus('Failed to send message. Please try again.');
            // Keep the message in the input field so the user doesn't lose it
        }
        // --- End Email Sending Logic ---
    };

    return (
        <motion.div
            key="connect" // Key for AnimatePresence
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6 bg-black/20 backdrop-blur-sm rounded-lg shadow-xl m-4 border border-white/10"
        >
            <h2 className="text-3xl font-bold mb-4 text-white">Connect with Preetham</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-lg font-medium text-gray-200 mb-2">Send a message:</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 rounded-md bg-gray-800/50 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-400 transition-colors duration-200"
                        placeholder="Let me know what you think or how we can collaborate..."
                        required
                        disabled={status === 'Sending...'} // Disable textarea while sending
                    ></textarea>
                </div>
                {/* Container for button and status message */}
                <div className="flex items-center justify-between h-10">
                     <button
                        type="submit"
                        disabled={!message.trim() || status === 'Sending...'} // Disable button if no message or sending
                        className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md font-semibold text-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'Sending...' ? 'Sending...' : 'Send Message'}
                    </button>
                    {/* Display status message with animation and appropriate color */}
                    {status && status !== 'Sending...' && (
                         <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`text-sm ${status.includes('successfully') ? 'text-green-400' : 'text-red-400'}`}
                         >
                            {status}
                         </motion.p>
                    )}
                </div>
            </form>
        </motion.div>
    );
}
