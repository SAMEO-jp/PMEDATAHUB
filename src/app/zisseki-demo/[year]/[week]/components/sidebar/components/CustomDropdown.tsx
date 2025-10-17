'use client';

import { useState, useRef, useEffect } from 'react';
import { OnLocalChange, OnCommit } from '../ui/types';

interface DropdownOption {
  value: string;
  label: string;
  subLabel?: string;
  description?: string;
}

interface CustomDropdownProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  options: DropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showSearch?: boolean;
  showDescription?: boolean;
}

export const CustomDropdown = ({
  value,
  onLocalChange,
  onCommit,
  options = [],
  placeholder = "選択してください",
  disabled = false,
  className = "",
  showSearch = true,
  showDescription = false
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 選択されたオプションを取得
  const selectedOption = options.find(option => option.value === value);

  // 検索フィルタリング（検索機能が有効な場合のみ）
  const filteredOptions = showSearch 
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.subLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // クリックアウトサイドで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionSelect = (option: DropdownOption) => {
    onLocalChange(option.value);
    onCommit?.(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* トリガーボタン */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full p-1 text-left border border-gray-300 rounded-md
          bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between min-w-0">
          <div className="flex-1 min-w-0 overflow-hidden">
            {selectedOption ? (
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {selectedOption.label}
                </div>
                {selectedOption.subLabel && (
                  <div className="text-xs text-gray-500 truncate">
                    {selectedOption.subLabel}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500 truncate block">{placeholder}</span>
            )}
          </div>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden min-w-0">
          {/* 検索ボックス（showSearchがtrueの場合のみ表示） */}
          {showSearch && (
            <div className="p-1 border-b border-gray-200">
              <input
                type="text"
                placeholder="検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}

          {/* オプションリスト */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={`
                    w-full px-2 py-1 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                    ${value === option.value ? 'bg-blue-50 text-blue-900' : 'text-gray-900'}
                    border-b border-gray-100 last:border-b-0 min-w-0
                  `}
                >
                  <div className="flex flex-col min-w-0">
                    <div className="text-sm font-medium truncate">
                      {option.label}
                    </div>
                    {option.subLabel && (
                      <div className="text-xs text-gray-500 truncate mt-0.5">
                        {option.subLabel}
                      </div>
                    )}
                    {showDescription && option.description && (
                      <div className="text-xs text-gray-400 truncate mt-0.5">
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-2 py-1 text-sm text-gray-500 text-center">
                該当する項目が見つかりません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
