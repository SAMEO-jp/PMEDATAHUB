"use client"

import React from 'react';
import { DisplayEvent } from '../../types/event';
import { RESIZE_HANDLE_HEIGHT } from '../../utils/resizeConstants';

interface DragResizeEventProps {
  event: DisplayEvent;
  onResizeStart: (event: DisplayEvent, direction: "top" | "bottom", mouseY: number) => void;
  onPreDragSave?: (event: DisplayEvent) => void;
}

const DragResizeEvent: React.FC<DragResizeEventProps> = ({
  event,
  onResizeStart,
  onPreDragSave,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${event.top}px`,
        left: '0',
        right: '0',
        height: `${event.height}px`,
        backgroundColor: event.color,
        borderRadius: '4px',
        padding: '4px',
        boxSizing: 'border-box',
        userSelect: 'none',
        width: '100%',
        minHeight: `${event.height}px`,
        pointerEvents: 'none', // 本体はクリック不可
      }}
    >
      {/* 上ハンドル */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${RESIZE_HANDLE_HEIGHT}px`,
          cursor: 'ns-resize',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          pointerEvents: 'auto', // ハンドルはクリック可能
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          // ドラッグ開始前に元の状態を保存
          if (onPreDragSave) {
            onPreDragSave(event);
          }
          onResizeStart(event, "top", e.clientY);
        }}
      />
      
      {/* 下ハンドル */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${RESIZE_HANDLE_HEIGHT}px`,
          cursor: 'ns-resize',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
          pointerEvents: 'auto', // ハンドルはクリック可能
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          // ドラッグ開始前に元の状態を保存
          if (onPreDragSave) {
            onPreDragSave(event);
          }
          onResizeStart(event, "bottom", e.clientY);
        }}
      />
    </div>
  );
};

export default DragResizeEvent; 