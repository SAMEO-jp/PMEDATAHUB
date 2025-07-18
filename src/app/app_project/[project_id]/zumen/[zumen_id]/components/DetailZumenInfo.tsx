/**
 * @file 詳細図面情報コンポーネント
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FileText, AlertCircle } from 'lucide-react';

import { useZumenAssemblySearch } from '../hooks/useZumenAssemblySearch';
import type { BomFlatRow } from '@src/types/db_bom';

interface DetailZumenInfoProps {
  zumen: BomFlatRow;
  projectId: string;
}

export function DetailZumenInfo({ zumen, projectId }: DetailZumenInfoProps) {
  const router = useRouter();
  
  // 組立図の場合のみ詳細図を検索
  const isAssemblyDrawing = zumen.Zumen_Kind === '組立図';
  const detailZumenQuery = useZumenAssemblySearch().searchByZumenIdAndKind(
    zumen.Zumen_ID,
    '詳細図'
  );

  // 図面ページへの遷移ハンドラー
  const handleZumenClick = (zumenId: string) => {
    router.push(`/app_project/${projectId}/zumen/${zumenId.trim()}`);
  };

  // 組立図でない場合は何も表示しない
  if (!isAssemblyDrawing) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>この図面は組立図ではありません</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {detailZumenQuery.isLoading ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">詳細図数:</span>
            <span className="font-medium">検索中...</span>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-purple-200 rounded"></div>
          </div>
        </div>
      ) : detailZumenQuery.error ? (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>検索エラー</span>
          </div>
          <p className="text-red-500 text-xs">
            {detailZumenQuery.error.message}
          </p>
        </div>
      ) : detailZumenQuery.data?.data ? (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">詳細図数:</span>
            <span className="font-medium">{detailZumenQuery.data.data.totalCount}</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600 text-xs">詳細図ID:</span>
            <div className="flex flex-wrap gap-1">
              {detailZumenQuery.data.data.assemblyZumen.length > 0 ? (
                detailZumenQuery.data.data.assemblyZumen.map((detailZumen, index) => (
                  <button
                    key={index}
                    onClick={() => handleZumenClick(detailZumen.Zumen_ID)}
                    className="inline-block px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-mono hover:bg-purple-200 hover:text-purple-800 transition-colors duration-200 cursor-pointer border border-purple-200 hover:border-purple-300"
                  >
                    {detailZumen.Zumen_ID.trim()}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-xs">詳細図がありません</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">詳細図数:</span>
            <span className="font-medium">0</span>
          </div>
          <div className="space-y-1">
            <span className="text-gray-600 text-xs">詳細図ID:</span>
            <p className="text-gray-500 text-xs">詳細図がありません</p>
          </div>
        </div>
      )}
    </div>
  );
} 