'use client';

import React, { useState, useEffect } from 'react';
import { RightSidebar } from './components/RightSidebar';
import { apiRequest } from '@src/lib/apiRequest';
import type { ApiResponse } from '@src/types/api';
import type { BomFlatRow } from '@src/types/db_bom';

interface ZumenDetailLayoutProps {
  children: React.ReactNode;
  params: { project_id: string; zumen_id: string };
}

interface BomData {
  zumen: BomFlatRow;
  parts: BomFlatRow[];
  buzais: BomFlatRow[];
}

export default function ZumenDetailLayout({ children, params: _params }: ZumenDetailLayoutProps) {
  const [bomData, setBomData] = useState<BomData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bomRes = await apiRequest<ApiResponse<BomData>>(
          `/api/db/db_zumen/${_params.zumen_id}`,
          'GET'
        );

        if (bomRes.success) {
          setBomData(bomRes.data);
        }
      } catch (err) {
        console.error('データ取得エラー:', err instanceof Error ? err.message : 'Unknown error');
      }
    };

    void fetchData();
  }, [_params.zumen_id]);

  // ダウンロード機能
  const handleDownloadImage = () => {
    try {
      window.open(`/api/zumen/${_params.zumen_id}/image`, '_blank');
    } catch (error) {
      console.error('画像ダウンロードエラー:', error);
      alert('画像の表示に失敗しました');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(
        `/api/zumen/${_params.zumen_id}/files?type=pdf&action=download`
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${_params.zumen_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('PDFダウンロードに失敗しました');
      }
    } catch (error) {
      console.error('PDFダウンロードエラー:', error);
      alert('PDFダウンロードに失敗しました');
    }
  };

  const handleDownloadCAD = async () => {
    try {
      const response = await fetch(
        `/api/zumen/${_params.zumen_id}/files?type=cad&action=download`
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${_params.zumen_id}.cad`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('CADデータダウンロードに失敗しました');
      }
    } catch (error) {
      console.error('CADダウンロードエラー:', error);
      alert('CADデータダウンロードに失敗しました');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex flex-col">
      <div className="w-full flex flex-col flex-1" style={{ minHeight: '100vh' }}>
        {/* メインコンテンツエリア */}
        <div className="flex-1 flex">
          {/* 左側：メインコンテンツ */}
          <div className="flex-1 relative bg-white border-b border-gray-200">
            {/* 画像読み込み中のオーバーレイ */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 opacity-0 pointer-events-none" id="image-loading-overlay">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-400 border-t-transparent mx-auto mb-3"></div>
                <p className="text-gray-600 text-sm">画像読み込み中...</p>
              </div>
            </div>
            
            {/* 拡大表示インジケーター */}
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              拡大表示
            </div>
            
            {/* コンテンツエリア */}
            <div className="flex-1 bg-gray-900">
              {children}
            </div>
          </div>

          {/* 右側：サイドバー */}
          <RightSidebar 
            bomData={bomData}
            zumenId={_params.zumen_id}
            projectId={_params.project_id}
            onDownloadImage={handleDownloadImage}
            onDownloadPDF={() => {
              void handleDownloadPDF();
            }}
            onDownloadCAD={() => {
              void handleDownloadCAD();
            }}
          />
        </div>
      </div>
    </div>
  );
} 