"use client";
// ======================================
// 型定義層
// ======================================

import React, { useEffect, useState } from 'react';
import type { BomFlatRow } from '@src/types/db_bom';

interface BomData {
  zumen: BomFlatRow;
  parts: BomFlatRow[];
  buzais: BomFlatRow[];
}

interface RelatedZumenData {
  relatedZumen: BomFlatRow[];
  detailZumen: BomFlatRow | null;
}

// ======================================
// パラメータとルーティング層
// ======================================

interface ZumenDetailPageProps {
  params: { project_id: string; zumen_id: string };
}

export default function ZumenDetailPage({ params }: ZumenDetailPageProps) {

  // ======================================
  // 状態管理層
  // ======================================

  const [bomData, setBomData] = useState<BomData | null>(null);           // メインのBOMデータ
  const [relatedData, setRelatedData] = useState<RelatedZumenData | null>(null); // 関連図面データ
  const [error, setError] = useState<string | null>(null);                // エラー状態
  const [loading, setLoading] = useState(true);                           // ローディング状態

  // ======================================
  // データ読み込み関数層
  // ======================================

  const fetchData = async () => {
    try {
      // 図面データの取得
      const response = await fetch(`/api/db/db_zumen/${params.zumen_id}`);
      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }
      const data = await response.json();
      setBomData(data);

      // 関連図面データの取得
      const relatedResponse = await fetch(`/api/db/db_zumen/${params.zumen_id}/related`);
      if (!relatedResponse.ok) {
        throw new Error('関連図面データの取得に失敗しました');
      }
      const relatedData = await relatedResponse.json();
      setRelatedData(relatedData.data);

    } catch (err) {
      // エラーハンドリング
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      // ローディング状態解除
      setLoading(false);
    }
  };

  // ======================================
  // ライフサイクル層
  // ======================================

  useEffect(() => {
    fetchData();
  }, [params.zumen_id]); // 依存配列: zumen_idが変更された時のみ再実行

  // ======================================
  // 計算済みプロパティ層
  // ======================================

  const isKumitateZumen = bomData?.zumen.Zumen_Kind === '組立図';

  // ======================================
  // 条件分岐レンダリング層（早期リターン）
  // ======================================

  if (loading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">エラー: {error}</div>;
  }

  if (!bomData) {
    return <div className="p-4">データが見つかりません</div>;
  }

  // ======================================
  // レンダリング層（メインUI）
  // ======================================

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">図面詳細</h1>
      
      {/* 図面情報セクション */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">図面情報</h2>
        <div className="bg-white shadow rounded-lg p-4">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-gray-600">図面ID</dt>
              <dd>{bomData.zumen.Zumen_ID}</dd>
            </div>
            <div>
              <dt className="text-gray-600">図面名</dt>
              <dd>{bomData.zumen.Zumen_Name}</dd>
            </div>
            <div>
              <dt className="text-gray-600">図面種別</dt>
              <dd>{bomData.zumen.Zumen_Kind}</dd>
            </div>
            <div>
              <dt className="text-gray-600">組立図面</dt>
              <dd>{bomData.zumen.Kumitate_Zumen}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 条件分岐による表示切り替え */}
      {isKumitateZumen ? (
        // 組立図の場合: 関連図面と詳細図面を表示
        <>
          {/* 関連図面リストセクション */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">関連図面リスト</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面種別</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 配列のマッピングによるリストレンダリング */}
                  {relatedData?.relatedZumen.map((zumen) => (
                    <tr key={zumen.Zumen_ID}>
                      <td className="px-6 py-4 whitespace-nowrap">{zumen.Zumen_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{zumen.Zumen_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{zumen.Zumen_Kind}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 詳細図面セクション */}
          <section>
            <h2 className="text-xl font-semibold mb-2">詳細図面</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {relatedData?.detailZumen ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面名</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">図面種別</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">{relatedData.detailZumen.Zumen_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{relatedData.detailZumen.Zumen_Name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{relatedData.detailZumen.Zumen_Kind}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  詳細図面はありません
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        // 組立図以外の場合: 部品リストと部材リストを表示
        <>
          {/* 部品リストセクション */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-2">部品リスト</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部品ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部品名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 部品データのマッピング */}
                  {bomData.parts.map((part) => (
                    <tr key={part.Part_ROWID}>
                      <td className="px-6 py-4 whitespace-nowrap">{part.PART_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{part.PART_NAME}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{part.QUANTITY}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{part.REMARKS}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 部材リストセクション */}
          <section>
            <h2 className="text-xl font-semibold mb-2">部材リスト</h2>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部材ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部材名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">材質</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 部材データのマッピング */}
                  {bomData.buzais.map((buzai) => (
                    <tr key={buzai.Buzai_ROWID}>
                      <td className="px-6 py-4 whitespace-nowrap">{buzai.BUZAI_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{buzai.BUZAI_NAME}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{buzai.BUZAI_QUANTITY}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{buzai.ZAISITU_NAME}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );

  // ======================================
  // イベントハンドラ層（現在未使用）
  // ======================================
  
  // 例: const handleClick = (id: string) => { ... };
  // 例: const handleSubmit = (event: FormEvent) => { ... };
}