"use client"

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { FIFTEEN_MIN_HEIGHT } from '../utils/dateUtils';

interface Event {
  id: string;
  keyID: string;
  user_id: string;
  startDateTime: string;
  endDateTime: string;
  top: number;
  height: number;
  unsaved?: boolean;
  title: string;
  description?: string;
  activityCode?: string;
  classification5?: string;
  color: string;
}

interface DraggableEventProps {
  event: Event;
  onClick: (event: Event) => void;
  onResizeStart: (event: Event, direction: "top" | "bottom") => void;
  onCopy?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

export const DraggableEvent: React.FC<DraggableEventProps> = ({
  event,
  onClick,
  onResizeStart,
  onCopy,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: {
      event,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    top: `${event.top}px`,
    height: `${event.height}px`,
  };

  const handleResizeStart = (e: React.MouseEvent, direction: "top" | "bottom") => {
    e.stopPropagation();
    onResizeStart(event, direction);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onCopy && onDelete) {
      const menu = document.createElement('div');
      menu.className = 'fixed bg-white shadow-lg rounded-lg py-1 z-50';
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;

      const copyButton = document.createElement('button');
      copyButton.className = 'block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm';
      copyButton.textContent = 'コピー';
      copyButton.onclick = () => {
        onCopy(event);
        document.body.removeChild(menu);
      };

      const deleteButton = document.createElement('button');
      deleteButton.className = 'block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600';
      deleteButton.textContent = '削除';
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

  // ドラッグハンドルの高さを計算
  const handleHeight = Math.max(FIFTEEN_MIN_HEIGHT, Math.min(32, event.height / 3)); // 最小15分、最大30分または1/3の高さ

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`absolute overflow-hidden text-xs border ${
        event.unsaved ? "border-yellow-400" : "border-gray-300"
      } shadow-md rounded-md`}
      onClick={() => onClick(event)}
      onContextMenu={handleContextMenu}
      {...listeners}
      {...attributes}
    >
      {/* ドラッグハンドル - 上端から配置 */}
      <div
        className="cursor-move px-2 py-1 text-white font-medium border-b border-white/20"
        style={{
          height: `${handleHeight}px`,
        }}
        data-drag-handle="true"
      >
        <div className="font-bold truncate">{event.title}</div>
      </div>

      {/* イベント本文 - クリック可能だがドラッグ不可 */}
      <div className="py-1 px-2 overflow-hidden text-white">
        <div className="text-xs font-medium">
          {new Date(event.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{" "}
          {new Date(event.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        {event.description && <div className="text-xs text-white/80 truncate">{event.description}</div>}
      </div>

      {/* 業務コードを右下に表示 - 両方の値を確認 */}
      {(event.activityCode || event.classification5) && (
        <div className="absolute bottom-1 right-1 text-xs font-mono font-bold bg-white/20 px-1.5 py-0.5 rounded text-white">
          {event.activityCode || event.classification5}
        </div>
      )}

      {/* 下部リサイズハンドル - より大きく、目立つように */}
      <div
        className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-transparent hover:bg-white hover:bg-opacity-30 z-10"
        onMouseDown={(e) => handleResizeStart(e, "bottom")}
        onClick={(e) => e.stopPropagation()}
      />

      {/* 上部リサイズハンドルを追加 */}
      <div
        className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize bg-transparent hover:bg-white hover:bg-opacity-30 z-10"
        onMouseDown={(e) => handleResizeStart(e, "top")}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
