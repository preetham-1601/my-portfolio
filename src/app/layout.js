// src/app/layout.js
import './styles/globals.css';

export const metadata = {
  title: 'My Portfolio',
  description: 'A modern portfolio website built with Next.js, Tailwind CSS, and Framer Motion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
