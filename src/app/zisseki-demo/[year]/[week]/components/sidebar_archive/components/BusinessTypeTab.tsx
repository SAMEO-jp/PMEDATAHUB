"use client"

import React from 'react';
import { Tab, TabProps } from '../../../../../../../components/ui/Tab';

// 業務タイプ専用のタブコンポーネント
export interface BusinessTypeTabProps extends Omit<TabProps, 'children'> {
  businessCode?: string;
  businessName: string;
  description?: string;
  isSelected?: boolean;
  onToggle?: () => void; // 選択/選択解除の切り替え
}

export const BusinessTypeTab: React.FC<BusinessTypeTabProps> = ({
  businessCode,
  businessName,
  description,
  isSelected = false,
  onToggle,
  className,
  ...props
}) => {
  return (
    <Tab
      variant="pills"
      size="sm"
      active={isSelected}
      className={`
        px-3 py-1.5 rounded-full text-xs
        ${isSelected 
          ? "bg-blue-100 text-blue-800 font-bold border-2 border-blue-300" 
          : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
        }
        ${className || ''}
      `}
      onClick={onToggle}
      title={description}
      {...props}
    >
      <span className="whitespace-nowrap">
        {businessName}
        {businessCode && (
          <span className="ml-1 text-xs opacity-70">({businessCode})</span>
        )}
      </span>
    </Tab>
  );
};

// 業務タイプ選択グループ
export interface BusinessTypeTabGroupProps {
  title: string;
  options: Array<{
    name: string;
    code: string;
    description?: string;
  }>;
  selectedValue?: string;
  onSelectionChange: (selected: { name: string; code: string } | null) => void;
  className?: string;
}

export const BusinessTypeTabGroup: React.FC<BusinessTypeTabGroupProps> = ({
  title,
  options,
  selectedValue,
  onSelectionChange,
  className
}) => {
  const handleToggle = (option: { name: string; code: string }) => {
    // 現在選択されている場合は選択解除、そうでなければ選択
    if (selectedValue === option.name) {
      onSelectionChange(null);
    } else {
      onSelectionChange(option);
    }
  };

  return (
    <div className={`border-b ${className || ''}`}>
      <div className="px-4 py-2">
        <label className="block text-xs font-medium text-gray-500 mb-1">
          {title}
        </label>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <BusinessTypeTab
              key={option.name}
              businessName={option.name}
              businessCode={option.code}
              description={option.description}
              isSelected={selectedValue === option.name}
              onToggle={() => handleToggle(option)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};