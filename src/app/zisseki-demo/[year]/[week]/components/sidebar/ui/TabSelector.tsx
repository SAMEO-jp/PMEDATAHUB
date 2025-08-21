"use client"

import { Tab, TAB } from './types';

interface TabSelectorProps {
  eventId: string;
  activeTab: Tab;
  onTabChange: (eventId: string, newTab: Tab) => void;
}

/**
 * タブセレクターコンポーネント
 * 
 * 設計思想:
 * - 純粋なUIコンポーネントとして実装
 * - ビジネスロジックは持たず、親コンポーネントに通知のみ
 * - 状態は親から渡されたactiveTabを参照
 * - イベントIDと新しい状態を親に通知
 */
export const TabSelector = ({ eventId, activeTab, onTabChange }: TabSelectorProps) => {
  /**
   * タブ変更時の処理
   * イベントIDと新しい状態を親コンポーネントに通知
   */
  const handleTabChange = (newTab: Tab) => {
    onTabChange(eventId, newTab);
  };

  return (
    <div className="flex space-x-1">
      <button
        onClick={() => handleTabChange(TAB.PROJECT)}
        className={`px-3 py-1 text-sm rounded ${
          activeTab === TAB.PROJECT
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        プロジェクト
      </button>
      <button
        onClick={() => handleTabChange(TAB.INDIRECT)}
        className={`px-3 py-1 text-sm rounded ${
          activeTab === TAB.INDIRECT
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        間接業務
      </button>
    </div>
  );
};
