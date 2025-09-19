'use client';

import React from 'react';
import type { TimeGridEvent } from '@src/app/zisseki-demo/[year]/[week]/types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ProjectChartProps {
  year: number;
  month: number;
  projectId: string;
  projectName: string;
  events: TimeGridEvent[];
}

export default function ProjectChart({ year, month, projectId, projectName, events }: ProjectChartProps) {
  
  // 指定されたプロジェクトのイベントのみをフィルタリング（プロジェクトIDで照合）
  const projectEvents = events.filter(event => {
    // null/undefinedチェック
    if (!event.project || !projectId) return false;
    
    // 完全一致（プロジェクトIDで照合）
    if (event.project === projectId) return true;
    
    // 大文字小文字を区別しない一致
    if (event.project.toLowerCase() === projectId.toLowerCase()) return true;
    
    // 前後の空白を除去して比較
    if (event.project.trim() === projectId.trim()) return true;
    if (event.project.trim().toLowerCase() === projectId.trim().toLowerCase()) return true;
    
    // 部分一致（プロジェクトIDがイベントのプロジェクト名に含まれる）
    if (event.project.includes(projectId)) return true;
    
    // 逆の部分一致（イベントのプロジェクト名がプロジェクトIDに含まれる）
    if (projectId.includes(event.project)) return true;
    
    // 空白を除去した部分一致
    if (event.project.trim().includes(projectId.trim())) return true;
    if (projectId.trim().includes(event.project.trim())) return true;
    
    return false;
  });

  // プロジェクトのデータが存在しない場合の処理
  if (projectEvents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold">プロジェクト分析: {projectName} ({year}年{month}月)</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <div>このプロジェクトの実績データが見つかりません</div>
          <div className="text-sm mt-2">
            プロジェクト名: "{projectName}"
          </div>
          <div className="text-sm">
            総イベント数: {events.length}
          </div>
        </div>
      </div>
    );
  }

  // タイトル別の集計
  const titleStats = projectEvents.reduce((acc, event) => {
    const title = event.title || '未分類';
    if (!acc[title]) {
      acc[title] = { count: 0, totalHours: 0 };
    }
    acc[title].count++;
    
    // 時間計算
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    acc[title].totalHours += hours;
    
    return acc
  }, {} as Record<string, { count: number; totalHours: number }>);

  // 業務コード別の集計
  const activityCodeStats = projectEvents.reduce((acc, event) => {
    const code = event.activityCode || '未分類';
    if (!acc[code]) {
      acc[code] = { count: 0, totalHours: 0 };
    }
    acc[code].count++;
    
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    acc[code].totalHours += hours;
    
    return acc
  }, {} as Record<string, { count: number; totalHours: number }>);

  // タイトル別の円グラフデータ
  const titlePieData = {
    labels: Object.keys(titleStats),
    datasets: [
      {
        data: Object.values(titleStats).map(stats => stats.totalHours),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 業務コード別の円グラフデータ
  const activityPieData = {
    labels: Object.keys(activityCodeStats),
    datasets: [
      {
        data: Object.values(activityCodeStats).map(stats => stats.totalHours),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(199, 199, 199, 0.8)',
          'rgba(83, 102, 255, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* グラフセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* タイトル別業務円グラフ + 詳細表 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">タイトル別業務比率</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 円グラフ */}
            <div className="h-64">
              <Pie data={titlePieData} options={pieOptions} />
            </div>
            
            {/* 詳細表 */}
            <div className="h-80 overflow-y-auto">
              <h4 className="text-md font-medium mb-3">タイトル別詳細</h4>
              <div className="space-y-2">
                {Object.entries(titleStats)
                  .sort(([, a], [, b]) => b.totalHours - a.totalHours)
                  .map(([title, stats], index) => (
                    <div key={title} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: titlePieData.datasets[0].backgroundColor[index % titlePieData.datasets[0].backgroundColor.length]
                        }}
                      ></div>
                      <div className="flex-1 text-sm font-medium truncate">{title}</div>
                      <div className="text-sm text-gray-600 flex-shrink-0">{stats.totalHours.toFixed(1)}時間</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 業務コード別比率（円グラフ + 詳細表） */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">業務コード別比率</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 円グラフ */}
            <div className="h-64">
              <Pie data={activityPieData} options={pieOptions} />
            </div>
            
            {/* 詳細表 */}
            <div className="h-80 overflow-y-auto">
              <h4 className="text-md font-medium mb-3">業務コード別詳細</h4>
              <div className="space-y-2">
                {Object.entries(activityCodeStats)
                  .sort(([, a], [, b]) => b.totalHours - a.totalHours)
                  .map(([code, stats], index) => (
                    <div key={code} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: activityPieData.datasets[0].backgroundColor[index % activityPieData.datasets[0].backgroundColor.length]
                        }}
                      ></div>
                      <div className="flex-1 text-sm font-medium truncate">{code}</div>
                      <div className="text-sm text-gray-600 flex-shrink-0">{stats.totalHours.toFixed(1)}時間</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
