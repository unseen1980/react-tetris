import React from 'react';
import { TETROMINOS } from '../tetrominos';

interface CellProps {
  type: keyof typeof TETROMINOS;
}

const Cell: React.FC<CellProps> = ({ type }) => (
  <div
    className="w-6 h-6 border border-gray-900"
    style={{ backgroundColor: `rgba(${TETROMINOS[type].color}, 0.8)` }}
  />
);

export default React.memo(Cell);