import React, { useReducer, useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/useInterval';
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
import { createStage, checkCollision } from '../gameHelpers';
import { usePlayer } from '../hooks/usePlayer';
import { useStage } from '../hooks/useStage';

// Define the state type
type GameState = {
  dropTime: number | null;
  gameOver: boolean;
  score: number;
  rows: number;
  level: number;
};

// Define the action type
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SET_DROP_TIME'; payload: number | null }
  | { type: 'SET_GAME_OVER'; payload: boolean }
  | { type: 'SET_SCORE'; payload: number }
  | { type: 'SET_ROWS'; payload: number }
  | { type: 'SET_LEVEL'; payload: number };

// Define the initial state
const initialState: GameState = {
  dropTime: null,
  gameOver: false,
  score: 0,
  rows: 0,
  level: 0,
};

// Define the reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...initialState,
        dropTime: 1000,
      };
    case 'SET_DROP_TIME':
      return {
        ...state,
        dropTime: action.payload,
      };
    case 'SET_GAME_OVER':
      return {
        ...state,
        gameOver: action.payload,
      };
    case 'SET_SCORE':
      return {
        ...state,
        score: action.payload,
      };
    case 'SET_ROWS':
      return {
        ...state,
        rows: action.payload,
      };
    case 'SET_LEVEL':
      return {
        ...state,
        level: action.payload,
      };
    default:
      return state;
  }
};

const Tetris: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { dropTime, gameOver, score, rows, level } = state;

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);

  const movePlayer = (dir: number) => {
    if (!checkCollision(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    console.log('Starting game...');
    setStage(createStage());
    resetPlayer();
    dispatch({ type: 'START_GAME' });
  };

  const drop = () => {
    if (rows > (level + 1) * 10) {
      dispatch({ type: 'SET_LEVEL', payload: level + 1 });
      dispatch({ type: 'SET_DROP_TIME', payload: 1000 / (level + 1) + 200 });
    }

    if (!checkCollision(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        console.log("GAME OVER!!!");
        dispatch({ type: 'SET_GAME_OVER', payload: true });
        dispatch({ type: 'SET_DROP_TIME', payload: null });
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }): void => {
    if (!gameOver) {
      if (keyCode === 40) {
        dispatch({ type: 'SET_DROP_TIME', payload: 1000 / (level + 1) + 200 });
      }
    }
  };

  const dropPlayer = () => {
    dispatch({ type: 'SET_DROP_TIME', payload: null });
    drop();
  };

  const move = useCallback((event: KeyboardEvent) => {
    if (!gameOver) {
      if (event.keyCode === 37) {
        event.preventDefault();
        movePlayer(-1);
      } else if (event.keyCode === 39) {
        event.preventDefault();
        movePlayer(1);
      } else if (event.keyCode === 40) {
        event.preventDefault();
        dropPlayer();
      } else if (event.keyCode === 38) {
        event.preventDefault();
        playerRotate(stage, 1);
      }
    }
  }, [gameOver, movePlayer, dropPlayer, playerRotate, stage]);

  useInterval(() => {
    drop();
  }, dropTime);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      move(event);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keyUp(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [move, keyUp]);

  useEffect(() => {
    if (rowsCleared > 0) {
      dispatch({ type: 'SET_SCORE', payload: score + rowsCleared * 10 * (level + 1) });
      dispatch({ type: 'SET_ROWS', payload: rows + rowsCleared });
    }
  }, [rowsCleared, score, level, rows]);

  return (
    <div className="flex flex-col items-center bg-gray-800 p-8 rounded-lg shadow-lg">
      <Stage stage={stage} />
      <div className="flex mt-4">
        <div className="mr-8">
          {gameOver ? (
            <div>
              <Display gameOver={gameOver} text="Game Over" />
              <Display text={`Final Score: ${score}`} />
              <Display text={`Rows Cleared: ${rows}`} />
              <Display text={`Level Reached: ${level}`} />
            </div>
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
        </div>
        <StartButton callback={startGame} />
      </div>
    </div>
  );
};

export default Tetris;