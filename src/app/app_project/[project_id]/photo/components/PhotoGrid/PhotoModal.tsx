'use client';

import React from 'react';
import Image from 'next/image';
import { Photo } from '@src/types/photo';
import { X, Edit, Trash2, Download, Calendar, MapPin } from 'lucide-react';

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (photo: Photo) => void;
  onDelete: (photoId: number) => void;
}

export default function PhotoModal({
  photo,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: PhotoModalProps) {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'palet':
        return 'パレット';
      case 'construction':
        return '工事';
      case 'quality':
        return '品質';
      case 'safety':
        return '安全';
      default:
        return 'その他';
    }
  };

  if (!isOpen || !photo) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* モーダルコンテンツ */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {photo.photo_title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(photo)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={() => onDelete(photo.photo_id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="flex flex-col lg:flex-row">
          {/* 写真エリア */}
          <div className="lg:w-2/3 p-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-gray-500">画像読み込みエラー</div>
                </div>
              ) : (
                <Image
                  src={photo.photo_file_path}
                  alt={photo.photo_title}
                  fill
                  className="object-contain"
                  onError={handleImageError}
                />
              )}
            </div>
          </div>

          {/* 情報エリア */}
          <div className="lg:w-1/3 p-4 border-l">
            <div className="space-y-4">
              {/* カテゴリ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  カテゴリ
                </label>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {getCategoryLabel(photo.photo_category)}
                </span>
              </div>

              {/* 撮影日 */}
              {photo.photo_shooting_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    撮影日
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    {new Date(photo.photo_shooting_date).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              )}

              {/* 撮影場所 */}
              {photo.photo_location && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    撮影場所
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {photo.photo_location}
                  </div>
                </div>
              )}

              {/* 説明 */}
              {photo.photo_description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <p className="text-sm text-gray-600">
                    {photo.photo_description}
                  </p>
                </div>
              )}

              {/* アップロード日 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  アップロード日
                </label>
                <div className="text-sm text-gray-600">
                  {new Date(photo.photo_uploaded_at).toLocaleString('ja-JP')}
                </div>
              </div>

              {/* ステータス */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス
                </label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  photo.photo_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : photo.photo_status === 'archived'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {photo.photo_status === 'active' && 'アクティブ'}
                  {photo.photo_status === 'archived' && 'アーカイブ'}
                  {photo.photo_status === 'deleted' && '削除済み'}
                </span>
              </div>

              {/* アクションボタン */}
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    // ダウンロード処理は後で実装
                    console.log('Download photo:', photo.photo_id);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download size={16} />
                  ダウンロード
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 