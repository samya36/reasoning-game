"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface PuzzleState {
  id: string;
  solved: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  targetRotation: [number, number, number];
  isInteracting: boolean;
}

export interface GameState {
  currentLevel: number;
  score: number;
  timeElapsed: number;
  puzzles: PuzzleState[];
  isGameComplete: boolean;
  showHints: boolean;
  soundEnabled: boolean;
}

type GameAction =
  | { type: 'ROTATE_PUZZLE'; puzzleId: string; rotation: [number, number, number] }
  | { type: 'SOLVE_PUZZLE'; puzzleId: string }
  | { type: 'START_INTERACTION'; puzzleId: string }
  | { type: 'END_INTERACTION'; puzzleId: string }
  | { type: 'NEXT_LEVEL' }
  | { type: 'UPDATE_TIME'; time: number }
  | { type: 'TOGGLE_HINTS' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESET_GAME' };

const initialPuzzles: PuzzleState[] = [
  {
    id: 'crystal-box-1',
    solved: false,
    position: [0, 1, 0],
    rotation: [0, 0, 0],
    targetRotation: [Math.PI / 2, Math.PI / 4, 0],
    isInteracting: false,
  },
  {
    id: 'crystal-box-2',
    solved: false,
    position: [-2, 1, 2],
    rotation: [0, 0, 0],
    targetRotation: [0, Math.PI, Math.PI / 2],
    isInteracting: false,
  },
  {
    id: 'crystal-box-3',
    solved: false,
    position: [2, 1, -2],
    rotation: [0, 0, 0],
    targetRotation: [Math.PI / 4, Math.PI / 2, Math.PI / 4],
    isInteracting: false,
  },
];

const initialState: GameState = {
  currentLevel: 1,
  score: 0,
  timeElapsed: 0,
  puzzles: initialPuzzles,
  isGameComplete: false,
  showHints: false,
  soundEnabled: true,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROTATE_PUZZLE':
      return {
        ...state,
        puzzles: state.puzzles.map(puzzle =>
          puzzle.id === action.puzzleId
            ? { ...puzzle, rotation: action.rotation }
            : puzzle
        ),
      };

    case 'SOLVE_PUZZLE':
      const updatedPuzzles = state.puzzles.map(puzzle =>
        puzzle.id === action.puzzleId
          ? { ...puzzle, solved: true, isInteracting: false }
          : puzzle
      );
      const allSolved = updatedPuzzles.every(puzzle => puzzle.solved);
      
      return {
        ...state,
        puzzles: updatedPuzzles,
        score: state.score + 100,
        isGameComplete: allSolved,
      };

    case 'START_INTERACTION':
      return {
        ...state,
        puzzles: state.puzzles.map(puzzle =>
          puzzle.id === action.puzzleId
            ? { ...puzzle, isInteracting: true }
            : { ...puzzle, isInteracting: false }
        ),
      };

    case 'END_INTERACTION':
      return {
        ...state,
        puzzles: state.puzzles.map(puzzle =>
          puzzle.id === action.puzzleId
            ? { ...puzzle, isInteracting: false }
            : puzzle
        ),
      };

    case 'NEXT_LEVEL':
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        puzzles: initialPuzzles.map(puzzle => ({ ...puzzle, solved: false })),
        isGameComplete: false,
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeElapsed: action.time,
      };

    case 'TOGGLE_HINTS':
      return {
        ...state,
        showHints: !state.showHints,
      };

    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      };

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 