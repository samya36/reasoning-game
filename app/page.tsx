"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Info, Settings } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-cyan-300 mb-4 drop-shadow-lg">
            Crystal Chambers
          </h1>
          <p className="text-xl text-cyan-200 opacity-80 max-w-2xl mx-auto">
            一个基于推理的解谜游戏，通过拖拽和旋转水晶方块来解锁神秘的密室
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="bg-gray-800/50 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-cyan-400" />
              </div>
              <CardTitle className="text-cyan-300">开始游戏</CardTitle>
              <CardDescription className="text-cyan-200/70">
                进入充满挑战的水晶密室世界
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/game">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  开始冒险
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-purple-400" />
              </div>
              <CardTitle className="text-purple-300">游戏说明</CardTitle>
              <CardDescription className="text-purple-200/70">
                了解游戏规则和操作方式
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm text-gray-300 space-y-2">
                <p>• 点击并拖动水晶方块</p>
                <p>• 旋转方块找到正确位置</p>
                <p>• 解锁所有密室挑战</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-green-500/30 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-green-400" />
              </div>
              <CardTitle className="text-green-300">设置</CardTitle>
              <CardDescription className="text-green-200/70">
                自定义游戏体验
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm text-gray-300 space-y-2">
                <p>• 音效控制</p>
                <p>• 难度调整</p>
                <p>• 视觉效果</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">游戏特色</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>沉浸式 3D 视觉效果</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>直观的拖拽操作</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>多层次解谜挑战</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>动态粒子特效</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}