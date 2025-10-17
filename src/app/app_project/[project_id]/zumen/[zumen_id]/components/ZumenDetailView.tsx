/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { FileText, Calendar, User, Tag, Hash } from 'lucide-react';

// ==========================================
// 型定義層
// ==========================================

interface ZumenDetailViewProps {
  zumenId: string;
  zumenData?: {
    Zumen_ID: string;
    Zumen_Name: string;
    Zumen_Kind: string;
    Created_At?: string;
    Updated_At?: string;
    Created_By?: string;
    Description?: string;
    Version?: string;
    Status?: string;
  };
  onBack: () => void;
}

// ==========================================
// メインコンポーネント層
// ==========================================

export function ZumenDetailView({ zumenId, zumenData, onBack }: ZumenDetailViewProps) {
  return (
    <div className="w-full h-screen bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* 詳細情報エリア */}
      <div className="p-8 h-full flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto">
          {/* 基本情報 */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                基本情報
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700 w-20">図面ID:</span>
                  <span className="text-sm text-gray-900">{zumenData?.Zumen_ID || zumenId}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700 w-20">図面名:</span>
                  <span className="text-sm text-gray-900">{zumenData?.Zumen_Name || '未設定'}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 text-gray-500 mr-3" />
                  <span className="text-sm font-medium text-gray-700 w-20">種類:</span>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                    zumenData?.Zumen_Kind === '組立図'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}>
                    {zumenData?.Zumen_Kind || '未設定'}
                  </span>
                </div>
                {zumenData?.Version && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 w-20">バージョン:</span>
                    <span className="text-sm text-gray-900">{zumenData.Version}</span>
                  </div>
                )}
                {zumenData?.Status && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 w-20">ステータス:</span>
                    <span className="text-sm text-gray-900">{zumenData.Status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 作成・更新情報 */}
            <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                作成・更新情報
              </h3>
              <div className="space-y-4">
                {zumenData?.Created_At && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 w-20">作成日時:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(zumenData.Created_At).toLocaleString('ja-JP')}
                    </span>
                  </div>
                )}
                {zumenData?.Updated_At && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 w-20">更新日時:</span>
                    <span className="text-sm text-gray-900">
                      {new Date(zumenData.Updated_At).toLocaleString('ja-JP')}
                    </span>
                  </div>
                )}
                {zumenData?.Created_By && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-500 mr-3" />
                    <span className="text-sm font-medium text-gray-700 w-20">作成者:</span>
                    <span className="text-sm text-gray-900">{zumenData.Created_By}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 説明・メモ */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                説明・メモ
              </h3>
              <div className="space-y-4">
                {zumenData?.Description ? (
                  <div className="bg-white rounded border p-4 min-h-[150px]">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {zumenData.Description}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded border p-4 min-h-[150px] flex items-center justify-center">
                    <p className="text-sm text-gray-500">説明がありません</p>
                  </div>
                )}
              </div>
            </div>

            {/* 技術仕様 */}
            <div className="bg-gray-50 rounded-lg p-6 min-h-[200px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                技術仕様
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-20">ファイル形式:</span>
                  <span className="text-sm text-gray-900">PNG</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-20">表示方式:</span>
                  <span className="text-sm text-gray-900">ベクター対応</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-20">ズーム対応:</span>
                  <span className="text-sm text-gray-900">25% - 300%</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-700 w-20">回転対応:</span>
                  <span className="text-sm text-gray-900">90度単位</span>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
} 