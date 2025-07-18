// ==========================================
// ファイル名: TableViewToggle.tsx
// 機能: テーブル表示切り替え用チップコンポーネント
// 技術: React, TypeScript, Shadcn UI, Tailwind CSS
// ==========================================

'use client';

import React from 'react';
import { Button } from '../../../../../../components/ui/button';
import { TableViewMode } from '../../../../../../types/flat-bom';
import { Table, BarChart3, Package } from 'lucide-react';

// ==========================================
// 型定義層（Props型）
// ==========================================
interface TableViewToggleProps {
  currentMode: TableViewMode;
  onModeChange: (mode: TableViewMode) => void;
}

// ==========================================
// 定数定義層（表示設定）
// ==========================================
const VIEW_MODES = [
  {
    mode: 'flat' as TableViewMode,
    label: 'フラットBOM',
    icon: Table
  },
  {
    mode: 'aggregated' as TableViewMode,
    label: '部材重量集約',
    icon: BarChart3
  },
  {
    mode: 'part' as TableViewMode,
    label: '部品単一重量',
    icon: Package
  }
];

// ==========================================
// レンダリング層（JSX return）
// ==========================================
export const TableViewToggle = ({ currentMode, onModeChange }: TableViewToggleProps) => {
  return (
    <div className="flex items-center space-x-2 p-1 bg-gray-100 rounded-lg">
      {VIEW_MODES.map(({ mode, label, icon: Icon }) => (
        <Button
          key={mode}
          variant={currentMode === mode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onModeChange(mode)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
            currentMode === mode
              ? 'bg-white shadow-sm border border-gray-200'
              : 'hover:bg-gray-50'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="font-medium">{label}</span>
        </Button>
      ))}
    </div>
  );
}; 