"use client";

import React, { useState, useEffect } from 'react';
import { TaskSidebar } from './components/TaskSidebar';
import { MeetingList } from '@/components/layout/MeetingList';
import { ProjectList } from '@/components/layout/ProjectList';
import { RecentActivities } from '@/components/layout/RecentActivities';

interface ZissekiLayoutProps {
  children: React.ReactNode;
}

type LeftSidebarSection = 'meeting' | 'project' | 'task' | 'recent' | null;

export default function ZissekiLayout({ children }: ZissekiLayoutProps) {
  console.log('🏗️ ZissekiLayout がマウントされました');
  
  const [leftSidebarSection, setLeftSidebarSection] = useState<LeftSidebarSection>(null);
  console.log('📊 現在の leftSidebarSection:', leftSidebarSection);

  // グローバルサイドバーからのイベントをリスン
  useEffect(() => {
    console.log('🔧 useEffect が実行されました');
    
    const handleSectionToggle = (event: Event) => {
      console.log('📥 zissekiSectionToggle イベントを受信しました', event);
      const customEvent = event as CustomEvent;
      const { section } = customEvent.detail;
      console.log(`🔄 セクションを切り替え: ${section}`);
      
      setLeftSidebarSection((prev) => {
        const newValue = prev === section ? null : section;
        console.log(`📊 状態変更: ${prev} → ${newValue}`);
        return newValue;
      });
    };

    console.log('👂 zissekiSectionToggle イベントリスナーを登録しました');
    window.addEventListener('zissekiSectionToggle', handleSectionToggle);

    return () => {
      console.log('🔇 zissekiSectionToggle イベントリスナーを解除しました');
      window.removeEventListener('zissekiSectionToggle', handleSectionToggle);
    };
  }, []);

  return (
    <div className="zisseki-layout-container h-full flex relative bg-white">
      {/* 左サイドバーコンテンツ（条件付き表示） */}
      {leftSidebarSection && (
        <div 
          className="left-sidebar-container w-80 flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300"
        >
          {leftSidebarSection === 'meeting' && (
            <>
              {console.log('📋 会議一覧を表示')}
              <MeetingList />
            </>
          )}
          {leftSidebarSection === 'project' && (
            <>
              {console.log('📁 プロジェクト一覧を表示')}
              <ProjectList />
            </>
          )}
          {leftSidebarSection === 'task' && (
            <>
              {console.log('✅ タスク一覧を表示')}
              <TaskSidebar />
            </>
          )}
          {leftSidebarSection === 'recent' && (
            <>
              {console.log('📊 直近の実績を表示')}
              <RecentActivities />
            </>
          )}
        </div>
      )}
      
      {/* メインコンテンツエリア（右側） */}
      <div className="main-content-area flex-1 overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}
