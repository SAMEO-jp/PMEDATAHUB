"use client"

import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { OnclickMakeEventProps } from '../../types/droppable';

export const OnclickMakeEvent: React.FC<OnclickMakeEventProps> = ({
  day,
  hour,
  minute = 0,
  onClick,
  children
}) => {
  const isDragging = useUIStore((state) => state.isDragging);

  // クリックハンドラ
  const handleClick = (e: React.MouseEvent) => {
    // ドラッグ中はクリックを無効化
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    
    // ドラッグ中でない場合のみクリックイベントを実行
    onClick(day, hour, minute);
  };

  return (
    <div
      className={`relative ${isDragging ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={handleClick}
      style={{
        opacity: isDragging ? 0.7 : 1, // ドラッグ中は少し透明にする
      }}
    >
      {children}
    </div>
  );
}; 