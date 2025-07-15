"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGame } from './GameContext';

interface CrystalBoxProps {
  puzzleState: any;
  index: number;
}

function CrystalBox({ puzzleState, index }: CrystalBoxProps) {
  const { dispatch } = useGame();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // 检查是否接近目标旋转
  const isNearTarget = (current: number[], target: number[], tolerance = 0.2) => {
    return current.every((val, idx) => {
      const diff = Math.abs(val - target[idx]);
      return diff < tolerance || Math.abs(diff - Math.PI * 2) < tolerance;
    });
  };

  const isSolved = isNearTarget(puzzleState.rotation, puzzleState.targetRotation);

  // 自动检测解锁状态
  useEffect(() => {
    if (isSolved && !puzzleState.solved) {
      dispatch({ type: 'SOLVE_PUZZLE', puzzleId: puzzleState.id });
    }
  }, [isSolved, puzzleState.solved, puzzleState.id, dispatch]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!puzzleState.solved) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      dispatch({ type: 'START_INTERACTION', puzzleId: puzzleState.id });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && !puzzleState.solved) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newRotation = [
        puzzleState.rotation[0] + deltaY * 0.01,
        puzzleState.rotation[1] + deltaX * 0.01,
        puzzleState.rotation[2]
      ] as [number, number, number];
      
      dispatch({ 
        type: 'ROTATE_PUZZLE', 
        puzzleId: puzzleState.id, 
        rotation: newRotation 
      });
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dispatch({ type: 'END_INTERACTION', puzzleId: puzzleState.id });
  };

  // 将弧度转换为度数
  const toDegrees = (radians: number) => radians * (180 / Math.PI);

  const boxStyle = {
    transform: `translate3d(${puzzleState.position[0] * 100}px, ${-puzzleState.position[1] * 100}px, ${puzzleState.position[2] * 100}px) 
               rotateX(${toDegrees(puzzleState.rotation[0])}deg) 
               rotateY(${toDegrees(puzzleState.rotation[1])}deg) 
               rotateZ(${toDegrees(puzzleState.rotation[2])}deg)`,
    transformStyle: 'preserve-3d' as const,
  };

  return (
    <div className="absolute no-select">
      <div
        ref={boxRef}
        className={`w-24 h-24 cursor-pointer transition-all duration-300 transform-style-3d ${
          puzzleState.solved ? 'crystal-solved' : hovered ? 'crystal-glow' : ''
        }`}
        style={boxStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* 立方体的6个面 */}
        <div className={`absolute w-24 h-24 ${getCubeClass(puzzleState.solved, hovered, 'front')}`}
             style={{ transform: 'translateZ(48px)' }}>
          <div className="w-full h-full flex items-center justify-center text-white font-bold">
            {index + 1}
          </div>
        </div>
        
        <div className={`absolute w-24 h-24 ${getCubeClass(puzzleState.solved, hovered, 'back')}`}
             style={{ transform: 'translateZ(-48px) rotateY(180deg)' }} />
        
        <div className={`absolute w-24 h-24 ${getCubeClass(puzzleState.solved, hovered, 'right')}`}
             style={{ transform: 'rotateY(90deg) translateZ(48px)' }} />
        
        <div className={`absolute w-24 h-24 ${getCubeClass(puzzleState.solved, hovered, 'left')}`}
             style={{ transform: 'rotateY(-90deg) translateZ(48px)' }} />
        
        <div className={`absolute w-24 h-24 ${getCubeClass(puzzleState.solved, hovered, 'top')}`}
             style={{ transform: 'rotateX(90deg) translateZ(48px)' }} />
        
        <div className={`absolute w-24 h-24 ${getCubeClass(puzzleState.solved, hovered, 'bottom')}`}
             style={{ transform: 'rotateX(-90deg) translateZ(48px)' }} />
      </div>
      
      {/* 状态指示器 */}
      {puzzleState.solved && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-400 text-sm font-bold animate-bounce">
          ✓ 已解锁
        </div>
      )}
      
      {hovered && !puzzleState.solved && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs whitespace-nowrap">
          点击拖动旋转
        </div>
      )}
    </div>
  );
}

function getCubeClass(solved: boolean, hovered: boolean, face: string) {
  const base = "border border-opacity-30 backdrop-blur-sm";
  
  if (solved) {
    return `${base} bg-gradient-to-br from-green-400/80 to-emerald-600/80 border-green-300 shadow-lg shadow-green-500/50`;
  }
  
  if (hovered) {
    return `${base} bg-gradient-to-br from-blue-500/70 to-purple-600/70 border-blue-300 shadow-lg shadow-blue-500/30`;
  }
  
  return `${base} bg-gradient-to-br from-purple-600/60 to-blue-800/60 border-purple-300 shadow-lg shadow-purple-500/20`;
}

// 环境装饰组件
function Environment() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 装饰性水晶柱 */}
      {[-200, 200].map((x, i) => 
        [-200, 200].map((z, j) => (
          <div
            key={`${i}-${j}`}
            className="absolute w-6 h-40 bg-gradient-to-t from-purple-900/80 to-cyan-500/60 transform-gpu"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${z}px)`,
              transform: `translateX(-50%) translateY(-50%) translateZ(-100px)`,
              transformStyle: 'preserve-3d',
            }}
          />
        ))
      )}
      
      {/* 神秘符文环 */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * 360;
        return (
          <div
            key={i}
            className="absolute text-2xl text-cyan-400 rune-effect"
            style={{
              left: `calc(50% + ${Math.cos(angle * Math.PI / 180) * 300}px)`,
              top: `calc(50% + ${Math.sin(angle * Math.PI / 180) * 300}px)`,
              transform: 'translate(-50%, -50%)',
              animationDelay: `${i * 0.5}s`,
            }}
          >
            ◊
          </div>
        );
      })}
    </div>
  );
}

export default function CrystalChamber() {
  const { state } = useGame();

  return (
    <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
      <Environment />
      
      {/* 关卡标题 */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h2 className="text-2xl font-bold text-white mb-2">
          Crystal Chambers - 第 {state.currentLevel} 关
        </h2>
        <p className="text-cyan-300 text-sm">
          将所有水晶方块旋转到正确角度以解锁密室
        </p>
      </div>
      
      {/* 3D场景容器 */}
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: 'translate(-50%, -50%) rotateX(-10deg) rotateY(20deg)'
        }}
      >
        {/* 渲染所有谜题方块 */}
        {state.puzzles.map((puzzle, index) => (
          <CrystalBox key={puzzle.id} puzzleState={puzzle} index={index} />
        ))}
      </div>
      
      {/* 地面网格 */}
      <div className="absolute bottom-0 left-0 w-full h-full opacity-20">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} className="border border-cyan-500/30" />
          ))}
        </div>
      </div>
    </div>
  );
} 