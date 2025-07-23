'use client';

import { useCallback, useState } from 'react';
import { trpc } from '@src/lib/trpc/client';
import { PhotoAlbum, AlbumFilters } from '@/src/types/photo';

export function useAlbums(projectId: string) {
  const [filters, setFilters] = useState<AlbumFilters>({});

  // アルバム一覧取得
  const {
    data: albumsData,
    isLoading,
    error,
    refetch,
  } = trpc.photos.getAlbums.useQuery(
    {
      projectId,
      filters,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const baseAlbums = (albumsData?.data || []) as PhotoAlbum[];
  
  // 「その他」アルバムを追加（実際のデータベースには存在しない）
  const otherAlbum: PhotoAlbum = {
    album_id: -1, // 仮のID
    fk_project_id: projectId,
    album_name: 'その他',
    album_description: 'アルバムに登録されていない写真',
    photo_count: 0, // 後で計算
    album_created_at: new Date().toISOString(),
    album_updated_at: new Date().toISOString(),
  };
  
  const albums = [...baseAlbums, otherAlbum];

  // デバッグ用ログ
  console.log('Albums data:', albumsData);
  console.log('Albums array:', albums);
  console.log('Project ID:', projectId);

  // アルバム検索
  const searchAlbums = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
  }, []);

  // アルバムフィルタ
  const filterAlbums = useCallback((newFilters: AlbumFilters) => {
    setFilters(newFilters);
  }, []);

  // アルバム作成
  const createAlbumMutation = trpc.photos.createAlbum.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  // アルバム更新
  const updateAlbumMutation = trpc.photos.updateAlbum.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  // アルバム削除
  const deleteAlbumMutation = trpc.photos.deleteAlbum.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  return {
    albums,
    isLoading,
    error,
    refetch,
    searchAlbums,
    filterAlbums,
    filters,
    setFilters,
    createAlbum: createAlbumMutation.mutate,
    updateAlbum: updateAlbumMutation.mutate,
    deleteAlbum: deleteAlbumMutation.mutate,
    isCreating: createAlbumMutation.isPending,
    isUpdating: updateAlbumMutation.isPending,
    isDeleting: deleteAlbumMutation.isPending,
  };
} 