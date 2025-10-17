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

interface AllProjectsChartProps {
  year: number;
  month: number;
  events: TimeGridEvent[];
  projects?: any[]; // プロジェクトテーブルのデータを追加
}

export default function AllProjectsChart({ year, month, events, projects = [] }: AllProjectsChartProps) {

  // データが存在しない場合の処理
  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold">全プロジェクト分析 ({year}年{month}月)</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          この期間の実績データが見つかりません
        </div>
      </div>
    );
  }

  // プロジェクト別の集計（プロジェクト名称で表示）
  const projectStats = events.reduce((acc, event) => {
    const projectId = event.project || '未分類';
    
    // プロジェクトテーブルからプロジェクト名称を取得
    const projectInfo = projects.find(p => p.PROJECT_ID === projectId);
    const projectName = projectInfo?.PROJECT_NAME || projectId; // 見つからない場合はプロジェクトIDをそのまま使用
    
    if (!acc[projectName]) {
      acc[projectName] = { count: 0, totalHours: 0, projectId: projectId };
    }
    acc[projectName].count++;
    
    // 時間計算
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    acc[projectName].totalHours += hours;
    
    return acc
  }, {} as Record<string, { count: number; totalHours: number; projectId: string }>);

  // 業務コード別の集計
  const activityCodeStats = events.reduce((acc, event) => {
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

  // プロジェクト別時間の円グラフデータ
  const projectPieData = {
    labels: Object.keys(projectStats),
    datasets: [
      {
        data: Object.values(projectStats).map(stats => stats.totalHours),
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

  // 業務コード別時間の円グラフデータ
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
        {/* プロジェクト別時間比率（円グラフ + 詳細表） */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">プロジェクト別時間比率</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 円グラフ */}
            <div className="h-64">
              <Pie data={projectPieData} options={pieOptions} />
            </div>
            
            {/* 詳細表 */}
            <div className="h-80 overflow-y-auto">
              <h4 className="text-md font-medium mb-3">プロジェクト別詳細</h4>
              <div className="space-y-2">
                {Object.entries(projectStats)
                  .sort(([, a], [, b]) => b.totalHours - a.totalHours)
                  .map(([project, stats], index) => (
                    <div key={project} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: projectPieData.datasets[0].backgroundColor[index % projectPieData.datasets[0].backgroundColor.length]
                        }}
                      ></div>
                      <div className="flex-1 text-sm font-medium truncate">{project}</div>
                      <div className="text-sm text-gray-600 flex-shrink-0">{stats.totalHours.toFixed(1)}時間</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* 業務コード別時間比率（円グラフ + 詳細表） */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">業務コード別時間比率</h3>
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
