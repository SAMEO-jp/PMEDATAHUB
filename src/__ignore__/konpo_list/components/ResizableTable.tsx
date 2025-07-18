import React, { useState, useRef, useEffect } from 'react';
import { ColumnWidths } from '../columnWidths';

interface ResizableTableProps {
  columnWidths: ColumnWidths;
  onColumnWidthChange: (newWidths: ColumnWidths) => void;
  children: React.ReactNode;
}

export const ResizableTable: React.FC<ResizableTableProps> = ({
  columnWidths,
  onColumnWidthChange,
  children,
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [currentColumn, setCurrentColumn] = useState<keyof ColumnWidths | null>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  const handleMouseDown = (e: React.MouseEvent, column: keyof ColumnWidths) => {
    setIsResizing(true);
    setCurrentColumn(column);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !currentColumn || !tableRef.current) return;

    const tableRect = tableRef.current.getBoundingClientRect();
    const newWidth = e.clientX - tableRect.left;

    if (newWidth > 50) { // 最小幅を50pxに設定
      onColumnWidthChange({
        ...columnWidths,
        [currentColumn]: newWidth,
      });
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setCurrentColumn(null);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, currentColumn]);

  return (
    <div className="relative">
      <table ref={tableRef} className="w-full">
        {children}
      </table>
      {isResizing && (
        <div
          className="fixed top-0 left-0 w-full h-full cursor-col-resize"
          style={{ zIndex: 1000 }}
        />
      )}
    </div>
  );
}; 