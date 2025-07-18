"use client"

import React from 'react';
import { DisplayEvent } from '../../types/event';
import { DRAG_OPACITY, DRAG_SCALE, DRAG_TRANSITION_DURATION } from '../../utils/dragDropConstants';

// EventDisplayコンポーネントのプロパティ型定義
interface EventDisplayProps {
  event: DisplayEvent;                                      // 表示するイベントデータ
  isDragging: boolean;                                      // ドラッグ中かどうか
  onClick?: (event: DisplayEvent) => void;                  // クリック時のハンドラ（オプション）
  onContextMenu?: (event: React.MouseEvent) => void;       // 右クリック時のハンドラ（オプション）
  onMouseDown?: () => void;                                 // マウスダウン時のハンドラ（オプション）
  dragRef?: (node: HTMLDivElement | null) => void;         // ドラッグ要素のref（オプション）
}

/**
 * イベントの表示のみを担当する純粋な表示コンポーネント
 * ドラッグ処理やビジネスロジックは含まない
 */
const EventDisplay: React.FC<EventDisplayProps> = ({
  event,
  isDragging,
  onClick,
  onContextMenu,
  onMouseDown,
  dragRef,
}) => {
  return (
    // イベントコンテナ（絶対位置で配置）
    <div
      style={{
        position: 'absolute',
        top: `${event.top}px`,        // 縦位置
        left: '0',
        right: '0',
        height: `${event.height}px`,  // 高さ
        width: '100%',
        minHeight: `${event.height}px`,
      }}
    >
      {/* レイヤー1: 背景色オブジェクト */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: event.color, // イベントの色
          borderRadius: '4px',
          opacity: isDragging ? DRAG_OPACITY : 1,
          transform: isDragging ? `scale(${DRAG_SCALE})` : 'none',
          transition: `opacity ${DRAG_TRANSITION_DURATION}, transform ${DRAG_TRANSITION_DURATION}`,
        }}
      />

      {/* レイヤー2: 文字表示レイヤー */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: '4px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          pointerEvents: 'none', // クリックイベントを透過
          zIndex: 2,
        }}
      >
        {/* イベントタイトル */}
        <div 
          style={{ 
            fontSize: '12px', 
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',       
            overflow: 'hidden',         
            textOverflow: 'ellipsis',   
            padding: '2px 4px',         
            borderRadius: '2px',        
            marginBottom: '2px',
          }}
        >
          {event.subject || ''}
        </div>
        
        {/* イベント時間表示 */}
        <div 
          style={{ 
            fontSize: '10px', 
            color: '#ffffff',
            backgroundColor: 'rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '1px 4px',
            borderRadius: '2px',
          }}
        >
          {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* レイヤー3: 透明な操作レイヤー（クリック・コンテキストメニュー・ドラッグ用） */}
      <div
        ref={dragRef}
        data-item-id={event.key_id}
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          cursor: dragRef ? 'move' : 'pointer',
          backgroundColor: 'transparent', // 完全に透明
          userSelect: 'none',
          touchAction: 'none',
          zIndex: 3, // 最前面
        }}
        onClick={() => onClick?.(event)}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
      />
    </div>
  );
};

export default EventDisplay; 