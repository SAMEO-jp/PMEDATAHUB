"use client"

import { useState, useEffect, useRef } from 'react';
import { useZissekiStore } from '../../store/zissekiStore';

interface ContextMenuProps {
  children: React.ReactNode;
  year: number;
  week: number;
}

interface MenuItem {
  id: string;
  label: string;
  action: () => void;
  icon?: string;
}

export const ContextMenu = ({ children, year, week }: ContextMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { 
    resetData,
    loadFromLocalStorage
  } = useZissekiStore();

  // データリセット関数（localStorageもクリア）
  const resetDataHandler = () => {
    try {
      resetData();

    } catch (error) {
      console.error('データのリセットに失敗しました:', error);
    }
  };

  // localStorageから読み込み関数
  const loadFromStorage = () => {
    try {
      loadFromLocalStorage();

    } catch (error) {
      console.error('localStorageからの読み込みに失敗しました:', error);
    }
  };

  // メニューアイテムの定義
  const menuItems: MenuItem[] = [
    {
      id: 'load-from-storage',
      label: 'localStorage読み込み',
      action: loadFromStorage,
      icon: '📂'
    },
    {
      id: 'reset-data',
      label: 'データリセット',
      action: resetDataHandler,
      icon: '🔄'
    }
  ];

  // 右クリックハンドラー
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div 
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className="relative"
    >
      {children}
      
      {/* 右クリックメニュー */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-[200px]"
          style={{
            left: position.x,
            top: position.y,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.action();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 