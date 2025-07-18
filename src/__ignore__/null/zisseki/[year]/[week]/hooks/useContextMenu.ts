"use client"

import { useCallback } from 'react';
import { DisplayEvent } from '../../types/event';

// コンテキストメニューのフックパラメータ型定義
interface UseContextMenuParams {
  event: DisplayEvent;                                      // イベントデータ
  onCopy?: (event: DisplayEvent) => void;                  // コピー時のハンドラ（オプション）
  onDelete?: (event: DisplayEvent) => void;                // 削除時のハンドラ（オプション）
}

/**
 * コンテキストメニューのロジックを管理するカスタムフック
 * 右クリック時のメニュー表示と操作を担当
 */
export const useContextMenu = ({
  event,
  onCopy,
  onDelete,
}: UseContextMenuParams) => {
  
  /**
   * 右クリックコンテキストメニューハンドラ
   * コピーと削除のオプションを提供
   */
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // コピー・削除ハンドラが両方とも提供されている場合のみメニューを表示
    if (onCopy && onDelete) {
      // 動的にコンテキストメニューを作成
      const menu = document.createElement('div');
      // メニューのスタイル設定
      menu.style.position = 'fixed';
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      menu.style.backgroundColor = 'white';
      menu.style.border = '1px solid #ccc';
      menu.style.borderRadius = '4px';
      menu.style.padding = '8px';
      menu.style.zIndex = '1000';
      menu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

      // コピーボタンの作成
      const copyButton = document.createElement('button');
      copyButton.textContent = 'コピー';
      copyButton.style.display = 'block';
      copyButton.style.width = '100%';
      copyButton.style.padding = '4px 8px';
      copyButton.style.marginBottom = '4px';
      copyButton.style.border = 'none';
      copyButton.style.backgroundColor = '#f0f0f0';
      copyButton.style.cursor = 'pointer';
      copyButton.onclick = () => {
        onCopy(event);
        document.body.removeChild(menu);
      };

      // 削除ボタンの作成
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '削除';
      deleteButton.style.display = 'block';
      deleteButton.style.width = '100%';
      deleteButton.style.padding = '4px 8px';
      deleteButton.style.border = 'none';
      deleteButton.style.backgroundColor = '#ffebee';
      deleteButton.style.cursor = 'pointer';
      deleteButton.onclick = () => {
        onDelete(event);
        document.body.removeChild(menu);
      };

      // メニューにボタンを追加
      menu.appendChild(copyButton);
      menu.appendChild(deleteButton);
      document.body.appendChild(menu);

      // メニュー外クリック時の閉じる処理
      const closeMenu = () => {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
        document.removeEventListener('click', closeMenu);
      };

      document.addEventListener('click', closeMenu);
    }
  }, [event, onCopy, onDelete]);

  return {
    handleContextMenu,
  };
}; 