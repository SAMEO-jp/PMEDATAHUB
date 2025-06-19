"use client"

import React from 'react';
import { useDrag } from 'react-dnd';
import { DisplayEvent } from '../types/event';
import { DragSourceMonitor } from 'react-dnd';

interface DragData {
  id: string;
  event: DisplayEvent;
}

interface DraggableEventProps {
  event: DisplayEvent;
  onClick: (event: DisplayEvent) => void;
  onResizeStart: (event: DisplayEvent, direction: "top" | "bottom", mouseY: number) => void;
  onCopy?: (event: DisplayEvent) => void;
  onDelete?: (event: DisplayEvent) => void;
  onDragStart: (item: DragData) => void;
  onDragEnd: (item: DragData, monitor: DragSourceMonitor) => void;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({
  event,
  onClick,
  onResizeStart,
  onCopy,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'EVENT',
    item: () => {
      const dragItem = {
        id: event.key_id,
        event: {
          ...event,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime,
          top: event.top,
          height: event.height,
        },
      };
      console.log('Drag Start Item:', dragItem);
      onDragStart(dragItem);
      return dragItem;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      onDragEnd(item, monitor);
    },
  }));

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCopy && onDelete) {
      const menu = document.createElement('div');
      menu.style.position = 'fixed';
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      menu.style.backgroundColor = 'white';
      menu.style.border = '1px solid #ccc';
      menu.style.borderRadius = '4px';
      menu.style.padding = '8px';
      menu.style.zIndex = '1000';
      menu.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

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

      menu.appendChild(copyButton);
      menu.appendChild(deleteButton);
      document.body.appendChild(menu);

      const closeMenu = () => {
        if (document.body.contains(menu)) {
          document.body.removeChild(menu);
        }
        document.removeEventListener('click', closeMenu);
      };

      document.addEventListener('click', closeMenu);
    }
  };

  const handleHeight = 8; // リサイズハンドルの高さ（px）

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
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(1.05)' : 'none',
        transition: 'opacity 0.2s, transform 0.2s',
        touchAction: 'none',
        width: '100%', // 幅を100%に固定
        minHeight: `${event.height}px`, // 最小高さを設定
      }}
    >
      {/* 上ハンドル */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${handleHeight}px`,
          cursor: 'ns-resize',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onResizeStart(event, "top", e.clientY);
        }}
      />
      {/* 本体（ドラッグ可能） */}
      <div
        ref={node => { if (node) drag(node); }}
        style={{ 
          cursor: 'move',
          height: '100%', // 高さを100%に設定
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        onClick={() => onClick(event)}
        onContextMenu={handleContextMenu}
      >
        <div 
          style={{ 
            fontSize: '12px', 
            color: '#fff',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.subject}
        </div>
        <div 
          style={{ 
            fontSize: '10px', 
            color: '#fff',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
          {new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {/* 下ハンドル（リサイズ専用、DnD無効） */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${handleHeight}px`,
          cursor: 'ns-resize',
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onResizeStart(event, "bottom", e.clientY);
        }}
      />
    </div>
  );
};

export default DraggableEvent;
