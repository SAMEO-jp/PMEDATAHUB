"use client"

import React from 'react';
import { DragSourceMonitor } from 'react-dnd';
import { DisplayEvent } from '../../types/event';
import { useUIStore } from '../../store/uiStore';
import { DragData } from '../../types/droppable';
// 分割されたコンポーネントとフックをインポート
import EventDisplay from './EventDisplay';
import { useDragLogic } from '../../hooks/useDragLogic';
import { useContextMenu } from '../../hooks/useContextMenu';

// DragMoveEventコンポーネントのプロパティ型定義
interface DragMoveEventProps {
  event: DisplayEvent;                                      // 表示するイベントデータ
  onClick: (event: DisplayEvent) => void;                  // クリック時のハンドラ
  onCopy?: (event: DisplayEvent) => void;                  // コピー時のハンドラ（オプション）
  onDelete?: (event: DisplayEvent) => void;                // 削除時のハンドラ（オプション）
  onDragStart: (item: DragData) => void;                   // ドラッグ開始時のハンドラ
  onDragEnd: (item: DragData, monitor: DragSourceMonitor) => void; // ドラッグ終了時のハンドラ
  onPreDragSave?: (event: DisplayEvent) => void;          // ドラッグ前の状態保存ハンドラ（オプション）
}

/**
 * ドラッグ可能なイベントコンポーネント
 * 表示、ドラッグ処理、コンテキストメニューを統合するメインコンポーネント
 */
const DragMoveEvent: React.FC<DragMoveEventProps> = ({
  event,
  onClick,
  onCopy,
  onDelete,
  onDragStart,
  onDragEnd,
  onPreDragSave,
}) => {
  // グローバルなドラッグ状態を取得
  const globalIsDragging = useUIStore((state) => state.isDragging);
  
  // ドラッグ処理のロジックを取得
  const { isDragging: localIsDragging, dragRef } = useDragLogic({
    event,
    onDragStart,
    onDragEnd,
  });

  // コンテキストメニューのロジックを取得
  const { handleContextMenu } = useContextMenu({
    event,
    onCopy,
    onDelete,
  });

  /**
   * クリックイベントハンドラ
   * ドラッグ中はクリックを無効化する
   */
  const handleClick = (clickedEvent: DisplayEvent) => {
    // ドラッグ中はクリックを無効化
    if (globalIsDragging || localIsDragging) {
      return;
    }
    
    onClick(clickedEvent);
  };

  /**
   * マウスダウン時のハンドラ
   * ドラッグ前の状態保存を実行
   */
  const handleMouseDown = () => {
    if (onPreDragSave) {
      onPreDragSave(event);
    }
  };

  // ドラッグ状態を統合（グローバルまたはローカルのいずれかがドラッグ中）
  const isDragging = globalIsDragging || localIsDragging;

  return (
    <EventDisplay
      event={event}
      isDragging={isDragging}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      dragRef={dragRef}
    />
  );
};

export default DragMoveEvent;