'use client';

import React from 'react';
import { Check, Image } from 'lucide-react';

interface PhotoCardProps {
  photo: {
    photo_id: number;
    photo_title: string;
    photo_file_path: string;
    photo_description?: string;
    photo_uploaded_at: string;
  };
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onClick: () => void;
}

export default function PhotoCard({
  photo,
  isSelected,
  onSelect,
  onClick,
}: PhotoCardProps) {
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(!isSelected);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative rounded-lg overflow-hidden cursor-pointer
        border-2 transition-all duration-200 group
        ${isSelected 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      {/* 選択チェックボックス */}
      <div
        onClick={handleSelect}
        className={`
          absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center
          transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/80 text-transparent hover:bg-white hover:text-gray-600'
          }
        `}
      >
        <Check className="w-4 h-4" />
      </div>

      {/* 写真画像 */}
      <div className="w-full bg-gray-100 flex items-center justify-center">
        <img
          src={photo.photo_file_path}
          alt={photo.photo_title}
          className="w-full h-auto object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.classList.remove('hidden');
          }}
        />
        {/* フォールバックアイコン */}
        <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
          <Image className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      {/* 写真情報オーバーレイ */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <h3 className="text-white text-sm font-medium truncate">
          {photo.photo_title}
        </h3>
        {photo.photo_description && (
          <p className="text-white/80 text-xs truncate mt-1">
            {photo.photo_description}
          </p>
        )}
        <p className="text-white/60 text-xs mt-1">
          {new Date(photo.photo_uploaded_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 