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
    <div className="tab-selector">
      <button
        onClick={() => handleTabChange(TAB.PROJECT)}
        className={`tab-selector-button ${activeTab === TAB.PROJECT ? 'active' : ''}`}
      >
        プロジェクト
      </button>
      <button
        onClick={() => handleTabChange(TAB.INDIRECT)}
        className={`tab-selector-button ${activeTab === TAB.INDIRECT ? 'active' : ''}`}
      >
        間接業務
      </button>
    </div>
  );
};
