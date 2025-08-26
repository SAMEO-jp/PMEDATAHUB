import React from 'react';
import { SubTabGroup } from './SubTabGroup';
import { SubTabConfig } from './types';

interface MainSubTabsProps {
  selectedTab: 'project' | 'indirect';
  currentMainSubTab: string;
  onTabSelect: (tab: string) => void;
  projectSubTabConfigs: Record<string, SubTabConfig>;
  indirectSubTabConfigs: Record<string, SubTabConfig>;
}

/**
 * メインサブタブをレンダリング
 */
export const MainSubTabs = ({
  selectedTab,
  currentMainSubTab,
  onTabSelect,
  projectSubTabConfigs,
  indirectSubTabConfigs
}: MainSubTabsProps) => {
  const configs = selectedTab === 'project' ? projectSubTabConfigs : indirectSubTabConfigs;
  const tabs = Object.keys(configs);
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
