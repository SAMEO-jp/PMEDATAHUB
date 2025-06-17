'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface KonpoTestData {
  project_ID: string;
  Zumen_ID: string;
  Zumen_Name: string;
  PART_ID: string;
  PART_NAME: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  MANUFACTURER: string;
  BUZAI_ID: string;
  BUZAI_NAME: string;
  BUZAI_WEIGHT: number;
  BUZAI_QUANTITY: number;
  ZAISITU_NAME: string;
  KONPO_TANNI_ID: string;
  PART_KO: number;
  ZENSU_KO: number;
  KONPO_LIST_ID: string;
  KONPO_LIST_WEIGHT: number;
  HASSOU_IN: string;
  HASSOU_TO: string;
}

export default function KonpoTestPage() {
  const params = useParams();
  const [data, setData] = useState<KonpoTestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bom/${params.project_id}/flat/konpotanni/konpo_test`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.project_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">コンポーネントテストデータ</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">図面ID</th>
              <th className="px-4 py-2 border">図面名</th>
              <th className="px-4 py-2 border">部品ID</th>
              <th className="px-4 py-2 border">部品名</th>
              <th className="px-4 py-2 border">数量</th>
              <th className="px-4 py-2 border">予備数量</th>
              <th className="px-4 py-2 border">メーカー</th>
              <th className="px-4 py-2 border">部材ID</th>
              <th className="px-4 py-2 border">部材名</th>
              <th className="px-4 py-2 border">部材重量</th>
              <th className="px-4 py-2 border">部材数量</th>
              <th className="px-4 py-2 border">材質名</th>
              <th className="px-4 py-2 border">コンポ単価ID</th>
              <th className="px-4 py-2 border">部品個数</th>
              <th className="px-4 py-2 border">全数個数</th>
              <th className="px-4 py-2 border">コンポリストID</th>
              <th className="px-4 py-2 border">コンポリスト重量</th>
              <th className="px-4 py-2 border">発送印</th>
              <th className="px-4 py-2 border">発送先</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.Zumen_ID}</td>
                <td className="px-4 py-2 border">{item.Zumen_Name}</td>
                <td className="px-4 py-2 border">{item.PART_ID}</td>
                <td className="px-4 py-2 border">{item.PART_NAME}</td>
                <td className="px-4 py-2 border">{item.QUANTITY}</td>
                <td className="px-4 py-2 border">{item.SPARE_QUANTITY}</td>
                <td className="px-4 py-2 border">{item.MANUFACTURER}</td>
                <td className="px-4 py-2 border">{item.BUZAI_ID}</td>
                <td className="px-4 py-2 border">{item.BUZAI_NAME}</td>
                <td className="px-4 py-2 border">{item.BUZAI_WEIGHT}</td>
                <td className="px-4 py-2 border">{item.BUZAI_QUANTITY}</td>
                <td className="px-4 py-2 border">{item.ZAISITU_NAME}</td>
                <td className="px-4 py-2 border">{item.KONPO_TANNI_ID}</td>
                <td className="px-4 py-2 border">{item.PART_KO}</td>
                <td className="px-4 py-2 border">{item.ZENSU_KO}</td>
                <td className="px-4 py-2 border">{item.KONPO_LIST_ID}</td>
                <td className="px-4 py-2 border">{item.KONPO_LIST_WEIGHT}</td>
                <td className="px-4 py-2 border">{item.HASSOU_IN}</td>
                <td className="px-4 py-2 border">{item.HASSOU_TO}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 