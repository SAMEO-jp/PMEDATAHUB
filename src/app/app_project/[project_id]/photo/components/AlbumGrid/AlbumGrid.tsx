'use client';

import React from 'react';
import { PhotoAlbum } from '@/types/photo';
import AlbumCard from './AlbumCard';

interface AlbumGridProps {
  albums: PhotoAlbum[];
  onAlbumClick: (album: PhotoAlbum) => void;
  onAlbumEdit: (album: PhotoAlbum) => void;
  onAlbumDelete: (albumId: number) => void;
  loading?: boolean;
}

export default function AlbumGrid({
  albums,
  onAlbumClick,
  onAlbumEdit,
  onAlbumDelete,
  loading = false,
}: AlbumGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-200 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">アルバムがありません</h3>
          <p className="text-gray-600 mb-4">このプロジェクトにはまだアルバムが作成されていません。</p>
          <p className="text-sm text-gray-500">「アルバム作成」ボタンからアルバムを追加してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {albums.map((album) => (
        <AlbumCard
          key={album.album_id}
          album={album}
          onClick={() => onAlbumClick(album)}
          onEdit={() => onAlbumEdit(album)}
          onDelete={() => onAlbumDelete(album.album_id)}
        />
      ))}
    </div>
  );
} 