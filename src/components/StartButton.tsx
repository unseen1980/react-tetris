import React from 'react';

interface StartButtonProps {
  callback: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ callback }) => (
  <button
    className="px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition-colors"
    onClick={callback}
  >
    Start Game
  </button>
);

export default StartButton;