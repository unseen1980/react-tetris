import React from 'react';
import Cell from './Cell';

interface StageProps {
  stage: (string | number)[][];
}

const Stage: React.FC<StageProps> = ({ stage }) => (
  <div className="grid gap-px bg-gray-700 p-1 rounded" style={{
    gridTemplateColumns: `repeat(${stage[0].length}, auto)`
  }}>
    {stage.map((row, y) => 
      row.map((cell, x) => <Cell key={`${y}-${x}`} type={cell[0]} />)
    )}
  </div>
);

export default Stage;