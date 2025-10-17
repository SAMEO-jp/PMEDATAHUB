'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FormData {
  fileName: string;
  projectName: string;
  equipmentName: string;
  documentType: string;
  saveDeadline: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvalMemo: string;
  description: string;
  creator: string;
  uploader: string;
  otherMemo: string;
}

export default function SubmitPage() {
  const [selectedOption, setSelectedOption] = useState<'upload' | 'create' | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fileName: '',
    projectName: '',
    equipmentName: '',
    documentType: '',
    saveDeadline: '',
    approvalStatus: 'pending',
    approvalMemo: '',
    description: '',
    creator: '',
    uploader: '',
    otherMemo: ''
  });

  // ファイル選択の処理
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setUploadedFiles(prev => [...prev, ...fileArray]);
      
      // ファイルがアップロードされたら自動でフォームに情報を設定
      if (fileArray.length > 0) {
        const firstFile = fileArray[0];
        const fileName = firstFile.name;
        
        // ファイル名から情報を自動抽出（サンプル）
        const extractedInfo = extractInfoFromFileName(fileName);
        
        setFormData(prev => ({
          ...prev,
          fileName: fileName,
          projectName: extractedInfo.projectName || '君津２高炉BP水素吹き込み対応',
          equipmentName: extractedInfo.equipmentName || '1B31 上部流調ゲート弁',
          documentType: extractedInfo.documentType || '軸強度検討書',
          creator: extractedInfo.creator || '担当者 太郎',
          uploader: '担当者 太郎'
        }));
      }
    }
  };

  // ファイル名から情報を抽出する関数（サンプル実装）
  const extractInfoFromFileName = (fileName: string) => {
    const info: any = {};
    
    // ファイル名に含まれる情報を解析
    if (fileName.includes('1B31')) {
      info.equipmentName = '1B31 上部流調ゲート弁';
    }
    if (fileName.includes('軸強度')) {
      info.documentType = '軸強度検討書';
    }
    if (fileName.includes('君津') || fileName.includes('kimitsu')) {
      info.projectName = '君津２高炉BP水素吹き込み対応';
    }
    if (fileName.includes('太郎')) {
      info.creator = '担当者 太郎';
    }
    
    return info;
  };

  // フォームデータの更新
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ファイル削除
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 提出処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('提出データ:', { uploadedFiles, formData });
    // ここで実際の提出処理を実装
    alert('検討書が正常に提出されました。');
  };

  return (
    <div className="submit-page p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* 左側のナビゲーション */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-6">
              <Link href="/knowledge/kento" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                ← 検討書管理に戻る
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">検討書提出</h1>
              <p className="text-gray-600 mb-6">
                検討書の提出方法を選択してください。
              </p>
              
              {/* 選択オプション */}
              {!selectedOption && (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedOption('upload')}
                    className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm">📄</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">標準QRつき検討書のアップロード</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      既存の検討書ファイルをアップロードして提出します。
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedOption('create')}
                    className="w-full p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 text-sm">✏️</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">検討書ページの作成</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      新しい検討書ページを作成して提出します。
                    </p>
                  </button>
                </div>
              )}

              {selectedOption && (
                <button
                  onClick={() => setSelectedOption(null)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  ← 選択に戻る
                </button>
              )}
            </div>
          </div>

          {/* 右側のメインコンテンツ */}
          <div className="flex-1">
            {/* アップロード機能 */}
            {selectedOption === 'upload' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">標準QRつき検討書のアップロード</h2>

                {/* ファイルアップロードエリア */}
                <div className="mb-8">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center border-gray-300 hover:border-gray-400">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      multiple
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer block"
                    >
                      <div className="mb-4">
                        <span className="text-4xl">📁</span>
                      </div>
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        ファイルを選択
                      </p>
                      <p className="text-gray-600 mb-4">
                        クリックしてファイルを選択
                      </p>
                      <p className="text-sm text-gray-500">
                        対応形式: PDF, DOC, DOCX, PNG, JPG, JPEG
                      </p>
                    </label>
                  </div>
                </div>

                {/* アップロードされたファイル一覧 */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">アップロードされたファイル</h3>
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">📄</span>
                            <span className="font-medium">{file.name}</span>
                            <span className="text-sm text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            削除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* フォーム */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ファイル名
                      </label>
                      <input
                        type="text"
                        value={formData.fileName}
                        onChange={(e) => handleFormChange('fileName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ファイル名を入力"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        プロジェクト名
                      </label>
                      <input
                        type="text"
                        value={formData.projectName}
                        onChange={(e) => handleFormChange('projectName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="プロジェクト名を入力"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        設備名
                      </label>
                      <input
                        type="text"
                        value={formData.equipmentName}
                        onChange={(e) => handleFormChange('equipmentName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="設備名を入力"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ドキュメントタイプ
                      </label>
                      <input
                        type="text"
                        value={formData.documentType}
                        onChange={(e) => handleFormChange('documentType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ドキュメントタイプを入力"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        保存締め
                      </label>
                      <input
                        type="date"
                        value={formData.saveDeadline}
                        onChange={(e) => handleFormChange('saveDeadline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        承認状況
                      </label>
                      <select
                        value={formData.approvalStatus}
                        onChange={(e) => handleFormChange('approvalStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">承認待ち</option>
                        <option value="approved">承認済み</option>
                        <option value="rejected">却下</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        作成者
                      </label>
                      <input
                        type="text"
                        value={formData.creator}
                        onChange={(e) => handleFormChange('creator', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="作成者を入力"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        アップロード者
                      </label>
                      <input
                        type="text"
                        value={formData.uploader}
                        onChange={(e) => handleFormChange('uploader', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="アップロード者を入力"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      承認時メモ
                    </label>
                    <textarea
                      value={formData.approvalMemo}
                      onChange={(e) => handleFormChange('approvalMemo', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="承認時のメモを入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明事項
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="説明事項を入力"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      その他メモ
                    </label>
                    <textarea
                      value={formData.otherMemo}
                      onChange={(e) => handleFormChange('otherMemo', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="その他のメモを入力"
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      提出する
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedOption(null)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 検討書ページ作成機能 */}
            {selectedOption === 'create' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">検討書ページの作成</h2>
                
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">✏️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    検討書ページ作成機能
                  </h3>
                  <p className="text-gray-600">
                    この機能は現在開発中です。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 