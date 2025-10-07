'use client';

import React, { useState } from 'react';
import { Folder, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

// プロジェクトデータの型定義
interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'planning' | 'completed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  progress: number; // 0-100
  startDate: string;
  endDate?: string;
  memberCount: number;
}

// モックプロジェクトデータ
const mockProjects: Project[] = [
  {
    id: 'project1',
    name: 'プロジェクトA',
    description: '新規システム開発',
    status: 'active',
    priority: 'high',
    progress: 65,
    startDate: '2025-09-01',
    endDate: '2025-12-31',
    memberCount: 8
  },
  {
    id: 'project2',
    name: 'プロジェクトB',
    description: 'インフラ更新',
    status: 'active',
    priority: 'medium',
    progress: 40,
    startDate: '2025-10-01',
    endDate: '2025-11-30',
    memberCount: 5
  },
  {
    id: 'project3',
    name: 'プロジェクトC',
    description: '業務改善施策',
    status: 'planning',
    priority: 'low',
    progress: 10,
    startDate: '2025-11-01',
    memberCount: 3
  },
  {
    id: 'project4',
    name: 'プロジェクトD',
    description: 'セキュリティ対策',
    status: 'active',
    priority: 'high',
    progress: 80,
    startDate: '2025-08-01',
    endDate: '2025-10-15',
    memberCount: 6
  },
  {
    id: 'project5',
    name: 'プロジェクトE',
    description: 'データ分析基盤構築',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    startDate: '2025-06-01',
    endDate: '2025-09-30',
    memberCount: 4
  }
];

export function ProjectList() {
  const [projects] = useState<Project[]>(mockProjects);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statuses = [
    { id: 'all', label: 'すべて' },
    { id: 'active', label: '進行中' },
    { id: 'planning', label: '計画中' },
    { id: 'completed', label: '完了' },
    { id: 'on-hold', label: '保留' }
  ];

  const filteredProjects = selectedStatus === 'all'
    ? projects
    : projects.filter(project => project.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '進行中';
      case 'planning': return '計画中';
      case 'completed': return '完了';
      case 'on-hold': return '保留';
      default: return '未分類';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="project-list h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Folder className="w-5 h-5" />
          プロジェクト一覧
        </h2>

        {/* フィルター */}
        <div className="flex gap-2 flex-wrap">
          {statuses.map(status => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                selectedStatus === status.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* プロジェクト一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <div
                key={project.id}
                className="project-item p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-800 text-sm leading-tight">
                        {project.name}
                      </h3>
                      <AlertCircle className={`w-3.5 h-3.5 ${getPriorityColor(project.priority)}`} />
                    </div>
                    {project.description && (
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {/* 進捗バー */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>進捗</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(project.progress)}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.startDate}</span>
                    {project.endDate && (
                      <>
                        <span>-</span>
                        <span>{project.endDate}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{project.memberCount}名</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm py-8">
              該当するプロジェクトがありません
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>📁 {filteredProjects.length}件のプロジェクト</p>
        </div>
      </div>
    </div>
  );
}

