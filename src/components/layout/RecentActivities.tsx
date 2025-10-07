'use client';

import React, { useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

// 実績データの型定義
interface Activity {
  id: string;
  title: string;
  project: string;
  date: string;
  duration: number; // 分単位
  category: string;
}

// モック実績データ
const mockActivities: Activity[] = [
  {
    id: '1',
    title: '設計レビュー',
    project: 'プロジェクトA',
    date: '2025-10-07',
    duration: 120,
    category: '会議'
  },
  {
    id: '2',
    title: 'コーディング作業',
    project: 'プロジェクトB',
    date: '2025-10-07',
    duration: 240,
    category: '開発'
  },
  {
    id: '3',
    title: '顧客打ち合わせ',
    project: 'プロジェクトC',
    date: '2025-10-06',
    duration: 90,
    category: '会議'
  },
  {
    id: '4',
    title: 'ドキュメント作成',
    project: 'プロジェクトA',
    date: '2025-10-06',
    duration: 180,
    category: '資料作成'
  },
  {
    id: '5',
    title: 'テスト実施',
    project: 'プロジェクトB',
    date: '2025-10-05',
    duration: 150,
    category: 'テスト'
  }
];

export function RecentActivities() {
  const [activities] = useState<Activity[]>(mockActivities);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '会議': return 'bg-blue-100 text-blue-800 border-blue-200';
      case '開発': return 'bg-green-100 text-green-800 border-green-200';
      case '資料作成': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'テスト': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`;
    } else if (hours > 0) {
      return `${hours}時間`;
    } else {
      return `${mins}分`;
    }
  };

  return (
    <div className="recent-activities h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          直近の実績
        </h2>
      </div>

      {/* 実績一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map(activity => (
              <div
                key={activity.id}
                className="activity-item p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {activity.project}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(activity.category)}`}>
                    {activity.category}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDuration(activity.duration)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm py-8">
              直近の実績がありません
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>📊 {activities.length}件の実績</p>
        </div>
      </div>
    </div>
  );
}

