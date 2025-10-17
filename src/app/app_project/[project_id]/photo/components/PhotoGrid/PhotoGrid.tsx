'use client';

import React from 'react';
import { Photo } from '@src/types/photo';
import PhotoCard from './PhotoCard';

interface PhotoGridProps {
  photos: Photo[];
  selectedPhotos: number[];
  onPhotoSelect: (photoId: number, selected: boolean) => void;
  onPhotoClick: (photo: Photo) => void;
  isLoading?: boolean;
}

export default function PhotoGrid({
  photos,
  selectedPhotos,
  onPhotoSelect,
  onPhotoClick,
  isLoading = false,
}: PhotoGridProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">写真を読み込み中...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">写真がありません</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {photos.map((photo) => (
            <PhotoCard
              key={photo.photo_id}
              photo={photo}
              isSelected={selectedPhotos.includes(photo.photo_id)}
              onSelect={(selected) => onPhotoSelect(photo.photo_id, selected)}
              onClick={() => onPhotoClick(photo)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 