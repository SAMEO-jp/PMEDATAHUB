'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database, Table, Search, BarChart3, Code, Eye, Settings, Plus } from 'lucide-react';

// デモデータ
const demoTableStats = [
  {
    name: 'PROJECT',
    records: 1250,
    size: '2.3 MB',
    lastUpdated: '2025-01-15',
    description: 'プロジェクト基本情報'
  },
  {
    name: 'USER',
    records: 89,
    size: '156 KB',
    lastUpdated: '2025-01-14',
    description: 'ユーザー情報'
  },
  {
    name: 'BOM_BUHIN',
    records: 15420,
    size: '8.7 MB',
    lastUpdated: '2025-01-15',
    description: 'BOM部品情報'
  },
  {
    name: 'PALET_MASTER',
    records: 3420,
    size: '4.2 MB',
    lastUpdated: '2025-01-13',
    description: 'パレットマスタ情報'
  },
  {
    name: 'business_achievements',
    records: 5670,
    size: '3.1 MB',
    lastUpdated: '2025-01-15',
    description: '業務実績データ'
  },
  {
    name: 'photos',
    records: 2340,
    size: '12.8 MB',
    lastUpdated: '2025-01-12',
    description: '写真メタデータ'
  }
];

const recentQueries = [
  {
    id: 1,
    query: 'SELECT COUNT(*) FROM PROJECT WHERE PROJECT_STATUS = "進行中"',
    result: '45件',
    executedAt: '2025-01-15 14:30'
  },
  {
    id: 2,
    query: 'SELECT * FROM USER WHERE company = "新日鉄住金" LIMIT 10',
    result: '10件',
    executedAt: '2025-01-15 13:45'
  },
  {
    id: 3,
    query: 'SELECT PROJECT_NAME, COUNT(*) as member_count FROM PROJECT_MEMBERS GROUP BY PROJECT_ID',
    result: '67件',
    executedAt: '2025-01-15 12:20'
  }
];

export default function DatabaseDemoPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTables = demoTableStats.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          データベース管理システム デモ
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          データベースのテーブル確認・データ検索・SQL実行機能
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/manage">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              管理画面に戻る
            </button>
          </Link>
        </div>
      </div>

      {/* デモページ一覧 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🗄️</span>
          データベース管理機能一覧
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/manage/table/demo/tables">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                <Table className="w-4 h-4" />
                DB-001: テーブル一覧
              </h3>
              <p className="text-sm text-gray-600 mb-3">データベース内の全テーブルを確認・検索</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Database className="w-3 h-3" />
                テーブル構造・レコード数・サイズ情報
              </div>
            </div>
          </Link>

          <Link href="/manage/table/demo/table-detail">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                DB-002: テーブル詳細
              </h3>
              <p className="text-sm text-gray-600 mb-3">特定テーブルの構造とデータを詳細表示</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Table className="w-3 h-3" />
                カラム情報・サンプルデータ・インデックス
              </div>
            </div>
          </Link>

          <Link href="/manage/table/demo/data-search">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-purple-600 mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                DB-003: データ検索
              </h3>
              <p className="text-sm text-gray-600 mb-3">テーブル内のデータを検索・フィルタリング</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Search className="w-3 h-3" />
                条件検索・ソート・ページネーション
              </div>
            </div>
          </Link>

          <Link href="/manage/table/demo/sql-executor">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-orange-600 mb-2 flex items-center gap-2">
                <Code className="w-4 h-4" />
                DB-004: SQL実行
              </h3>
              <p className="text-sm text-gray-600 mb-3">カスタムSQLクエリを実行・結果確認</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Code className="w-3 h-3" />
                SQLエディタ・実行履歴・結果エクスポート
              </div>
            </div>
          </Link>

          <Link href="/manage/table/demo/statistics">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                DB-005: データベース統計
              </h3>
              <p className="text-sm text-gray-600 mb-3">データベースの統計情報とパフォーマンス</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <BarChart3 className="w-3 h-3" />
                テーブルサイズ・レコード数・成長率
              </div>
            </div>
          </Link>

          <Link href="/manage/table/demo/settings">
            <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-semibold text-indigo-600 mb-2 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                DB-006: 管理設定
              </h3>
              <p className="text-sm text-gray-600 mb-3">データベース管理の設定とオプション</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Settings className="w-3 h-3" />
                バックアップ・ログ設定・権限管理
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* データベース概要 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* テーブル統計 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            データベース概要
          </h2>
          
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="テーブル名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTables.map((table) => (
              <div key={table.name} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{table.name}</h3>
                    <p className="text-sm text-gray-600">{table.description}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-gray-900">{table.records.toLocaleString()} レコード</div>
                    <div className="text-gray-500">{table.size}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  最終更新: {table.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近のクエリ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            最近実行されたクエリ
          </h2>
          
          <div className="space-y-3">
            {recentQueries.map((query) => (
              <div key={query.id} className="border border-gray-200 rounded-lg p-3">
                <div className="text-sm font-mono bg-gray-100 p-2 rounded mb-2 text-xs">
                  {query.query}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600 font-semibold">結果: {query.result}</span>
                  <span className="text-gray-500">{query.executedAt}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Link href="/manage/table/demo/sql-executor">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                新しいクエリを実行
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* クイックアクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/manage/table/demo/tables">
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Table className="w-4 h-4" />
              テーブル一覧を表示
            </button>
          </Link>
          <Link href="/manage/table/demo/sql-executor">
            <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
              <Code className="w-4 h-4" />
              SQLエディタを開く
            </button>
          </Link>
          <Link href="/manage/table/demo/statistics">
            <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              統計情報を確認
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
