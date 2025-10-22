'use client';

import { useCallback, useState } from 'react';
import { trpc } from '@src/lib/trpc/client';
import { Photo, PhotoFilters } from '@/types/photo';

export function usePhotos(projectId: string) {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [filters, setFilters] = useState<PhotoFilters>({});

  // 写真一覧取得
  const {
    data: photosData,
    isLoading,
    error,
    refetch,
  } = trpc.photos.getByProjectId.useQuery(
    {
      projectId,
      filters,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const photos = (photosData?.data || []) as Photo[];
  
  // デバッグ用ログ
  console.log('Photos data:', photosData);
  console.log('Photos array:', photos);
  console.log('Project ID:', projectId);

  // 写真検索
  const searchPhotos = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  // 写真フィルタ
  const filterPhotos = useCallback((newFilters: PhotoFilters) => {
    setFilters(newFilters);
  }, []);

  // 写真選択
  const togglePhotoSelection = useCallback((photoId: number, selected: boolean) => {
    setSelectedPhotos(prev => {
      if (selected) {
        return [...prev, photoId];
      } else {
        return prev.filter(id => id !== photoId);
      }
    });
  }, []);

  // 全選択
  const selectAllPhotos = useCallback(() => {
    setSelectedPhotos(photos.map((photo: Photo) => photo.photo_id));
  }, [photos]);

  // 選択解除
  const clearSelection = useCallback(() => {
    setSelectedPhotos([]);
  }, []);

  // 選択された写真を取得
  const selectedPhotoObjects = photos.filter((photo: Photo) => 
    selectedPhotos.includes(photo.photo_id)
  );

  return {
    photos,
    isLoading,
    error,
    refetch,
    searchPhotos,
    filterPhotos,
    selectedPhotos,
    selectedPhotoObjects,
    setSelectedPhotos,
    togglePhotoSelection,
    selectAllPhotos,
    clearSelection,
    filters,
    setFilters,
  };
} 