'use client';

import React, { useEffect, useState } from 'react';
import { Project } from '@src/types/db_project';

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: {
    project_id: string;
  };
}

export default function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // プロジェクトデータの取得
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/db/db_project/${params.project_id}`);
        if (!response.ok) {
          throw new Error('プロジェクトの取得に失敗しました');
        }
        const data = await response.json() as Project;
        setProject(data);
      } catch (err) {
        console.error('プロジェクトの取得エラー:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProject();
  }, [params.project_id]);

  return (
    <div className="project-layout">
      <div className="project-content" style={{ overflow: 'hidden', textAlign: 'left' }}>
        {children}
      </div>
    </div>
  );
} 