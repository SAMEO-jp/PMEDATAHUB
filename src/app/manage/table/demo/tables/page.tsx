'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Table, Eye, Database, Calendar, BarChart3, ArrowUpDown, Download } from 'lucide-react';

// デモデータ
const demoTables = [
  {
    name: 'PROJECT',
    records: 1250,
    size: '2.3 MB',
    lastUpdated: '2025-01-15',
    description: 'プロジェクト基本情報',
    category: 'プロジェクト管理',
    columns: 22,
    indexes: 5,
    status: 'active'
  },
  {
    name: 'USER',
    records: 89,
    size: '156 KB',
    lastUpdated: '2025-01-14',
    description: 'ユーザー情報',
    category: 'ユーザー管理',
    columns: 13,
    indexes: 3,
    status: 'active'
  },
  {
    name: 'BOM_BUHIN',
    records: 15420,
    size: '8.7 MB',
    lastUpdated: '2025-01-15',
    description: 'BOM部品情報',
    category: 'BOM管理',
    columns: 18,
    indexes: 8,
    status: 'active'
  },
  {
    name: 'BOM_BUZAI',
    records: 8920,
    size: '5.2 MB',
    lastUpdated: '2025-01-15',
    description: 'BOM部材情報',
    category: 'BOM管理',
    columns: 15,
    indexes: 6,
    status: 'active'
  },
  {
    name: 'BOM_PART',
    records: 11230,
    size: '6.8 MB',
    lastUpdated: '2025-01-14',
    description: 'BOMパーツ情報',
    category: 'BOM管理',
    columns: 20,
    indexes: 7,
    status: 'active'
  },
  {
    name: 'BOM_ZUMEN',
    records: 4560,
    size: '3.4 MB',
    lastUpdated: '2025-01-13',
    description: 'BOM図面情報',
    category: 'BOM管理',
    columns: 12,
    indexes: 4,
    status: 'active'
  },
  {
    name: 'PALET_MASTER',
    records: 3420,
    size: '4.2 MB',
    lastUpdated: '2025-01-13',
    description: 'パレットマスタ情報',
    category: 'パレット管理',
    columns: 16,
    indexes: 5,
    status: 'active'
  },
  {
    name: 'PALET_LIST',
    records: 6780,
    size: '2.1 MB',
    lastUpdated: '2025-01-15',
    description: 'パレットリスト',
    category: 'パレット管理',
    columns: 14,
    indexes: 4,
    status: 'active'
  },
  {
    name: 'KONPO_PALET',
    records: 2340,
    size: '1.8 MB',
    lastUpdated: '2025-01-12',
    description: '梱包パレット情報',
    category: 'パレット管理',
    columns: 11,
    indexes: 3,
    status: 'active'
  },
  {
    name: 'business_achievements',
    records: 5670,
    size: '3.1 MB',
    lastUpdated: '2025-01-15',
    description: '業務実績データ',
    category: '業務管理',
    columns: 17,
    indexes: 6,
    status: 'active'
  },
  {
    name: 'business_categories',
    records: 234,
    size: '89 KB',
    lastUpdated: '2025-01-10',
    description: '業務分類マスタ',
    category: '業務管理',
    columns: 15,
    indexes: 4,
    status: 'active'
  },
  {
    name: 'photos',
    records: 2340,
    size: '12.8 MB',
    lastUpdated: '2025-01-12',
    description: '写真メタデータ',
    category: 'ファイル管理',
    columns: 14,
    indexes: 5,
    status: 'active'
  },
  {
    name: 'photo_categories',
    records: 45,
    size: '23 KB',
    lastUpdated: '2025-01-08',
    description: '写真カテゴリ',
    category: 'ファイル管理',
    columns: 6,
    indexes: 2,
    status: 'active'
  },
  {
    name: 'photo_tags',
    records: 156,
    size: '67 KB',
    lastUpdated: '2025-01-09',
    description: '写真タグ',
    category: 'ファイル管理',
    columns: 8,
    indexes: 3,
    status: 'active'
  },
  {
    name: 'events',
    records: 89,
    size: '45 KB',
    lastUpdated: '2025-01-11',
    description: 'イベント情報',
    category: 'イベント管理',
    columns: 12,
    indexes: 3,
    status: 'active'
  },
  {
    name: 'document_demo',
    records: 567,
    size: '234 KB',
    lastUpdated: '2025-01-14',
    description: 'ドキュメントデモ',
    category: 'ドキュメント管理',
    columns: 9,
    indexes: 3,
    status: 'active'
  }
];

const categories = ['all', 'プロジェクト管理', 'ユーザー管理', 'BOM管理', 'パレット管理', '業務管理', 'ファイル管理', 'イベント管理', 'ドキュメント管理'];

export default function TablesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // フィルタリングとソート
  const filteredTables = demoTables
    .filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || table.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'records':
          comparison = a.records - b.records;
          break;
        case 'size':
          comparison = parseFloat(a.size) - parseFloat(b.size);
          break;
        case 'lastUpdated':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // ページネーション
  const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTables = filteredTables.slice(startIndex, endIndex);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getTotalStats = () => {
    return {
      totalTables: demoTables.length,
      totalRecords: demoTables.reduce((sum, table) => sum + table.records, 0),
      totalSize: demoTables.reduce((sum, table) => sum + parseFloat(table.size), 0)
    };
  };

  const stats = getTotalStats();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">テーブル一覧</h1>
          <p className="text-gray-600">データベース内の全テーブルを確認・管理</p>
        </div>
        <Link href="/manage/table/demo">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            デモトップに戻る
          </button>
        </Link>
      </div>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">総テーブル数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTables}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">総レコード数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecords.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Table className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">総サイズ</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSize.toFixed(1)} MB</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">最終更新</p>
              <p className="text-2xl font-bold text-gray-900">今日</p>
            </div>
          </div>
        </div>
      </div>

      {/* フィルターと検索 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="テーブル名または説明で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? '全カテゴリ' : category}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* テーブル一覧 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    テーブル名
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('category')}>
                  <div className="flex items-center gap-1">
                    カテゴリ
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('records')}>
                  <div className="flex items-center gap-1">
                    レコード数
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('size')}>
                  <div className="flex items-center gap-1">
                    サイズ
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カラム数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  インデックス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('lastUpdated')}>
                  <div className="flex items-center gap-1">
                    最終更新
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTables.map((table) => (
                <tr key={table.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{table.name}</div>
                      <div className="text-sm text-gray-500">{table.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {table.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.records.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.columns}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {table.indexes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {table.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <Link href={`/manage/table/demo/table-detail?table=${table.name}`}>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link href={`/manage/table/demo/data-search?table=${table.name}`}>
                        <button className="text-green-600 hover:text-green-900">
                          <Search className="w-4 h-4" />
                        </button>
                      </Link>
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
                  <span className="font-medium">{startIndex + 1}</span> から{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredTables.length)}</span> まで表示{' '}
                  <span className="font-medium">{filteredTables.length}</span> 件中
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
