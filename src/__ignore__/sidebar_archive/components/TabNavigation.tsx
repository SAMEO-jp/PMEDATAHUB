"use client"

import React from 'react';
import { cn } from '../../../../../../../lib/utils';

// ========================================
// タブ設定の型定義
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
// タブナビゲーションコンポーネント
// ========================================
export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  disabled = false
}) => {
  // サイズクラス
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  // バリアントクラス
  const variantClasses = {
    default: {
      tab: 'border-b-2 border-transparent hover:border-gray-300 transition-colors',
      active: 'border-blue-500 text-blue-600 font-medium',
      inactive: 'text-gray-600 hover:text-gray-900'
    },
    pills: {
      tab: 'rounded-md border border-gray-200 hover:bg-gray-50 transition-colors',
      active: 'bg-blue-500 text-white border-blue-500',
      inactive: 'text-gray-700 hover:bg-gray-100'
    },
    underline: {
      tab: 'border-b-2 border-transparent hover:border-gray-300 transition-colors',
      active: 'border-blue-500 text-blue-600',
      inactive: 'text-gray-600 hover:text-gray-900'
    }
  };

  // 方向クラス
  const orientationClasses = {
    horizontal: 'flex space-x-1',
    vertical: 'flex flex-col space-y-1'
  };

  const currentVariant = variantClasses[variant];
  const currentSize = sizeClasses[size];
  const currentOrientation = orientationClasses[orientation];

  return (
    <div className={cn(
      'tab-navigation',
      currentOrientation,
      className
    )}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const isDisabled = disabled || tab.disabled;

        return (
          <button
            key={tab.id}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            disabled={isDisabled}
            className={cn(
              'tab-item',
              'flex items-center gap-2',
              'font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              currentSize,
              currentVariant.tab,
              isActive ? currentVariant.active : currentVariant.inactive,
              isDisabled && 'opacity-50 cursor-not-allowed',
              !isDisabled && 'cursor-pointer'
            )}
          >
            {/* アイコン */}
            {tab.icon && (
              <span className="tab-icon">
                {tab.icon}
              </span>
            )}

            {/* ラベル */}
            <span className="tab-label">
              {tab.label}
            </span>

            {/* バッジ */}
            {tab.badge && (
              <span className={cn(
                'tab-badge',
                'inline-flex items-center justify-center',
                'px-2 py-0.5 text-xs font-medium',
                'rounded-full',
                isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// ========================================
// 階層タブナビゲーション（レベル2、レベル3用）
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

export const HierarchicalTabNavigation: React.FC<HierarchicalTabNavigationProps> = ({
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
    <div className={cn('hierarchical-tab-navigation', 'space-y-4', className)}>
      {/* レベル1 */}
      <TabNavigation
        tabs={level1Tabs}
        activeTabId={activeLevel1Id}
        onTabChange={onLevel1Change}
        variant={variant}
        size={size}
        className="border-b border-gray-200 pb-2"
      />

      {/* レベル2 */}
      {config.level2 && level2Tabs.length > 0 && (
        <TabNavigation
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
        <TabNavigation
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
