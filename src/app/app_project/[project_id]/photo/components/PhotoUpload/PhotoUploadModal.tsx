'use client';

import React, { useState, useCallback } from 'react';
import { X, Upload, FileImage, AlertCircle, FolderPlus } from 'lucide-react';
import { trpc } from '@src/lib/trpc/client';

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onUploadComplete?: () => void;
}

export default function PhotoUploadModal({
  isOpen,
  onClose,
  projectId,
  onUploadComplete,
}: PhotoUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showNewAlbumInput, setShowNewAlbumInput] = useState(false);

  // アルバム一覧取得
  const albumsQuery = trpc.photos.getAlbums.useQuery({
    projectId,
  });

  // デバッグ用ログ
  console.log('Albums query data:', albumsQuery.data);
  console.log('Albums loading:', albumsQuery.isLoading);
  console.log('Albums error:', albumsQuery.error);

  // アルバム作成ミューテーション
  const createAlbumMutation = trpc.photos.createAlbum.useMutation({
    onSuccess: (data) => {
      if (data.success && data.data && data.data.album_id) {
        setSelectedAlbumId(data.data.album_id);
        setNewAlbumName('');
        setShowNewAlbumInput(false);
        void albumsQuery.refetch();
      }
    },
  });

  // ファイル選択ハンドラー
  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const fileArray = Array.from(selectedFiles);
    const imageFiles = fileArray.filter(file => 
      file.type.startsWith('image/')
    );
    
    setFiles(prev => [...prev, ...imageFiles]);
  }, []);

  // ドラッグ&ドロップハンドラー
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  }, [handleFileSelect]);

  // ファイル削除
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // アップロード実行
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    try {
      // ファイルをFormDataに変換
      const formData = new FormData();
      formData.append('projectId', projectId);
      if (selectedAlbumId) {
        formData.append('albumId', selectedAlbumId.toString());
        console.log('Selected album ID:', selectedAlbumId);
      } else {
        console.log('No album selected');
      }
      files.forEach((file) => {
        formData.append('files', file);
      });

      // 直接APIルートにアップロード
      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('アップロードに失敗しました');
      }

      const result = await response.json();
      console.log('Upload success:', result);
      
      // 成功時の処理
      setFiles([]);
      setUploading(false);
      setUploadError(null);
      setSelectedAlbumId(null);
      setNewAlbumName('');
      setShowNewAlbumInput(false);
      onUploadComplete?.();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadError('アップロードに失敗しました');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            写真アップロード
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {/* ドラッグ&ドロップエリア */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              写真ファイルをドラッグ&ドロップまたは
            </p>
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-800 font-medium">
                ファイルを選択
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </label>
          </div>

          {/* アルバム選択 */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                アルバム選択
              </h3>
              
              {/* 既存アルバム選択 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  既存のアルバムを選択
                </label>
                <select
                  value={selectedAlbumId || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : null;
                    console.log('Album selection changed:', value);
                    setSelectedAlbumId(value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">アルバムを選択してください</option>
                  {albumsQuery.data?.data?.map((album: any) => (
                    <option key={album.album_id} value={album.album_id}>
                      {album.album_name} ({album.photo_count || 0}枚)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  選択中のアルバムID: {selectedAlbumId || 'なし'}
                </p>
              </div>

              {/* 新規アルバム作成 */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    新規アルバムを作成
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowNewAlbumInput(!showNewAlbumInput)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FolderPlus className="w-4 h-4" />
                  </button>
                </div>
                
                {showNewAlbumInput && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAlbumName}
                      onChange={(e) => setNewAlbumName(e.target.value)}
                      placeholder="アルバム名を入力"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (newAlbumName.trim()) {
                          createAlbumMutation.mutate({
                            fk_project_id: projectId,
                            album_name: newAlbumName.trim(),
                            album_description: '',
                          });
                        }
                      }}
                      disabled={!newAlbumName.trim() || createAlbumMutation.isPending}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {createAlbumMutation.isPending ? '作成中...' : '作成'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 選択されたファイル一覧 */}
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                選択されたファイル ({files.length}件)
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileImage className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* エラーメッセージ */}
          {uploadError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">
                  {uploadError}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={uploading}
          >
            キャンセル
          </button>
                      <button
              onClick={() => void handleUpload()}
              disabled={files.length === 0 || uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'アップロード中...' : 'アップロード'}
            </button>
        </div>
      </div>
    </div>
  );
} 