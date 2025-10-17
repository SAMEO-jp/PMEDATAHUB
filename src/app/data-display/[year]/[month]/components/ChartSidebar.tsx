'use client';

import React from 'react';
import type { Project } from '@src/types/db_project';

// プロジェクトの基本情報のみを持つ型
type ProjectBasic = {
  PROJECT_ID: string;
  PROJECT_NAME: string;
  PROJECT_CLIENT_NAME: string | null;
};

interface ChartSidebarProps {
  selectedProject: string | null;
  onProjectSelect: (projectId: string | null) => void;
  projects: (Project | ProjectBasic)[];
  isLoading: boolean;
  error: any;
}

const ChartSidebar = React.memo(function ChartSidebar({ 
  selectedProject, 
  onProjectSelect, 
  projects, 
  isLoading, 
  error 
}: ChartSidebarProps) {
  if (isLoading) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="text-red-500 text-sm">
          プロジェクト一覧の取得に失敗しました
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">プロジェクト選択</h2>
        
        {/* すべてボタン */}
        <button
          onClick={() => onProjectSelect(null)}
          className={`w-full text-left px-3 py-2 rounded-md mb-2 transition-colors ${
            selectedProject === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          すべて
        </button>

        {/* プロジェクト一覧 */}
        <div className="space-y-1">
          {projects.map((project, index: number) => (
            <button
              key={project.PROJECT_ID}
              onClick={() => onProjectSelect(project.PROJECT_ID)}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedProject === project.PROJECT_ID
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-sm font-medium truncate">
                {project.PROJECT_NAME}
              </div>
              <div className={`text-xs truncate ${
                selectedProject === project.PROJECT_ID
                  ? 'text-blue-100'
                  : 'text-gray-500'
              }`}>
                {project.PROJECT_ID}
              </div>
            </button>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-gray-500 text-sm text-center py-4">
            プロジェクトが見つかりません
          </div>
        )}
      </div>
    </div>
  );
});

export default ChartSidebar;
