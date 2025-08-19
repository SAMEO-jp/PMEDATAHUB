import React from 'react';

interface SubTabButtonProps {
  tab: string;
  isSelected: boolean;
  onClick: () => void;
  color?: string;
}

/**
 * 汎用的なサブタブボタンコンポーネント
 */
export const SubTabButton = ({ 
  tab, 
  isSelected, 
  onClick, 
  color = 'blue' 
}: SubTabButtonProps) => (
  <button
    className={`px-2 py-1 rounded-lg text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
      isSelected 
        ? `bg-${color}-500 text-white shadow-md` 
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
    }`}
    onClick={onClick}
  >
    {tab}
  </button>
);
