'use client';

import React,{ useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BomZumen } from '@src/types/db_bom';

interface PageProps {
  params: {
    project_id: string;
  };
}

interface ZumenResponse {
  projectId: string;
  total: number;
  zumenList: BomZumen[];
}

export default function ProjectZumenPage({ params }: PageProps) {
  const router = useRouter();
  const [zumenList, setZumenList] = useState<BomZumen[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZumenKind, setSelectedZumenKind] = useState<string>('all');

  // 図面データの取得
  useEffect(() => {
    const fetchZumenList = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/bom/${params.project_id}/zumenlist_all`);
        if (!response.ok) {
          throw new Error('図面一覧の取得に失敗しました');
        }
        const data = await response.json() as ZumenResponse;
        setZumenList(data.zumenList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchZumenList();
  }, [params.project_id]);

  // 図面種類フィルター
  const filteredZumenList = zumenList.filter(zumen => {
    if (!zumen) return false;

    // 図面種類のフィルター
    const zumenKind = zumen.Zumen_Kind || '';
    return selectedZumenKind === 'all' || zumenKind === selectedZumenKind;
  });

  // ステータスの色を取得
  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'draft':
      case '下書き':
        return 'bg-gray-100 text-gray-800';
      case 'review':
      case 'レビュー中':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case '承認済':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case '却下':
        return 'bg-red-100 text-red-800';
      case '出図済':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={() => router.push(`/app_project/${params.project_id}`)}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            プロジェクト詳細に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

      {/* 図面種類タブ */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedZumenKind('all')}
              className={`${
                selectedZumenKind === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              すべて
            </button>
            <button
              onClick={() => setSelectedZumenKind('組立図')}
              className={`${
                selectedZumenKind === '組立図'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              組立図
            </button>
            <button
              onClick={() => setSelectedZumenKind('詳細図')}
              className={`${
                selectedZumenKind === '詳細図'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              詳細図
            </button>
          </nav>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  図面ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  図面名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  図面種類
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  担当者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  出図日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  アクション
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredZumenList && filteredZumenList.length > 0 ? (
                filteredZumenList.map((zumen) => {
                  // プロパティの存在チェックとNULL/空白の処理
                  const zumenName = zumen.Zumen_Name || '';
                  const zumenId = zumen.Zumen_ID || '';
                  const status = zumen.status || '';
                  const tantoA1 = zumen.Tantou_a1 || '';
                  const syutuzubiDate = zumen.Syutuzubi_Date || '';
                  const zumenKind = zumen.Zumen_Kind || '';

                  return (
                    <tr key={zumenId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {zumenId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{zumenName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {zumenKind}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(status)
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tantoA1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {syutuzubiDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => router.push(`/app_project/${params.project_id}/zumen/${zumenId}`)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          詳細
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    図面が見つかりません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
