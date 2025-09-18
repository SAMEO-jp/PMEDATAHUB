"use client"

import React, { useState, useContext } from 'react'
import type { Project } from '@src/types/db_project'
import type { TimeGridEvent } from '@src/app/zisseki-demo/[year]/[week]/types'
import { ViewModeContext } from '../../../ViewModeContext'
import ChartSidebar from './ChartSidebar'
import AllProjectsChart from './AllProjectsChart'
import ProjectChart from './ProjectChart'

interface ZissekiChartViewProps {
  year: number
  month: number
  projects: Project[]
  events: TimeGridEvent[]
  projectsLoading: boolean
  projectsError: any
  zissekiLoading: boolean
  zissekiError: any
}

export default function ZissekiChartView({ 
  year, 
  month, 
  projects, 
  events, 
  projectsLoading, 
  projectsError, 
  zissekiLoading, 
  zissekiError 
}: ZissekiChartViewProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const { setSelectedProjectName } = useContext(ViewModeContext)
  
  // 実績データから直接プロジェクト一覧を作成（プロジェクトテーブルとの照合を避ける）
  const uniqueProjectNames = [...new Set(events.map(e => e.project).filter(Boolean))];
  
  // 実績データのプロジェクト名をベースにしたプロジェクト一覧を作成
  const projectsFromEvents = uniqueProjectNames.map((projectName, index) => ({
    PROJECT_ID: `event-project-${index}`, // 仮のID
    PROJECT_NAME: projectName,
    PROJECT_CLIENT_NAME: null,
  }));
  
  // プロジェクトテーブルからも取得して、可能な限りマッチング
  const projectsWithEvents = projectsFromEvents.map(eventProject => {
    // プロジェクトテーブルから一致するものを探す（PROJECT_IDと照合）
    const matchedProject = projects.find(project => {
      // 実績データのprojectフィールド（プロジェクトナンバー）とPROJECT_IDを照合
      if (project.PROJECT_ID === eventProject.PROJECT_NAME) return true;
      if (project.PROJECT_ID?.toLowerCase() === eventProject.PROJECT_NAME?.toLowerCase()) return true;
      if (project.PROJECT_ID?.includes(eventProject.PROJECT_NAME)) return true;
      if (eventProject.PROJECT_NAME?.includes(project.PROJECT_ID)) return true;
      return false;
    });
    
    // マッチした場合はプロジェクトテーブルの情報を使用、そうでなければ実績データの情報を使用
    return matchedProject || eventProject;
  });
  
  // 選択されたプロジェクトの情報を取得
  const selectedProjectInfo = selectedProject 
    ? projectsWithEvents.find((p: Project) => p.PROJECT_ID === selectedProject)
    : null;

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId);
    
    // 選択されたプロジェクト名をContextに設定
    if (projectId) {
      const selectedProjectInfo = projectsWithEvents.find(p => p.PROJECT_ID === projectId);
      setSelectedProjectName(selectedProjectInfo?.PROJECT_NAME || null);
    } else {
      setSelectedProjectName(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* 左サイドバー */}
      <ChartSidebar 
        selectedProject={selectedProject}
        onProjectSelect={handleProjectSelect}
        projects={projectsWithEvents}
        isLoading={projectsLoading}
        error={projectsError}
      />
      
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          {selectedProject === null ? (
            <AllProjectsChart year={year} month={month} events={events} projects={projects} />
          ) : selectedProjectInfo ? (
            <ProjectChart 
              year={year} 
              month={month} 
              projectId={selectedProject}
              projectName={selectedProjectInfo.PROJECT_NAME}
              events={events}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div>プロジェクト情報が見つかりません</div>
              <div className="text-sm mt-2">
                選択されたプロジェクトID: {selectedProject}
              </div>
              <div className="text-sm">
                利用可能なプロジェクト数: {projectsWithEvents.length}
              </div>
              <div className="text-sm">
                実績データのプロジェクト数: {uniqueProjectNames.length}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
