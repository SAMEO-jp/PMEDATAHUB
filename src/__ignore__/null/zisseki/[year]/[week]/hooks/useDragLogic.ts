"use client"

import { useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { DragSourceMonitor } from 'react-dnd';
import { DisplayEvent } from '../types/event';
import { DragData } from '../types/droppable';
import { DRAG_EVENT_TYPE } from '../utils/dragDropConstants';
import { useUIStore } from '../store/uiStore';
// 事前取得データ用の関数をインポート
import { getPreloadedEventData, setPreloadedEventData } from '../components/dragdrop/DragItemTracker';

// ドラッグロジックのフックパラメータ型定義
interface UseDragLogicParams {
  event: DisplayEvent;                                      // イベントデータ
  onDragStart: (item: DragData) => void;                   // ドラッグ開始時のハンドラ
  onDragEnd: (item: DragData, monitor: DragSourceMonitor) => void; // ドラッグ終了時のハンドラ
}

// ドラッグロジックのフック戻り値型定義
interface UseDragLogicReturn {
  isDragging: boolean;                                      // ドラッグ中かどうか
  dragRef: (node: HTMLDivElement | null) => void;          // ドラッグ要素のref
}

/**
 * ドラッグ処理のロジックを管理するカスタムフック
 * react-dndのuseDragフックをラップし、ビジネスロジックを分離
 */
export const useDragLogic = ({
  event,
  onDragStart,
  onDragEnd,
}: UseDragLogicParams): UseDragLogicReturn => {
  
  // react-dndのuseDragフックを使用してドラッグ機能を実装
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DRAG_EVENT_TYPE, // ドラッグアイテムのタイプを指定
    
    // ドラッグ開始時に呼ばれる関数
    item: () => {
      // 事前取得データがあれば優先使用（パフォーマンス最適化）
      const preloadedData = getPreloadedEventData();
      const useEvent = preloadedData || event; // 事前取得データを優先
      
      // デバッグ用ログ出力
      console.log('🎯 ドラッグアイテム作成:', {
        eventId: event.key_id,
        hasPreloadedData: !!preloadedData,
        '使用するevent高さ': useEvent.height,
        '元のevent高さ': event.height,
        dataSource: preloadedData ? '事前取得データ' : '渡されたデータ'
      });

      // 元の時間間隔を計算して適切な高さを決定
      const startTime = new Date(useEvent.startDateTime);
      const endTime = new Date(useEvent.endDateTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const originalHeight = (durationMs / (1000 * 60 * 60)) * 64; // 1時間 = 64px
      
      // ドラッグデータオブジェクトを作成
      const dragItem: DragData = {
        id: useEvent.key_id,
        event: useEvent,              // 最新データを使用
        draggableHeight: originalHeight, // 元の時間間隔に基づく高さ
        draggableTop: useEvent.top,   // 現在の表示位置
      };
      
      // グローバルストアにドラッグ中のイベントを設定
      useUIStore.getState().setDraggedEvent(useEvent);
      onDragStart(dragItem);
      return dragItem;
    },
    
    // ドラッグ状態を監視するためのcollect関数
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    
    // ドラッグ終了時の処理
    end: (item, monitor) => {
      // 事前取得データをクリアしてメモリリークを防ぐ
      console.log('🏁 useDragLogic: ドラッグ終了 - 事前取得データクリア');
      setPreloadedEventData(null);
      onDragEnd(item, monitor);
    },
  }));

  // refを正しく設定するためのコールバック
  // dragRefがコンポーネントの再レンダリング時に正しく動作するように最適化
  const dragRef = useCallback((node: HTMLDivElement | null) => {
    drag(node);
  }, [drag]);

  return {
    isDragging,
    dragRef,
  };
}; 