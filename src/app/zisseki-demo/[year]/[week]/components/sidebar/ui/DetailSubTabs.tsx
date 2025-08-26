import React from 'react';
import { SubTabGroup } from './SubTabGroup';
import { SubTabConfig } from './types';

interface DetailSubTabsProps {
  selectedTab: 'project' | 'indirect';
  currentMainSubTab: string;
  currentDetailSubTab: string;
  onTabSelect: (tab: string) => void;
  projectSubTabConfigs: Record<string, SubTabConfig>;
}

/**
 * 詳細サブタブをレンダリング
 */
export const DetailSubTabs = ({
  selectedTab,
  currentMainSubTab,
  currentDetailSubTab,
  onTabSelect,
  projectSubTabConfigs
}: DetailSubTabsProps) => {
  if (selectedTab !== 'project') return null;

  // 購入品タブの場合は詳細サブタブを非表示
  if (currentMainSubTab === '購入品') return null;

  const config = projectSubTabConfigs[currentMainSubTab];
  if (!config?.subTabs || config.subTabs.length === 0) return null;

  return (
    <div className="detail-sub-tabs">
      <SubTabGroup
        title={`${currentMainSubTab}分類`}
        tabs={config.subTabs}
        selectedTab={currentDetailSubTab}
        onTabSelect={onTabSelect}
        color="green"
      />
    </div>
  );
};
