'use client';

import React from 'react';
import { Folder, Image } from 'lucide-react';

interface AlbumCardProps {
  album: {
    album_id: number;
    album_name: string;
    album_description?: string;
    photo_count?: number;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function AlbumCard({
  album,
  isSelected,
  onClick,
}: AlbumCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-lg border cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'bg-blue-50 border-blue-300 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div className={`
          p-2 rounded-lg
          ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}
        `}>
          <Folder className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-medium truncate
            ${isSelected ? 'text-blue-900' : 'text-gray-900'}
          `}>
            {album.album_name}
          </h3>
          
          {album.album_description && (
            <p className="text-sm text-gray-500 truncate mt-1">
              {album.album_description}
            </p>
          )}
          
          <div className="flex items-center space-x-2 mt-2">
            <Image className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {album.photo_count || 0}枚
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 