"use client"

interface TabSelectorProps {
  eventId: string;
  activeTab: 'project' | 'indirect';
  onTabChange: (eventId: string, newTab: 'project' | 'indirect') => void;
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
  const handleTabChange = (newTab: 'project' | 'indirect') => {
    onTabChange(eventId, newTab);
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
