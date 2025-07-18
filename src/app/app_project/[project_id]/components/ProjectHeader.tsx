'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ProjectHeaderProps {
  projectId: string;
}

const tabs = [
  { id: 'overview', label: '概要', path: '' },
  { id: 'detail', label: '詳細', path: '/detail' },
  { id: 'zumen', label: '図面', path: '/zumen/all_list' },
  { id: '3d', label: '3D', path: '/3d' },
  { id: 'minutes', label: '議事録', path: '/minutes' },
  { id: 'ebom', label: 'EBOM', path: '/ebom' },
  { id: 'mbom', label: 'MBOM', path: '/mbom' },
  { id: 'cmom', label: 'CMOM', path: '/cmom' },
];

export default function ProjectHeader({ projectId }: ProjectHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('overview');

  // 現在のパスに基づいてアクティブタブを設定
  useEffect(() => {
    const currentPath = pathname.replace(`/app_project/${projectId}`, '');
    const tab = tabs.find(tab => tab.path === currentPath) || tabs[0];
    setActiveTab(tab.id);
  }, [pathname, projectId]);

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id);
    const targetPath = `/app_project/${projectId}${tab.path}`;
    router.push(targetPath);
  };

  return (
    <div className="project-header">
      <div className="project-header-content">
        {/* タブナビゲーション */}
        <div className="project-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`project-tab ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 