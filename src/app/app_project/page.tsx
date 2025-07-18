'use client';

//React関連（必ず最初）
import { useState, useEffect } from 'react';

//Next.js関連
import { useRouter } from 'next/navigation';

//型定義（最後）
import type { Project } from '@src/types/db_project';
import { useProjectListHeader } from './hooks/useProjectListHeader';



export default function ProjectListPage() {
  // 状態管理
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Project>('CREATED_AT');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<Project['PROJECT_STATUS'] | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // プロジェクト一覧用のヘッダー設定
  useProjectListHeader(projects.length, searchTerm);

  // プロジェクトデータの取得
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // 検索条件の構築
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      params.append('page', currentPage.toString());
      params.append('pageSize', itemsPerPage.toString());

      const response = await fetch(`/api/db/db_projects/all_list?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`プロジェクトの取得に失敗しました: ${response.statusText}`);
      }

      const data = await response.json();
      
      // データの存在確認と型チェック
      if (!data || !Array.isArray(data.projects)) {
        throw new Error('無効なデータ形式です');
      }

      // クライアント側でソート
      const sortedProjects = [...data.projects].sort((a, b) => {
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

      setProjects(sortedProjects);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (err) {
      console.error('プロジェクト取得エラー:', err);
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      setProjects([]); // エラー時は空配列を設定
    } finally {
      setLoading(false);
    }
  };

  // 初回読み込みと条件変更時のデータ取得
  useEffect(() => {
    fetchProjects();
  }, [searchTerm, filterStatus, currentPage]);

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
      <h1 className="text-2xl font-bold mb-6">プロジェクト一覧</h1>

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
            onChange={(e) => setFilterStatus(e.target.value as Project['PROJECT_STATUS'] | 'all')}
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
                {projects.map((project) => (
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
