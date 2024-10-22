import React from 'react';

interface DisplayProps {
  gameOver?: boolean;
  text: string;
}

const Display: React.FC<DisplayProps> = ({ gameOver, text }) => (
  <div className={`p-4 rounded-md mb-4 text-center ${gameOver ? 'bg-red-600' : 'bg-gray-700'}`}>
    <p className="text-white font-bold">{text}</p>
  </div>
);

export default Display;