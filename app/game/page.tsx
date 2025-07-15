"use client";

import React from 'react';
import CrystalChamber from '@/components/game/CrystalChamber';
import GameUI from '@/components/game/GameUI';
import { GameProvider } from '@/components/game/GameContext';

export default function GamePage() {
  return (
    <GameProvider>
      <div className="w-full h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black relative overflow-hidden">
        {/* 游戏标题 */}
        <div className="absolute top-4 left-4 z-20">
          <h1 className="text-3xl font-bold text-cyan-300 drop-shadow-lg">
            Crystal Chambers
          </h1>
          <p className="text-sm text-cyan-200 opacity-80">
            点击并拖动水晶方块来解锁密室
          </p>
        </div>

        {/* 背景粒子效果 */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full particle-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* 主游戏区域 */}
        <div className="relative w-full h-full flex items-center justify-center perspective-1000">
          <CrystalChamber />
        </div>

        {/* 游戏UI覆盖层 */}
        <GameUI />
      </div>
    </GameProvider>
  );
} 