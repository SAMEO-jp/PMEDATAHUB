"use client"

import React from 'react';
import { Tab } from '../../../../../../../components/ui/Tab';
import { TabGroup } from '../../../../../../../components/ui/TabGroup';

// ========================================
// タブ設定の型定義（従来と互換性維持）
// ========================================
export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabNavigationProps {
  // タブ設定
  tabs: TabConfig[];
  
  // 現在選択されているタブ
  activeTabId: string;
  
  // タブ変更時のコールバック
  onTabChange: (tabId: string) => void;
  
  // スタイリング
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  
  // レイアウト
  orientation?: 'horizontal' | 'vertical';
  
  // その他のプロパティ
  className?: string;
  disabled?: boolean;
}

// ========================================
// リファクタリング後のタブナビゲーション
// ========================================
export const TabNavigationRefactored: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  disabled = false
}) => {
  return (
    <TabGroup
      className={className}
      orientation={orientation}
      variant={variant}
      size={size}
      value={activeTabId}
      onValueChange={onTabChange}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          value={tab.id}
          icon={tab.icon}
          badge={tab.badge}
          disabled={disabled || tab.disabled}
        >
          {tab.label}
        </Tab>
      ))}
    </TabGroup>
  );
};

// ========================================
// 階層タブナビゲーション（従来と互換性維持）
// ========================================
export interface HierarchicalTabConfig {
  level1: {
    id: string;
    label: string;
    icon?: React.ReactNode;
  };
  level2?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    tabs: TabConfig[];
  };
  level3?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    tabs: TabConfig[];
  };
}

export interface HierarchicalTabNavigationProps {
  // 階層設定
  config: HierarchicalTabConfig;
  
  // 現在の選択状態
  activeLevel1Id: string;
  activeLevel2Id?: string;
  activeLevel3Id?: string;
  
  // 変更コールバック
  onLevel1Change: (id: string) => void;
  onLevel2Change?: (id: string) => void;
  onLevel3Change?: (id: string) => void;
  
  // スタイリング
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  
  // レイアウト
  className?: string;
  showLevel3?: boolean;
}

export const HierarchicalTabNavigationRefactored: React.FC<HierarchicalTabNavigationProps> = ({
  config,
  activeLevel1Id,
  activeLevel2Id,
  activeLevel3Id,
  onLevel1Change,
  onLevel2Change,
  onLevel3Change,
  variant = 'default',
  size = 'md',
  className,
  showLevel3 = false
}) => {
  // レベル1のタブ設定
  const level1Tabs: TabConfig[] = [{
    id: config.level1.id,
    label: config.level1.label,
    icon: config.level1.icon
  }];

  // レベル2のタブ設定
  const level2Tabs: TabConfig[] = config.level2?.tabs || [];

  // レベル3のタブ設定
  const level3Tabs: TabConfig[] = config.level3?.tabs || [];

  return (
    <div className={`hierarchical-tab-navigation space-y-4 ${className || ''}`}>
      {/* レベル1 */}
      <TabNavigationRefactored
        tabs={level1Tabs}
        activeTabId={activeLevel1Id}
        onTabChange={onLevel1Change}
        variant={variant}
        size={size}
        className="border-b border-gray-200 pb-2"
      />

      {/* レベル2 */}
      {config.level2 && level2Tabs.length > 0 && (
        <TabNavigationRefactored
          tabs={level2Tabs}
          activeTabId={activeLevel2Id || ''}
          onTabChange={onLevel2Change || (() => {})}
          variant={variant}
          size={size}
          className="border-b border-gray-200 pb-2"
        />
      )}

      {/* レベル3 */}
      {showLevel3 && config.level3 && level3Tabs.length > 0 && (
        <TabNavigationRefactored
          tabs={level3Tabs}
          activeTabId={activeLevel3Id || ''}
          onTabChange={onLevel3Change || (() => {})}
          variant={variant}
          size={size}
          className="border-b border-gray-200 pb-2"
        />
      )}
    </div>
  );
};