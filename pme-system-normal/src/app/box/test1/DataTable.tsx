'use client';

import { useState, useEffect } from 'react';

interface MergedData {
  [key: string]: any;
}

interface PageProps {
  detailsData?: MergedData[];
  mergedData?: MergedData[];
  stats: any;
  error?: string;
}

// BOX IDを正規化する関数
function normalizeBoxId(boxId: string): string {
  return boxId.replace(/'/g, '').trim();
}

// クライアント側でCSVファイルを読み込む関数
const readCSVFileClient = async (filepath: string): Promise<string[][]> => {
  try {
    const response = await fetch(filepath);
    const content = await response.text();
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return lines.map(line => line.split('\t'));
  } catch (error) {
    console.error(`Error reading CSV file ${filepath}:`, error);
    return [];
  }
};

// CSVデータをオブジェクト配列に変換する関数（クライアント側）
const csvToObjectsClient = (csvData: string[][]): any[] => {
  if (csvData.length < 2) return [];

  const headers = csvData[0];
  const rows = csvData.slice(1);

  return rows.map(row => {
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
};

// データをグループ化する関数
const groupByBoxId = (data: any[], boxIdField: string): Map<string, any[]> => {
  const grouped = new Map<string, any[]>();

  data.forEach(item => {
    const boxId = normalizeBoxId(item[boxIdField] || '');
    if (!grouped.has(boxId)) {
      grouped.set(boxId, []);
    }
    grouped.get(boxId)!.push(item);
  });

  return grouped;
};

// クライアント側でデータを統合する関数
const enrichData = (details: MergedData[], categories: MergedData[], technologies: MergedData[]): MergedData[] => {
  const categoriesByBoxId = groupByBoxId(categories, 'ファイル BOX ID');
  const technologiesByBoxId = groupByBoxId(technologies, 'ファイル BOX ID');

  return details.map(detail => {
    const boxId = normalizeBoxId(detail['ファイル BOX ID'] || '');
    const categoryList = categoriesByBoxId.get(boxId) || [];
    const technologyList = technologiesByBoxId.get(boxId) || [];

    // カテゴリ情報をまとめて表示
    const categoryText = categoryList.length > 0
      ? categoryList.map(cat => `${cat['1次分野']}/${cat['2次分野']}/${cat['3次分野']}`).join('; ')
      : '';

    // 技術要素情報をまとめて表示
    const technologyText = technologyList.length > 0
      ? technologyList.map(tech => `${tech['1次要素']}/${tech['2次要素']}/${tech['3次要素']}`).join('; ')
      : '';

    return {
      ...detail,
      'カテゴリ_情報': categoryText,
      '技術要素_情報': technologyText,
      'カテゴリ_件数': categoryList.length,
      '技術要素_件数': technologyList.length
    };
  });
};

// メインのDataTableコンポーネント
function DataTable() {
  const [detailsData, setDetailsData] = useState<MergedData[]>([]);
  const [enrichedData, setEnrichedData] = useState<MergedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // 初期データ読み込み
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoading(true);
        const detailsCsv = await readCSVFileClient('/box/test1/file_details.csv');
        const details = csvToObjectsClient(detailsCsv);

        // 統計情報を計算
        const uniqueBoxIds = new Set(details.map(d => normalizeBoxId(d['ファイル BOX ID'] || '')));

        const initialStats = {
          originalDetailsCount: details.length,
          originalCategoriesCount: 0,
          originalTechnologiesCount: 0,
          mergedCount: details.length,
          uniqueBoxIds: uniqueBoxIds.size
        };

        setDetailsData(details);
        setEnrichedData(details);
        setStats(initialStats);
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'データの読み込みに失敗しました');
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // 他のCSVファイルを読み込んで統合
  const loadAdditionalData = async () => {
    if (!detailsData || detailsData.length === 0) return;

    setLoading(true);
    try {
      const [categoriesCsv, technologiesCsv] = await Promise.all([
        readCSVFileClient('/box/test1/file_categories.csv'),
        readCSVFileClient('/box/test1/file_technologies.csv')
      ]);

      const categories = csvToObjectsClient(categoriesCsv);
      const technologies = csvToObjectsClient(technologiesCsv);

      const enriched = enrichData(detailsData, categories, technologies);

      setEnrichedData(enriched);

      // 統計情報を更新
      if (stats) {
        const updatedStats = {
          ...stats,
          originalCategoriesCount: categories.length,
          originalTechnologiesCount: technologies.length,
          mergedCount: enriched.length
        };
        setStats(updatedStats);
      }

      console.log('=== クライアント側統合結果 ===');
      console.log('file_details.csv:', detailsData.length, '行');
      console.log('file_categories.csv:', categories.length, '行');
      console.log('file_technologies.csv:', technologies.length, '行');
      console.log('統合結果:', enriched.length, '行');

    } catch (error) {
      console.error('Error loading additional data:', error);
      setError('追加データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const displayData = enrichedData.length > 0 ? enrichedData : detailsData;
  const hasEnrichedData = enrichedData.length > 0 && enrichedData !== detailsData;

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">CSVデータ統合表示</h1>
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="flex items-center justify-center">
              <div className="text-lg">初期データを読み込み中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">CSVデータ統合表示</h1>
          <div className="bg-red-50 p-8 rounded-lg shadow">
            <div className="text-red-800">エラー: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CSVデータ統合表示</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadAdditionalData}
              disabled={loading || detailsData.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '読み込み中...' : 'カテゴリ・技術要素を統合'}
            </button>
            {hasEnrichedData && (
              <span className="text-sm text-green-600 font-medium">
                ✓ 統合完了
              </span>
            )}
          </div>
        </div>

        {/* 統計情報 */}
        {stats && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">統計情報</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.originalDetailsCount}</div>
                <div className="text-sm text-gray-600">詳細データ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.originalCategoriesCount}</div>
                <div className="text-sm text-gray-600">カテゴリデータ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.originalTechnologiesCount}</div>
                <div className="text-sm text-gray-600">技術要素データ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.mergedCount}</div>
                <div className="text-sm text-gray-600">統合データ</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.uniqueBoxIds}</div>
                <div className="text-sm text-gray-600">ユニークBOX ID</div>
              </div>
            </div>
          </div>
        )}

        {/* データテーブル */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">No</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">ファイル BOX ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">完成度</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-96">ファイル名</th>
                  {hasEnrichedData ? (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">カテゴリ情報</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">件数</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">技術要素情報</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">件数</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">カテゴリ情報</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-64">技術要素情報</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.slice(0, 100).map((row, index) => (
                  <tr key={`${hasEnrichedData ? 'enriched' : 'basic'}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.No}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{row['ファイル BOX ID']}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{row.完成度}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div
                        className="max-w-96 truncate cursor-help"
                        title={row.ファイル名}
                      >
                        {row.ファイル名}
                      </div>
                    </td>
                    {hasEnrichedData ? (
                      <>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div
                            className="max-w-64 truncate cursor-help"
                            title={row.カテゴリ_情報}
                          >
                            {row.カテゴリ_情報 || 'なし'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          {row.カテゴリ_件数 || 0}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          <div
                            className="max-w-64 truncate cursor-help"
                            title={row.技術要素_情報}
                          >
                            {row.技術要素_情報 || 'なし'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                          {row.技術要素_件数 || 0}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-4 text-sm text-gray-500 italic">
                          統合ボタンをクリックしてください
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 italic">
                          統合ボタンをクリックしてください
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {displayData.length > 100 && (
            <div className="px-6 py-4 bg-gray-50 border-t">
              <p className="text-sm text-gray-600">
                表示件数: 100 / {displayData.length}件
                （パフォーマンスのため最初の100件のみ表示）
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataTable;




