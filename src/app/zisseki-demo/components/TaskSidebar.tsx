"use client";

import React, { useState } from 'react';
import { CheckSquare, Clock } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime?: number; // 分単位
}

// モックデータ
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'プロジェクト企画書作成',
    description: '新規プロジェクトの企画書を作成する',
    category: '企画',
    priority: 'high',
    estimatedTime: 120
  },
  {
    id: '2',
    title: '顧客ミーティング',
    description: '月次進捗報告のための顧客ミーティング',
    category: '会議',
    priority: 'high',
    estimatedTime: 60
  },
  {
    id: '3',
    title: '資料作成',
    description: 'プレゼン資料の作成',
    category: '作成',
    priority: 'medium',
    estimatedTime: 90
  },
  {
    id: '4',
    title: 'システムテスト',
    description: '新機能のテスト実行',
    category: '開発',
    priority: 'medium',
    estimatedTime: 180
  },
  {
    id: '5',
    title: 'メール返信',
    description: '各種メールへの返信',
    category: '事務',
    priority: 'low',
    estimatedTime: 30
  }
];

export function TaskSidebar() {
  const [tasks] = useState<Task[]>(mockTasks);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('application/json', JSON.stringify(task));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="task-sidebar h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <CheckSquare className="w-4 h-4" />
          タスク一覧
        </h2>

        {/* フィルター */}
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'すべて' : category}
            </button>
          ))}
        </div>
      </div>

      {/* タスク一覧 */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                className="task-item p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="font-medium text-gray-800 text-xs leading-tight flex-1">
                    {task.title}
                  </h3>
                  <span className={`px-1.5 py-0.5 text-[10px] rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                  </span>
                </div>
                
                {task.description && (
                  <p className="text-[11px] text-gray-600 mb-1.5 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded">
                    {task.category}
                  </span>
                  {task.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {Math.floor(task.estimatedTime / 60)}時間{task.estimatedTime % 60}分
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-xs py-6">
              該当するタスクがありません
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>📋 {filteredTasks.length}件のタスク</p>
        </div>
      </div>
    </div>
  );
}
