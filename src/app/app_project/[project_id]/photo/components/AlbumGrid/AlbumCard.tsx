'use client';

import React from 'react';
import Image from 'next/image';
import { PhotoAlbum } from '@/src/types/photo';
import { Edit, Trash2, Folder, Image as ImageIcon } from 'lucide-react';

interface AlbumCardProps {
  album: PhotoAlbum;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AlbumCard({
  album,
  onClick,
  onEdit,
  onDelete,
}: AlbumCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* カバー画像またはプレースホルダー */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {album.cover_photo ? (
          <Image
            src={album.cover_photo.photo_file_path}
            alt={album.album_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Folder className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* アクションボタン */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={handleEdit}
              className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
              title="編集"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 bg-white rounded shadow-sm hover:bg-red-50"
              title="削除"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* アルバム情報 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate mb-1">
          {album.album_name}
        </h3>
        {album.album_description && (
          <p className="text-sm text-gray-600 truncate mb-2">
            {album.album_description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            <span>{album.photo_count || 0}枚</span>
          </div>
          <span>
            {new Date(album.album_created_at).toLocaleDateString('ja-JP')}
          </span>
        </div>
      </div>
    </div>
  );
} 