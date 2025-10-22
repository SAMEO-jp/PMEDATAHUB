'use client';

// ==========================================
// 型定義層
// ==========================================

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ui/button';
import { ArrowLeft } from 'lucide-react';
import { apiRequest } from '@src/lib/apiRequest';
import type { ApiResponse } from '@src/types/api';
import type { BomFlatRow } from '@src/types/db_bom';
import { ZumenViewer } from './components/ZumenViewer';
import { useHeader } from '@src/components/layout/header/store/headerStore';

interface BomData {
  zumen: BomFlatRow;
  parts: BomFlatRow[];
  buzais: BomFlatRow[];
}

// ==========================================
// パラメータとルーティング層
// ==========================================

interface ZumenDetailPageProps {
  params: { project_id: string; zumen_id: string };
}

export default function ZumenDetailPage({ params }: ZumenDetailPageProps) {
  const router = useRouter();
  const { setCustomComponents, clearCustomComponents } = useHeader();

  // ==========================================
  // 状態管理層
  // ==========================================

  const [bomData, setBomData] = useState<BomData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // データ読み込み関数層
  // ==========================================

  const fetchData = async () => {
    try {
      // 図面本体データの取得
      const bomRes = await apiRequest<ApiResponse<BomData>>(
        `/api/db/db_zumen/${params.zumen_id}`,
        'GET'
      );

      if (!bomRes.success) {
        throw new Error(bomRes.error.message);
      }
      setBomData(bomRes.data);

    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // イベントハンドラー層
  // ==========================================

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // ==========================================
  // ライフサイクル層
  // ==========================================

  useEffect(() => {
    void fetchData();
  }, [params.zumen_id]);

  // ヘッダーに戻るボタンのみを表示
  useEffect(() => {
    if (bomData?.zumen) {
      setCustomComponents({
        center: null,
        right: (
          <div className="flex items-center gap-4">
            {/* 戻るボタン */}
            <Button
              onClick={() => {
                void handleGoBack();
              }}
              variant="outline"
              className="shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Button>
          </div>
        )
      });
    }

    // コンポーネントのクリーンアップ
    return () => {
      clearCustomComponents();
    };
  }, [bomData?.zumen, handleGoBack]);

  // ==========================================
  // 計算済みプロパティ層
  // ==========================================

  // ==========================================
  // 条件分岐レンダリング層（早期リターン）
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-red-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
          </div>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!bomData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <p className="text-gray-600 font-medium">データが見つかりません</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // レンダリング層（改善版）
  // ==========================================

  return (
    <div className="w-full h-full">
      {/* 図面画像表示エリア */}
      <div className="w-full h-full">
        <ZumenViewer 
          zumenId={params.zumen_id} 
          zumenName={bomData.zumen.Zumen_Name}
          zumenData={bomData.zumen}
        />
      </div>
    </div>
  );
}