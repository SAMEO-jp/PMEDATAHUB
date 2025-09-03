'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, MoreVertical, Calendar, Users, FileText, Trash2, Edit, Eye } from 'lucide-react';

// デモデータ
const demoProjects = [
  {
    id: 'E923BXX215000',
    name: '君津２高炉BP水素吹き込み対応',
    status: '進行中',
    client: '新日鉄住金',
    startDate: '2025-03-03',
    endDate: '2025-06-30',
    updatedAt: '2025-01-15',
    pm: '田中太郎',
    progress: 65,
    members: 8,
    budget: 'A',
    category: '設備工事'
  },
  {
    id: 'E924CXX216000',
    name: '名古屋製鉄所設備更新',
    status: '企画中',
    client: '新日鉄住金',
    startDate: '2025-04-01',
    endDate: '2025-12-31',
    updatedAt: '2025-01-10',
    pm: '佐藤花子',
    progress: 25,
    members: 5,
    budget: 'B',
    category: '設備工事'
  },
  {
    id: 'E925DXX217000',
    name: '八幡製鉄所自動化システム',
    status: '完了',
    client: '新日鉄住金',
    startDate: '2024-09-01',
    endDate: '2025-02-28',
    updatedAt: '2025-01-05',
    pm: '鈴木一郎',
    progress: 100,
    members: 12,
    budget: 'A',
    category: 'システム開発'
  },
  {
    id: 'E926EXX218000',
    name: '千葉製鉄所環境対策',
    status: '一時停止',
    client: '新日鉄住金',
    startDate: '2025-01-01',
    endDate: '2025-08-31',
    updatedAt: '2025-01-12',
    pm: '高橋次郎',
    progress: 40,
    members: 6,
    budget: 'C',
    category: '環境対策'
  }
];

const statusColors = {
  '企画中': 'bg-blue-100 text-blue-800',
  '進行中': 'bg-green-100 text-green-800',
  '一時停止': 'bg-yellow-100 text-yellow-800',
  '完了': 'bg-gray-100 text-gray-800',
  'キャンセル': 'bg-red-100 text-red-800'
};

export default function PJ001ProjectListDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // フィルタリングとソート
  const filteredProjects = demoProjects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.pm.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesClient = clientFilter === 'all' || project.client === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'updatedAt':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        default:
          return 0;
      }
    });

  // ページネーション
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 一括選択
  const handleSelectAll = () => {
    if (selectedProjects.length === paginatedProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(paginatedProjects.map(p => p.id));
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PJ-001: プロジェクト一覧</h1>
            <p className="text-gray-600 mt-2">登録済みプロジェクトを検索・確認・一括操作</p>
          </div>
          <div className="flex gap-3">
            <Link href="/specifications/doc1-project-management/project/demo">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                戻る
              </button>
            </Link>
            <Link href="/specifications/doc1-project-management/project/demo/pj-003">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新規作成
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 検索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="プロジェクト名、クライアント、PMで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* ステータスフィルター */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全ステータス</option>
            <option value="企画中">企画中</option>
            <option value="進行中">進行中</option>
            <option value="一時停止">一時停止</option>
            <option value="完了">完了</option>
            <option value="キャンセル">キャンセル</option>
          </select>

          {/* クライアントフィルター */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全クライアント</option>
            <option value="新日鉄住金">新日鉄住金</option>
          </select>

          {/* ソート */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="updatedAt">最終更新順</option>
            <option value="name">名前順</option>
            <option value="startDate">開始日順</option>
          </select>
        </div>
      </div>

      {/* 一括操作バー */}
      {selectedProjects.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-800">
                {selectedProjects.length}件選択中
              </span>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                ステータス変更
              </button>
              <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                削除
              </button>
            </div>
            <button
              onClick={() => setSelectedProjects([])}
              className="text-blue-600 text-sm hover:text-blue-800"
            >
              選択解除
            </button>
          </div>
        </div>
      )}

      {/* プロジェクト一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === paginatedProjects.length && paginatedProjects.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プロジェクト名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  クライアント
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  開始日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  終了予定
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終更新
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PM
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProjects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => handleSelectProject(project.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-sm text-gray-500">ID: {project.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status as keyof typeof statusColors]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.startDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {project.updatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.pm}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link href={`/project/demo/pj-002?id=${project.id}`}>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/project/demo/pj-004?id=${project.id}`}>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                前へ
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                次へ
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>
                  から
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, filteredProjects.length)}
                  </span>
                  まで表示（全
                  <span className="font-medium">{filteredProjects.length}</span>
                  件）
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    前へ
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    次へ
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 機能説明 */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">実装済み機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-2">検索・フィルタリング:</h4>
            <ul className="space-y-1">
              <li>• キーワード検索（プロジェクト名、クライアント、PM）</li>
              <li>• ステータスフィルター</li>
              <li>• クライアントフィルター</li>
              <li>• 並び替え（更新日、名前、開始日）</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">一括操作:</h4>
            <ul className="space-y-1">
              <li>• 全選択・選択解除</li>
              <li>• 一括ステータス変更</li>
              <li>• 一括削除</li>
              <li>• ページネーション</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


