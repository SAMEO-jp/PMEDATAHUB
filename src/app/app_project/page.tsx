'use client';

//React関連（必ず最初）
import { useState } from 'react';

//Next.js関連
import { useRouter } from 'next/navigation';

//型定義（最後）
import type { Project } from '@src/types/db_project';
import { useProjectListHeader } from './hooks/useProjectListHeader';

// カスタムフック
import { useProjectAll } from '@src/hooks/useProjectData';



export default function ProjectListPage() {
  // 状態管理
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Project>('CREATED_AT');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'active' | 'completed' | 'archived' | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // tRPCを使用してプロジェクトデータを取得
  const { data: projectData, isLoading: loading, error: queryError } = useProjectAll({
    search: searchTerm || undefined,
    status: filterStatus === 'all' ? undefined : filterStatus,
    page: currentPage,
    pageSize: itemsPerPage,
  });

  // プロジェクト一覧用のヘッダー設定
  useProjectListHeader(projectData?.data?.length || 0, searchTerm);

  // tRPCからのデータをソートして使用
  const projects = projectData?.data || [];
  const totalPages = projectData?.totalPages || 1;
  const error = queryError ? 'プロジェクトの取得に失敗しました' : null;

  // ソート済みのプロジェクトデータ
  const sortedProjects = [...projects].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    // 日付フィールドの場合は日付として比較
    if (sortField === 'CREATED_AT' || sortField === 'UPDATE_AT' ||
        sortField === 'PROJECT_START_DATE' || sortField === 'PROJECT_START_ENDDATE') {
      const aDate = new Date(aValue as string).getTime();
      const bDate = new Date(bValue as string).getTime();
      return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
    }

    // その他のフィールドは文字列として比較
    const aStr = String(aValue);
    const bStr = String(bValue);
    return sortOrder === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  // ソート処理
  const handleSort = (field: keyof Project) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">プロジェクト一覧</h1>
        <button
          onClick={() => router.push('/app_project/page/make_project')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          新規作成
        </button>
      </div>

      {/* 検索・フィルター・ソート */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="プロジェクトを検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'active' | 'completed' | 'archived' | 'all')}
            className="p-2 border rounded"
          >
            <option value="all">すべてのステータス</option>
            <option value="active">進行中</option>
            <option value="completed">完了</option>
            <option value="archived">アーカイブ</option>
          </select>
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ローディング表示 */}
      {loading ? (
        <div className="text-center py-4">読み込み中...</div>
      ) : (
        <>
          {/* プロジェクト一覧テーブル */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => handleSort('PROJECT_ID')}
                  >
                    プロジェクトID
                    {sortField === 'PROJECT_ID' && (
                      <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => handleSort('PROJECT_NAME')}
                  >
                    プロジェクト名
                    {sortField === 'PROJECT_NAME' && (
                      <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => handleSort('PROJECT_CLIENT_NAME')}
                  >
                    クライアント名
                    {sortField === 'PROJECT_CLIENT_NAME' && (
                      <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => handleSort('PROJECT_STATUS')}
                  >
                    ステータス
                    {sortField === 'PROJECT_STATUS' && (
                      <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => handleSort('PROJECT_START_DATE')}
                  >
                    開始日
                    {sortField === 'PROJECT_START_DATE' && (
                      <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left cursor-pointer"
                    onClick={() => handleSort('PROJECT_START_ENDDATE')}
                  >
                    終了日
                    {sortField === 'PROJECT_START_ENDDATE' && (
                      <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProjects.map((project) => (
                  <tr
                    key={project.PROJECT_ID}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/app_project/${project.PROJECT_ID}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.PROJECT_ID}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.PROJECT_NAME}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.PROJECT_CLIENT_NAME}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.PROJECT_STATUS === 'active'
                            ? 'bg-green-100 text-green-800'
                            : project.PROJECT_STATUS === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {project.PROJECT_STATUS === 'active'
                          ? '進行中'
                          : project.PROJECT_STATUS === 'completed'
                          ? '完了'
                          : 'アーカイブ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.PROJECT_START_DATE}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.PROJECT_START_ENDDATE}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                前へ
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
