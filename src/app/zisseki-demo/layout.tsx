"use client";

import React from 'react';
import { TaskSidebar } from './components/TaskSidebar';

interface ZissekiLayoutProps {
  children: React.ReactNode;
}

export default function ZissekiLayout({ children }: ZissekiLayoutProps) {
  return (
    <div className="zisseki-layout-container h-full flex">
      {/* タスク一覧サイドバー（左側） */}
      <div className="task-sidebar-container w-80 flex-shrink-0 border-r border-gray-200 bg-white">
        <TaskSidebar />
      </div>
      
      {/* メインコンテンツエリア（右側） */}
      <div className="main-content-area flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
