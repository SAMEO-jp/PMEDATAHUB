import React, { useMemo } from 'react';
import { SubTabGroup } from './SubTabGroup';
import { SubTabConfig } from './types';
import { getDetailTabs } from '../utils/businessCodeUtils';

interface DetailSubTabsProps {
  selectedTab: 'project' | 'indirect';
  currentMainSubTab: string;
  currentDetailSubTab: string;
  onTabSelect: (tab: string) => void;
  projectSubTabConfigs: Record<string, SubTabConfig>;
  indirectSubTabConfigs: Record<string, SubTabConfig>;
}

/**
 * 詳細サブタブをレンダリング（動的生成版）
 * 新しいbusinessCodeUtilsを使用してJSONベースの動的処理に変更
 */
export const DetailSubTabs = ({
  selectedTab,
  currentMainSubTab,
  currentDetailSubTab,
  onTabSelect,
  projectSubTabConfigs
}: DetailSubTabsProps) => {

  // 動的に詳細タブを生成
  const detailTabs = useMemo(() => {
    return getDetailTabs(selectedTab, currentMainSubTab);
  }, [selectedTab, currentMainSubTab]);

  if (!detailTabs || detailTabs.length === 0) return null;

  return (
    <div className="detail-sub-tabs">
      <SubTabGroup
        title={`${currentMainSubTab}分類`}
        tabs={detailTabs}
        selectedTab={currentDetailSubTab}
        onTabSelect={onTabSelect}
        color="green"
      />
    </div>
  );
};
