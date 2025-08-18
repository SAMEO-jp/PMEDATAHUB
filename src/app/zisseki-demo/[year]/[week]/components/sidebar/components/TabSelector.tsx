"use client"

import { useEventContext } from "../../../context/EventContext";

interface TabSelectorProps {
  activeTab: 'project' | 'indirect';
  onTabChange: (tab: 'project' | 'indirect') => void;
}

export const TabSelector = ({ activeTab, onTabChange }: TabSelectorProps) => {
  const { selectedEvent, updateEvent } = useEventContext();

  /**
   * タブ変更時の処理
   * 先にイベントを更新してから親コンポーネントに通知
   */
  const handleTabChange = (newTab: 'project' | 'indirect') => {
    // セレクトイベントが存在する場合、先にアクティビティコードを更新
    if (selectedEvent) {
      let newActivityCode = '';
      
      if (newTab === 'project') {
        // プロジェクトタブの場合、デフォルトで「P」プレフィックス
        newActivityCode = 'P000';
      } else if (newTab === 'indirect') {
        // 間接業務タブの場合、デフォルトで「Z」プレフィックス
        newActivityCode = 'Z000';
      }

      // 先にイベントを更新
      const updatedEvent = {
        ...selectedEvent,
        activityCode: newActivityCode,
        selectedTab: newTab
      };

      updateEvent(selectedEvent.id, updatedEvent);
    }

    // その後、親コンポーネントのタブ変更処理を実行
    onTabChange(newTab);
  };

  return (
    <div className="flex space-x-1">
      <button
        onClick={() => handleTabChange('project')}
        className={`px-3 py-1 text-sm rounded ${
          activeTab === 'project'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        プロジェクト
      </button>
      <button
        onClick={() => handleTabChange('indirect')}
        className={`px-3 py-1 text-sm rounded ${
          activeTab === 'indirect'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        間接業務
      </button>
    </div>
  );
};