"use client";

import React, { useEffect, useState } from 'react';
import { useGame } from './GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Volume2, 
  VolumeX, 
  Lightbulb, 
  RotateCcw, 
  Trophy, 
  Clock,
  Star
} from 'lucide-react';

export default function GameUI() {
  const { state, dispatch } = useGame();
  const [timeDisplay, setTimeDisplay] = useState('00:00');

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'UPDATE_TIME', time: state.timeElapsed + 1 });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.timeElapsed, dispatch]);

  useEffect(() => {
    const minutes = Math.floor(state.timeElapsed / 60);
    const seconds = state.timeElapsed % 60;
    setTimeDisplay(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [state.timeElapsed]);

  const solvedCount = state.puzzles.filter(p => p.solved).length;
  const totalPuzzles = state.puzzles.length;

  return (
    <>
      {/* 顶部状态栏 */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Card className="glass-effect border-cyan-500/50 p-3">
          <div className="flex items-center space-x-4 text-cyan-300">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{timeDisplay}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>{state.score}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>{solvedCount}/{totalPuzzles}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* 右侧控制面板 */}
      <div className="absolute bottom-4 right-4 z-10 space-y-2">
        <Button
          onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
          variant="outline"
          size="icon"
          className="glass-effect border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
        >
          {state.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
        
        <Button
          onClick={() => dispatch({ type: 'TOGGLE_HINTS' })}
          variant="outline"
          size="icon"
          className={`glass-effect border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 ${
            state.showHints ? 'bg-cyan-500/30' : ''
          }`}
        >
          <Lightbulb className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={() => dispatch({ type: 'RESET_GAME' })}
          variant="outline"
          size="icon"
          className="glass-effect border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* 进度指示器 */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="glass-effect border-cyan-500/50 p-3">
          <div className="text-cyan-300 text-sm">
            <p className="mb-2">第 {state.currentLevel} 关</p>
            <div className="flex space-x-1">
              {state.puzzles.map((puzzle, index) => (
                <div
                  key={puzzle.id}
                  className={`w-3 h-3 rounded-full border ${
                    puzzle.solved 
                      ? 'bg-green-500 border-green-400' 
                      : puzzle.isInteracting
                      ? 'bg-yellow-500 border-yellow-400 animate-pulse'
                      : 'bg-gray-600 border-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 提示文本 */}
      {state.showHints && (
        <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
          <Card className="glass-effect border-cyan-500/50 p-4 max-w-xs">
            <div className="text-cyan-300 text-sm space-y-2">
              <h3 className="font-bold text-cyan-200">游戏提示：</h3>
              <ul className="space-y-1 text-xs">
                <li>• 点击水晶方块开始旋转</li>
                <li>• 拖动鼠标旋转方块到正确角度</li>
                <li>• 方块发出绿光表示解锁成功</li>
                <li>• 完成所有谜题进入下一关</li>
              </ul>
            </div>
          </Card>
        </div>
      )}

      {/* 游戏完成庆祝界面 */}
      {state.isGameComplete && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <Card className="bg-gradient-to-b from-purple-900 to-blue-900 border-cyan-500 p-8 text-center">
            <div className="text-cyan-300 space-y-4">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
              <h2 className="text-3xl font-bold text-yellow-400">恭喜通关！</h2>
              <div className="space-y-2">
                <p>完成时间: {timeDisplay}</p>
                <p>获得分数: {state.score}</p>
                <p>第 {state.currentLevel} 关完成</p>
              </div>
              <div className="flex space-x-2 justify-center">
                <Button
                  onClick={() => dispatch({ type: 'NEXT_LEVEL' })}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  下一关
                </Button>
                <Button
                  onClick={() => dispatch({ type: 'RESET_GAME' })}
                  variant="outline"
                  className="border-cyan-500 text-cyan-300"
                >
                  重新开始
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
} 