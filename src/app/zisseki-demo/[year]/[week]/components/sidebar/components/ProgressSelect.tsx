"use client"

import React from 'react';

interface ProgressSelectProps {
  currentProgress: string;
  onProgressChange: (progress: string) => void;
  label?: string;
}

// 進捗状況のオプション
const PROGRESS_OPTIONS = [
  { value: '開始', label: '開始' },
  { value: '進行中', label: '進行中' },
  { value: '終了', label: '終了' },
  { value: '再開', label: '再開' },
  { value: '再終了', label: '再終了' }
];

export const ProgressSelect: React.FC<ProgressSelectProps> = ({
  currentProgress,
  onProgressChange,
  label = "進捗状況"
}) => {
  return (
    <div className="sidebar-field">
      <label className="sidebar-label">{label}</label>
      <select
        value={currentProgress || ''}
        onChange={(e) => onProgressChange(e.target.value)}
        className="progress-select"
      >
        <option value="">進捗を選択</option>
        {PROGRESS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
