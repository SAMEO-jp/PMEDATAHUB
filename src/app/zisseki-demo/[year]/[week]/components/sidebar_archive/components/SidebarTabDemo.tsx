"use client"

import React, { useState } from 'react';
import { TabNavigation, HierarchicalTabNavigation } from './TabNavigation';
import { getTabConfigs, createHierarchicalTabConfig } from '../configs/tabConfigs';

// ========================================
// サンプルサイドバーコンポーネント
// ========================================
export const SidebarTabDemo: React.FC = () => {
  // 状態管理
  const [activeLevel1, setActiveLevel1] = useState('project');
  const [activeLevel2, setActiveLevel2] = useState('計画');
  const [activeLevel3, setActiveLevel3] = useState('計画図');
  const [showLevel3, setShowLevel3] = useState(false);

  // レベル1変更ハンドラー
  const handleLevel1Change = (tabId: string) => {
    setActiveLevel1(tabId);
    // レベル1が変更されたら、レベル2をリセット
    const defaultLevel2 = tabId === 'project' ? '計画' : '純間接';
    setActiveLevel2(defaultLevel2);
    setActiveLevel3('');
    setShowLevel3(false);
  };

  // レベル2変更ハンドラー
  const handleLevel2Change = (tabId: string) => {
    setActiveLevel2(tabId);
    // レベル2が変更されたら、レベル3をリセット
    const detailTabs = getTabConfigs.getDetailTabs(tabId);
    setActiveLevel3(detailTabs.length > 0 ? detailTabs[0].id : '');
    setShowLevel3(detailTabs.length > 0);
  };

  // レベル3変更ハンドラー
  const handleLevel3Change = (tabId: string) => {
    setActiveLevel3(tabId);
  };

  // 階層設定の作成
  const hierarchicalConfig = createHierarchicalTabConfig(
    activeLevel1,
    activeLevel2,
    activeLevel3
  );

  return (
    <div className="sidebar-tab-demo p-4 bg-white border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">サイドバータブデモ</h2>
      
      {/* 階層タブナビゲーション */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">階層タブナビゲーション</h3>
        <HierarchicalTabNavigation
          config={hierarchicalConfig}
          activeLevel1Id={activeLevel1}
          activeLevel2Id={activeLevel2}
          activeLevel3Id={activeLevel3}
          onLevel1Change={handleLevel1Change}
          onLevel2Change={handleLevel2Change}
          onLevel3Change={handleLevel3Change}
          showLevel3={showLevel3}
          variant="underline"
          size="md"
          className="border rounded-lg p-4"
        />
      </div>

      {/* 個別タブナビゲーション */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">個別タブナビゲーション</h3>
        
        {/* メインタブ */}
        <div className="mb-4">
          <h4 className="text-xs text-gray-500 mb-1">メインタブ</h4>
          <TabNavigation
            tabs={getTabConfigs.getMainTabs()}
            activeTabId={activeLevel1}
            onTabChange={handleLevel1Change}
            variant="pills"
            size="sm"
            className="mb-2"
          />
        </div>

        {/* サブタブ */}
        <div className="mb-4">
          <h4 className="text-xs text-gray-500 mb-1">サブタブ</h4>
          <TabNavigation
            tabs={activeLevel1 === 'project' 
              ? getTabConfigs.getProjectSubTabs() 
              : getTabConfigs.getIndirectSubTabs()
            }
            activeTabId={activeLevel2}
            onTabChange={handleLevel2Change}
            variant="default"
            size="sm"
            className="mb-2"
          />
        </div>

        {/* 詳細タブ */}
        {showLevel3 && (
          <div className="mb-4">
            <h4 className="text-xs text-gray-500 mb-1">詳細タブ</h4>
            <TabNavigation
              tabs={getTabConfigs.getDetailTabs(activeLevel2)}
              activeTabId={activeLevel3}
              onTabChange={handleLevel3Change}
              variant="underline"
              size="sm"
              className="mb-2"
            />
          </div>
        )}
      </div>

      {/* 現在の選択状態表示 */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">現在の選択状態</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>レベル1: {activeLevel1}</div>
          <div>レベル2: {activeLevel2}</div>
          {showLevel3 && <div>レベル3: {activeLevel3}</div>}
        </div>
      </div>

      {/* 制御ボタン */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => setShowLevel3(!showLevel3)}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showLevel3 ? 'レベル3を隠す' : 'レベル3を表示'}
        </button>
        
        <button
          onClick={() => {
            setActiveLevel1('project');
            setActiveLevel2('計画');
            setActiveLevel3('計画図');
            setShowLevel3(true);
          }}
          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          リセット
        </button>
      </div>
    </div>
  );
};

// ========================================
// シンプルなタブナビゲーション（設定ベース）
// ========================================
export const SimpleTabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('計画');

  // 設定ベースのタブ
  const tabs = [
    { id: '計画', label: '計画', icon: '📊' },
    { id: '設計', label: '設計', icon: '✏️' },
    { id: '会議', label: '会議', icon: '🤝' },
    { id: '購入品', label: '購入品', icon: '🛒' },
    { id: 'その他', label: 'その他', icon: '📝' }
  ];

  return (
    <div className="simple-tab-navigation p-4 bg-white border rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-2">シンプルタブナビゲーション</h3>
      
      <TabNavigation
        tabs={tabs}
        activeTabId={activeTab}
        onTabChange={setActiveTab}
        variant="pills"
        size="md"
        className="mb-4"
      />
      
      <div className="text-xs text-gray-600">
        選択中: {activeTab}
      </div>
    </div>
  );
};
