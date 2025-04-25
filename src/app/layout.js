// src/app/layout.js
import "./styles/globals.css"; // Ensure correct path to your globals.css
import { Inter } from "next/font/google"; // Example font integration

// Configure the Inter font
const inter = Inter({ subsets: ["latin"] });

// Metadata for the application (SEO, tab title)
export const metadata = {
  title: "Preetham's Interactive Portfolio", // Updated title
  description: "Explore Preetham's work through an interactive chat-like interface.", // Updated description
};

// Root layout component wrapping all pages
export default function RootLayout({ children }) {
  return (
    <html lang="en">
       {/* Apply font class to the body */}
       {/* Base text color is handled by globals.css via CSS variables now */}
      <body className={`${inter.className}`}>
        {/* children represents the content of the current page */}
        {children}
      </body>
    </html>
  );
}
