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
    className={`sub-tab-button ${isSelected ? 'selected' : ''}`}
    onClick={onClick}
  >
    {tab}
  </button>
);
