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
  <div className="sidebar-spacing-compact">
    <div className="field-label-compact">{title}</div>
    <div className="sub-tab-group">
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
