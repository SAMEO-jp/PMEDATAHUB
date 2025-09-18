"use client"

import React, { useState } from 'react';

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
  label?: string;
}

// プリセットカラーの定義
const PRESET_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#EC4899', // pink-500
  '#6B7280', // gray-500
  '#059669', // emerald-600
  '#DC2626', // red-600
  '#7C3AED', // violet-600
  '#0891B2', // cyan-600
  '#65A30D', // lime-600
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  onColorChange,
  label = "イベントの色"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(currentColor);

  // 外部クリックでポップアップを閉じる
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.color-picker-container')) {
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

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    onColorChange(color);
  };

  return (
    <div className="sidebar-field color-picker-container">
      <label className="sidebar-label">{label}</label>
      <div className="relative">
        {/* カラー表示ボタン */}
        <button
          type="button"
          className="flex items-center gap-1 w-full p-1 border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-6 h-6 rounded border border-gray-300"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-xs text-gray-700 flex-1 text-left">
            {currentColor.toUpperCase()}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* カラーピッカーポップアップ */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 p-2 min-w-[280px]">
            {/* プリセットカラー */}
            <div className="mb-2">
              <div className="text-xs font-medium text-gray-700 mb-1">プリセットカラー</div>
              <div className="grid grid-cols-5 gap-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${
                      currentColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* カスタムカラー */}
            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">カスタムカラー</div>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setCustomColor(color);
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                      onColorChange(color);
                    }
                  }}
                  placeholder="#000000"
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
