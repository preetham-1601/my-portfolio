// src/app/components/TicTacToeGame.js
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Helper function to calculate winner
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6], // Diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; // Return 'X' or 'O'
    }
  }
  // Check for draw (all squares filled, no winner)
  if (squares.every(square => square !== null)) {
      return 'Draw';
  }
  return null; // No winner yet
}

// Square component
function Square({ value, onSquareClick, isWinningSquare }) {
    const squareBaseStyle = "flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 border border-cyan-700/50 text-4xl sm:text-5xl font-bold cursor-pointer transition-colors duration-200";
    const squareHoverStyle = "hover:bg-cyan-900/30";
    const winningStyle = isWinningSquare ? "bg-cyan-500/40 text-white" : "text-cyan-300";

    return (
        <button
            className={`${squareBaseStyle} ${winningStyle} ${squareHoverStyle}`}
            onClick={onSquareClick}
            aria-label={`Square ${value ? `containing ${value}` : 'empty'}`}
        >
            {value}
        </button>
    );
}

// Board component
export default function TicTacToeGame() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("Next player: X");
  const [winner, setWinner] = useState(null);

  // Update status when squares change
  useEffect(() => {
    const currentWinner = calculateWinner(squares);
    setWinner(currentWinner); // Store winner state

    if (currentWinner && currentWinner !== 'Draw') {
      setStatus(`Winner: ${currentWinner}`);
    } else if (currentWinner === 'Draw') {
        setStatus("It's a Draw!");
    }
     else {
      setStatus(`Next player: ${xIsNext ? 'X' : 'O'}`);
    }
  }, [squares, xIsNext]);

  // Handle click on a square
  function handleClick(i) {
    // Ignore click if square is filled or game is over
    if (squares[i] || winner) {
      return;
    }
    const nextSquares = squares.slice(); // Create copy
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext); // Toggle turn
  }

  // Reset the game
  function handleReset() {
      setSquares(Array(9).fill(null));
      setXIsNext(true);
      setStatus("Next player: X");
      setWinner(null);
  }

  // Render a square
  function renderSquare(i) {
    // Check if this square is part of the winning line (if any)
    // This logic needs refinement if you want to highlight the winning line
    const isWinning = false; // Placeholder - add logic later if needed

    return (
      <Square
        key={i} // Add key for list rendering
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinningSquare={isWinning}
      />
    );
  }

  return (
    <motion.div
        className="flex flex-col items-center p-6 bg-black/30 backdrop-blur-sm rounded-lg shadow-xl border border-white/10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="text-xl mb-4 text-cyan-200 font-semibold">{status}</div>
      <div className="grid grid-cols-3 gap-1 bg-cyan-800/30 p-1 rounded">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => renderSquare(i))}
      </div>
      {(winner) && ( // Show reset button only when game is over
        <button
            onClick={handleReset}
            className="mt-6 px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md font-semibold transition-colors duration-200"
        >
            Play Again?
        </button>
      )}
    </motion.div>
  );
}

