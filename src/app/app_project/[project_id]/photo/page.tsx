'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PhotoGrid from './components/PhotoGrid/PhotoGrid';
import AlbumList from './components/AlbumList/AlbumList';
import { usePhotos } from './hooks/usePhotos';
import { useAlbums } from './hooks/useAlbums';
import { Upload, FolderPlus } from 'lucide-react';
import PhotoUploadModal from './components/PhotoUpload/PhotoUploadModal';
import { trpc } from '@src/lib/trpc/client';
import { Photo } from '@/src/types/photo';

export default function PhotoPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.project_id as string;
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);

  const {
    albums,
    isLoading: albumsLoading,
    error: albumsError,
    refetch: refetchAlbums,
    deleteAlbum,
  } = useAlbums(projectId);

  // デバッグ用ログ
  console.log('Current project ID:', projectId);
  console.log('Albums for project:', albums);

  const {
    photos,
    isLoading: photosLoading,
    error: photosError,
    selectedPhotos,
    togglePhotoSelection,
    selectAllPhotos,
    clearSelection,
    refetch: refetchPhotos,
  } = usePhotos(projectId);

  // 選択されたアルバムの写真を取得
  const {
    data: albumPhotosData,
    isLoading: albumPhotosLoading,
    error: albumPhotosError,
  } = trpc.photos.getPhotosByAlbum.useQuery(
    {
      albumId: selectedAlbum!,
    },
    {
      enabled: !!selectedAlbum && selectedAlbum !== -1 && selectedAlbum !== null,
      refetchOnWindowFocus: false,
    }
  );

  // 「その他」アルバムが選択されている場合は、アルバム未登録の写真を取得
  const {
    data: unassignedPhotosData,
    isLoading: unassignedPhotosLoading,
    error: unassignedPhotosError,
  } = trpc.photos.getUnassignedPhotos.useQuery(
    {
      projectId,
    },
    {
      enabled: selectedAlbum === -1,
      refetchOnWindowFocus: false,
    }
  );

  const albumPhotos = selectedAlbum === -1 
    ? (unassignedPhotosData?.data || []) as Photo[]
    : (albumPhotosData?.data || []) as Photo[];

  const handlePhotoClick = (photo: any) => {
    console.log('Photo clicked:', photo);
    // 写真詳細ページにナビゲート
    router.push(`/app_project/${projectId}/photo/${photo.photo_id}`);
  };

  const handlePhotoSelect = (photoId: number, selected: boolean) => {
    togglePhotoSelection(photoId, selected);
  };

  if (albumsError || photosError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600">
            データの取得に失敗しました。ページを再読み込みしてください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              写真管理
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAlbumModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                アルバム作成
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                写真アップロード
              </button>
              {selectedPhotos.length > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedPhotos.length}件選択中
                  </span>
                  <button
                    onClick={selectAllPhotos}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    全選択
                  </button>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    選択解除
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
          {/* アルバム一覧 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">アルバム</h2>
              </div>
              <div className="flex-1">
                <AlbumList
                  albums={albums}
                  selectedAlbumId={selectedAlbum}
                  onAlbumSelect={(albumId) => setSelectedAlbum(albumId)}
                  isLoading={albumsLoading}
                />
              </div>
            </div>
          </div>

          {/* 写真一覧 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedAlbum ? '写真一覧' : 'アルバムを選択してください'}
                </h2>
              </div>
              <div className="flex-1">
                <PhotoGrid
                  photos={albumPhotos}
                  selectedPhotos={selectedPhotos}
                  onPhotoSelect={handlePhotoSelect}
                  onPhotoClick={handlePhotoClick}
                  isLoading={albumPhotosLoading || unassignedPhotosLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* アップロードモーダル */}
      <PhotoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        projectId={projectId}
        onUploadComplete={() => {
          // アップロード完了後に写真一覧を再取得
          void refetchPhotos();
        }}
      />
    </div>
  );
} 