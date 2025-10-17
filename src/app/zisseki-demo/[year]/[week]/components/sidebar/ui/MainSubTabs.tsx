import React, { useMemo } from 'react';
import { SubTabGroup } from './SubTabGroup';
import { SubTabConfig } from './types';
import { getSubTabs } from '../utils/businessCodeUtils';

interface MainSubTabsProps {
  selectedTab: 'project' | 'indirect';
  currentMainSubTab: string;
  onTabSelect: (tab: string) => void;
  projectSubTabConfigs: Record<string, SubTabConfig>;
  indirectSubTabConfigs: Record<string, SubTabConfig>;
}

/**
 * メインサブタブをレンダリング（動的生成版）
 * 新しいbusinessCodeUtilsを使用してJSONベースの動的処理に変更
 */
export const MainSubTabs = ({
  selectedTab,
  currentMainSubTab,
  onTabSelect,
  projectSubTabConfigs,
  indirectSubTabConfigs
}: MainSubTabsProps) => {
  // 動的にタブを生成
  const tabs = useMemo(() => {
    return getSubTabs(selectedTab);
  }, [selectedTab]);

  const selectedTabValue = currentMainSubTab;

  return (
    <div className="main-sub-tabs">
      <SubTabGroup
        title={selectedTab === 'project' ? 'プロジェクト分類' : '間接業務分類'}
        tabs={tabs}
        selectedTab={selectedTabValue}
        onTabSelect={onTabSelect}
      />
    </div>
  );
};
