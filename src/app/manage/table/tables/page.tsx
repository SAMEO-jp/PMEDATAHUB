'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Table, Eye, Database, Calendar, BarChart3, Download, RefreshCw } from 'lucide-react';
import { useTableAll, useTableListHelpers } from '@src/hooks/useTableData';
import { useDatabaseStats } from '@src/hooks/useStatisticsData';
import { TableView } from '@src/components/table/TableView';

export default function TablesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // 実データを取得
  const { data: tablesData, isLoading: isTablesLoading, error: tablesError } = useTableAll();
  const { data: statsData, isLoading: isStatsLoading } = useDatabaseStats();
  const { tables, getTotalRecords } = useTableListHelpers();
  
  // カテゴリを動的に生成
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    tables.forEach(table => {
      if (table.tags && table.tags.length > 0) {
        table.tags.forEach(tag => uniqueCategories.add(tag));
      }
    });
    return ['all', ...Array.from(uniqueCategories).sort()];
  }, [tables]);
  
  // フィルタリング
  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchesSearch = table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || 
                             (table.tags && table.tags.includes(categoryFilter));
      return matchesSearch && matchesCategory;
    });
  }, [tables, searchTerm, categoryFilter]);

  // TableView用のカラム定義
  const tableColumns = [
    {
      key: 'name',
      label: 'テーブル名',
      sortable: true,
      render: (value: string, row: any) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      )
    },
    {
      key: 'tags',
      label: 'タグ',
      sortable: false,
      render: (value: string[], row: any) => (
        <div className="flex flex-wrap gap-1">
          {(value || []).slice(0, 2).map(tag => (
            <span key={tag} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {tag}
            </span>
          ))}
          {value && value.length > 2 && (
            <span className="text-xs text-gray-500">+{value.length - 2}</span>
          )}
        </div>
      )
    },
    {
      key: 'records',
      label: 'レコード数',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => value?.toLocaleString() || '0'
    },
    {
      key: 'lastUpdated',
      label: '最終更新',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      render: (value: any, row: any) => (
        <div className="flex gap-2">
          <Link href={`/manage/table/detail/${encodeURIComponent(row.name)}`}>
            <button 
              className="text-blue-600 hover:text-blue-900 p-1"
              title="詳細を表示"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`/manage/table/search?table=${encodeURIComponent(row.name)}`}>
            <button 
              className="text-green-600 hover:text-green-900 p-1"
              title="データを検索"
            >
              <Search className="w-4 h-4" />
            </button>
          </Link>
        </div>
      )
    }
  ];

  const handleExport = () => {
    // テーブル一覧をCSVエクスポート
    const csvContent = [
      'テーブル名,説明,レコード数,最終更新,タグ',
      ...filteredTables.map(table => 
        `"${table.name}","${table.description}","${table.records}","${table.lastUpdated}","${(table.tags || []).join(', ')}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tables_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">テーブル一覧</h1>
          <p className="text-gray-600">データベース内の全テーブルを確認・管理</p>
        </div>
        <div className="flex gap-2">
          <Link href="/manage/table">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              管理画面に戻る
            </button>
          </Link>
          {(isTablesLoading || isStatsLoading) && (
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* 統計情報 */}
      {statsData ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Database className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総テーブル数</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.data?.totalTables}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総レコード数</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.data?.totalRecords?.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Table className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総サイズ</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.data?.totalSize}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">最大テーブル</p>
                <p className="text-lg font-bold text-gray-900">{statsData.data?.largestTable?.name || '-'}</p>
                <p className="text-xs text-gray-500">{statsData.data?.largestTable?.records?.toLocaleString()}件</p>
              </div>
            </div>
          </div>
        </div>
      ) : isStatsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
                  {category === 'all' ? '全タグ' : category}
                </option>
              ))}
            </select>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
              title="CSVエクスポート"
            >
              <Download className="w-4 h-4" />
              エクスポート
            </button>
          </div>
        </div>
        
        {filteredTables.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            {filteredTables.length}件のテーブルを表示中
            {searchTerm && ` (「${searchTerm}」で検索)`}
            {categoryFilter !== 'all' && ` (「${categoryFilter}」タグでフィルタ)`}
          </div>
        )}
      </div>

      {/* エラー表示 */}
      {tablesError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                テーブル情報の取得に失敗しました
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>データベース接続を確認してください。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* テーブル一覧 */}
      <TableView
        data={filteredTables}
        columns={tableColumns}
        loading={isTablesLoading}
        searchable={false} // 独自検索を使用するため無効
        paginated={true}
        pageSize={15}
        onRowClick={(row) => {
          // 行クリックでテーブル詳細に遷移
          window.location.href = `/manage/table/detail/${encodeURIComponent(row.name)}`;
        }}
        emptyMessage={
          searchTerm || categoryFilter !== 'all' 
            ? '検索条件に一致するテーブルが見つかりません' 
            : 'テーブルがありません'
        }
        className="mb-8"
      />

      {/* 関連リンク */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">関連機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/manage/table/sql">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                SQLエディタ
              </h4>
              <p className="text-sm text-gray-600">カスタムクエリでデータを検索・分析</p>
            </div>
          </Link>
          <Link href="/manage/table/statistics">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                データベース統計
              </h4>
              <p className="text-sm text-gray-600">テーブルサイズや成長率を分析</p>
            </div>
          </Link>
          <Link href="/manage/table/search">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-600" />
                データ検索
              </h4>
              <p className="text-sm text-gray-600">条件を指定してデータを絞り込み</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}