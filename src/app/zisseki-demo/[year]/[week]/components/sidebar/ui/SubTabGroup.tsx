import React from 'react';
import { SubTabButton } from './SubTabButton';

interface SubTabGroupProps {
  title: string;
  tabs: string[];
  selectedTab: string;
  onTabSelect: (tab: string) => void;
  color?: string;
}

/**
 * 汎用的なサブタブグループレンダリング
 */
export const SubTabGroup = ({
  title,
  tabs,
  selectedTab,
  onTabSelect,
  color = 'blue'
}: SubTabGroupProps) => (
  <div className="space-y-3">
    <div className="text-sm font-medium text-gray-700">{title}</div>
    <div className="flex gap-1 overflow-x-auto pb-2">
      {tabs.map((tab: string) => (
        <SubTabButton
          key={tab}
          tab={tab}
          isSelected={selectedTab === tab}
          onClick={() => onTabSelect(tab)}
          color={color}
        />
      ))}
    </div>
  </div>
);
