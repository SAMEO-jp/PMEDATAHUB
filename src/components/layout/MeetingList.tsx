'use client';

import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

// 会議データの型定義
interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  participants: number;
  type: 'internal' | 'client' | 'online';
  status: 'scheduled' | 'in-progress' | 'completed';
}

// モック会議データ
const mockMeetings: Meeting[] = [
  {
    id: 'meeting1',
    title: 'プロジェクトA キックオフミーティング',
    date: '2025-10-08',
    time: '10:00-11:00',
    location: '会議室A',
    participants: 5,
    type: 'internal',
    status: 'scheduled'
  },
  {
    id: 'meeting2',
    title: 'クライアント打ち合わせ',
    date: '2025-10-08',
    time: '14:00-15:30',
    location: 'オンライン',
    participants: 8,
    type: 'client',
    status: 'scheduled'
  },
  {
    id: 'meeting3',
    title: '週次定例会議',
    date: '2025-10-09',
    time: '09:00-09:30',
    location: '会議室B',
    participants: 12,
    type: 'internal',
    status: 'scheduled'
  },
  {
    id: 'meeting4',
    title: '技術レビュー',
    date: '2025-10-10',
    time: '15:00-16:00',
    location: 'オンライン',
    participants: 6,
    type: 'online',
    status: 'scheduled'
  }
];

export function MeetingList() {
  const [meetings] = useState<Meeting[]>(mockMeetings);
  const [selectedType, setSelectedType] = useState<string>('all');

  const types = [
    { id: 'all', label: 'すべて' },
    { id: 'internal', label: '社内' },
    { id: 'client', label: 'クライアント' },
    { id: 'online', label: 'オンライン' }
  ];

  const filteredMeetings = selectedType === 'all'
    ? meetings
    : meetings.filter(meeting => meeting.type === selectedType);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'online': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'internal': return '社内';
      case 'client': return 'クライアント';
      case 'online': return 'オンライン';
      default: return '未分類';
    }
  };

  return (
    <div className="meeting-list h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          会議一覧
        </h2>

        {/* フィルター */}
        <div className="flex gap-2 flex-wrap">
          {types.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                selectedType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 会議一覧 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredMeetings.length > 0 ? (
            filteredMeetings.map(meeting => (
              <div
                key={meeting.id}
                className="meeting-item p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-800 text-sm leading-tight flex-1">
                    {meeting.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(meeting.type)}`}>
                    {getTypeLabel(meeting.type)}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{meeting.time}</span>
                  </div>
                  {meeting.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>{meeting.participants}名</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm py-8">
              該当する会議がありません
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>📅 {filteredMeetings.length}件の会議</p>
        </div>
      </div>
    </div>
  );
}

