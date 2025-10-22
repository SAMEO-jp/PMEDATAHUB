'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Edit, Save, X } from 'lucide-react';
import { trpc } from '@src/lib/trpc/client';
import PhotoTags from '../components/PhotoTags/PhotoTags';

export default function PhotoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.project_id as string;
  const photoId = parseInt(params.photo_id as string);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    photo_title: '',
    photo_description: '',
    photo_location: '',
    photo_category: 'others' as const,
  });

  // 写真詳細取得
  const {
    data: photoData,
    isLoading: photoLoading,
    error: photoError,
    refetch: refetchPhoto,
  } = trpc.photos.getById.useQuery(
    { photoId },
    {
      enabled: !!photoId,
      refetchOnWindowFocus: false,
    }
  );

  // 写真更新ミューテーション
  const updatePhotoMutation = trpc.photos.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      // 写真データを再取得
      void refetchPhoto();
    },
  });

  // 写真削除ミューテーション
  const deletePhotoMutation = trpc.photos.delete.useMutation({
    onSuccess: () => {
      router.push(`/app_project/${projectId}/photo`);
    },
  });

  const photo = photoData?.data as any;

  // 編集モード開始
  const handleEdit = () => {
    if (photo) {
      setEditData({
        photo_title: photo.photo_title || '',
        photo_description: photo.photo_description || '',
        photo_location: photo.photo_location || '',
        photo_category: photo.photo_category || 'others',
      });
      setIsEditing(true);
    }
  };

  // 保存処理
  const handleSave = () => {
    if (photo) {
      updatePhotoMutation.mutate({
        photoId: photo.photo_id,
        updates: editData,
      });
    }
  };

  // 削除処理
  const handleDelete = () => {
    if (photo && confirm('この写真を削除しますか？')) {
      deletePhotoMutation.mutate({ photoId: photo.photo_id });
    }
  };

  // ダウンロード処理
  const handleDownload = () => {
    if (photo) {
      const link = document.createElement('a');
      link.href = photo.photo_file_path;
      link.download = photo.photo_title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (photoLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">写真を読み込み中...</div>
      </div>
    );
  }

  if (photoError || !photo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            写真が見つかりません
          </h2>
          <p className="text-gray-600 mb-4">
            指定された写真が存在しないか、削除されています。
          </p>
          <button
            onClick={() => router.push(`/app_project/${projectId}/photo`)}
            className="text-blue-600 hover:text-blue-800"
          >
            写真一覧に戻る
          </button>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/app_project/${projectId}/photo`)}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                写真詳細
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                ダウンロード
              </button>
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                編集
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                削除
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 写真表示 */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border p-6">
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={photo.photo_file_path}
                alt={photo.photo_title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </div>

          {/* 写真情報 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              写真情報
            </h2>

            {/* タグ機能 */}
            <div className="mb-4">
              <PhotoTags
                photoId={photo.photo_id}
                currentTags={photo.photo_tags ? JSON.parse(photo.photo_tags) : []}
                availableTags={['パレット', '工事', '品質', '安全', '重要', '緊急']}
                onTagsUpdate={(tags) => {
                  // タグ更新処理
                  updatePhotoMutation.mutate({
                    photoId: photo.photo_id,
                    updates: {
                      photo_tags: JSON.stringify(tags),
                    },
                  });
                }}
              />
            </div>

            {isEditing ? (
              // 編集モード
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    value={editData.photo_title}
                    onChange={(e) => setEditData(prev => ({ ...prev, photo_title: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={editData.photo_description}
                    onChange={(e) => setEditData(prev => ({ ...prev, photo_description: e.target.value }))}
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    撮影場所
                  </label>
                  <input
                    type="text"
                    value={editData.photo_location}
                    onChange={(e) => setEditData(prev => ({ ...prev, photo_location: e.target.value }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    カテゴリ
                  </label>
                  <select
                    value={editData.photo_category}
                    onChange={(e) => setEditData(prev => ({ ...prev, photo_category: e.target.value as any }))}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="palet">パレット</option>
                    <option value="construction">工事</option>
                    <option value="quality">品質</option>
                    <option value="safety">安全</option>
                    <option value="others">その他</option>
                  </select>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={updatePhotoMutation.isPending}
                    className="flex-1 inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Save className="w-3 h-3 mr-1" />
                    {updatePhotoMutation.isPending ? '保存中...' : '保存'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                  >
                    <X className="w-3 h-3 mr-1" />
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              // 表示モード
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <p className="text-sm text-gray-900">{photo.photo_title}</p>
                </div>

                {photo.photo_description && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      説明
                    </label>
                    <p className="text-sm text-gray-900">{photo.photo_description}</p>
                  </div>
                )}

                {photo.photo_location && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      撮影場所
                    </label>
                    <p className="text-sm text-gray-900">{photo.photo_location}</p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    カテゴリ
                  </label>
                  <p className="text-sm text-gray-900">
                    {photo.photo_category === 'palet' && 'パレット'}
                    {photo.photo_category === 'construction' && '工事'}
                    {photo.photo_category === 'quality' && '品質'}
                    {photo.photo_category === 'safety' && '安全'}
                    {photo.photo_category === 'others' && 'その他'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    アップロード日時
                  </label>
                  <p className="text-xs text-gray-900">
                    {new Date(photo.photo_uploaded_at).toLocaleString('ja-JP')}
                  </p>
                </div>

                {photo.photo_shooting_date && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      撮影日
                    </label>
                    <p className="text-xs text-gray-900">
                      {new Date(photo.photo_shooting_date).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 