'use client';

import React from 'react';
import { PhotoAlbum } from '@src/types/photo';
import AlbumCard from './AlbumCard';

interface AlbumListProps {
  albums: PhotoAlbum[];
  selectedAlbumId: number | null;
  onAlbumSelect: (albumId: number) => void;
  isLoading?: boolean;
}

export default function AlbumList({
  albums,
  selectedAlbumId,
  onAlbumSelect,
  isLoading = false,
}: AlbumListProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">アルバムを読み込み中...</div>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">アルバムがありません</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-3">
        {albums.map((album) => (
          <AlbumCard
            key={album.album_id}
            album={album}
            isSelected={selectedAlbumId === album.album_id}
            onClick={() => onAlbumSelect(album.album_id)}
          />
        ))}
      </div>
    </div>
  );
} 