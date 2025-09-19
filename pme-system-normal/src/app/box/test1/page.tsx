'use client';

import React, { useState, useEffect } from 'react';

// 型定義
interface CategoryData {
  "ファイル BOX ID": string;
  "1次分野": string;
  "2次分野": string;
  "3次分野": string;
}

interface DetailData {
  "No": string;
  "ファイル BOX ID": string;
  "完成度": string;
  "資料作成日": string;
  "整理日": string;
  "関連資料フォルダ": string;
  "ファイル名": string;
}

interface TechnologyData {
  "ファイル BOX ID": string;
  "1次要素": string;
  "2次要素": string;
  "3次要素": string;
}

interface CombinedData {
  boxId: string;
  category: CategoryData | null;
  detail: DetailData | null;
  technologies: TechnologyData[];
}

export default function Test1Page() {
  const [data, setData] = useState<CombinedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // JSONファイルの読み込み
      const [categoriesRes, detailsRes, technologiesRes] = await Promise.all([
        fetch('/box/test1/file_categories.json'),
        fetch('/box/test1/file_details.json'),
        fetch('/box/test1/file_technologies.json')
      ]);

      if (!categoriesRes.ok || !detailsRes.ok || !technologiesRes.ok) {
        throw new Error('JSONファイルの読み込みに失敗しました');
      }

      const categories: CategoryData[] = await categoriesRes.json();
      const details: DetailData[] = await detailsRes.json();
      const technologies: TechnologyData[] = await technologiesRes.json();

      // BOX IDでデータを統合
      const combinedMap = new Map<string, CombinedData>();

      // カテゴリーデータを統合
      categories.forEach(cat => {
        const boxId = cat["ファイル BOX ID"];
        if (!combinedMap.has(boxId)) {
          combinedMap.set(boxId, {
            boxId,
            category: cat,
            detail: null,
            technologies: []
          });
        } else {
          combinedMap.get(boxId)!.category = cat;
        }
      });

      // 詳細データを統合
      details.forEach(detail => {
        const boxId = detail["ファイル BOX ID"];
        if (!combinedMap.has(boxId)) {
          combinedMap.set(boxId, {
            boxId,
            category: null,
            detail,
            technologies: []
          });
        } else {
          combinedMap.get(boxId)!.detail = detail;
        }
      });

      // 技術データを統合
      technologies.forEach(tech => {
        const boxId = tech["ファイル BOX ID"];
        if (!combinedMap.has(boxId)) {
          combinedMap.set(boxId, {
            boxId,
            category: null,
            detail: null,
            technologies: [tech]
          });
        } else {
          combinedMap.get(boxId)!.technologies.push(tech);
        }
      });

      setData(Array.from(combinedMap.values()));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">エラー: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ファイルデータ統合表</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">BOX ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">1次分野</th>
              <th className="border border-gray-300 px-4 py-2 text-left">2次分野</th>
              <th className="border border-gray-300 px-4 py-2 text-left">3次分野</th>
              <th className="border border-gray-300 px-4 py-2 text-left">ファイル名</th>
              <th className="border border-gray-300 px-4 py-2 text-left">完成度</th>
              <th className="border border-gray-300 px-4 py-2 text-left">整理日</th>
              <th className="border border-gray-300 px-4 py-2 text-left">技術要素</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{item.boxId}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.category?.["1次分野"] || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.category?.["2次分野"] || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.category?.["3次分野"]?.replace('\r', '') || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.detail?.["ファイル名"]?.replace('\r', '') || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.detail?.["完成度"] || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.detail?.["整理日"] || '-'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.technologies.length > 0 ? (
                    <div className="space-y-1">
                      {item.technologies.map((tech, techIndex) => (
                        <div key={techIndex} className="text-sm">
                          <div><strong>{tech["1次要素"]}</strong></div>
                          <div>└ {tech["2次要素"]}</div>
                          <div>　└ {tech["3次要素"]?.replace('\r', '')}</div>
                        </div>
                      ))}
                    </div>
                  ) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-sm text-gray-600">
        総データ数: {data.length} 件
      </div>
    </div>
  );
}