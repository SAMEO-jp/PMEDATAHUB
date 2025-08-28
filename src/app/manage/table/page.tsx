'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database, Table, Search, BarChart3, Code, Eye, Settings, RefreshCw } from 'lucide-react';
import { useTableAll } from '@src/hooks/useTableData';
import { useQueryHistory } from '@src/hooks/useSqlData';
import { useDatabaseStats } from '@src/hooks/useStatisticsData';

export default function DatabaseManagePage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 実データを取得
  const { data: tablesData, isLoading: isTablesLoading, error: tablesError } = useTableAll();
  const { data: historyData, isLoading: isHistoryLoading } = useQueryHistory(3); // 最新3件
  const { data: statsData, isLoading: isStatsLoading } = useDatabaseStats();
  
  const tables = tablesData?.data || [];
  const recentQueries = historyData?.data?.history || [];
  
  // テーブル検索フィルタリング
  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    table.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          データベース管理システム
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          データベースのテーブル確認・データ検索・SQL実行機能
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/manage">
            <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
              管理画面に戻る
            </button>
          </Link>
          {(isTablesLoading || isHistoryLoading || isStatsLoading) && (
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">データ読み込み中...</span>
            </div>
          )}
        </div>
      </div>

      {/* データベース管理機能一覧 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-2xl">🗄️</span>
          データベース管理機能一覧
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/manage/table/tables">
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

          <Link href="/manage/table/detail">
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

          <Link href="/manage/table/search">
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

          <Link href="/manage/table/sql">
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

          <Link href="/manage/table/statistics">
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

          <Link href="/manage/table/settings">
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
            {statsData?.data && (
              <span className="text-sm font-normal text-gray-500">
                ({statsData.data.totalTables || 0}テーブル, {statsData.data.totalRecords?.toLocaleString() || 0}レコード)
              </span>
            )}
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

          {isTablesLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tablesError ? (
            <div className="text-center py-4 text-red-600">
              <p>テーブル情報の取得に失敗しました</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTables.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  {searchTerm ? '検索結果が見つかりません' : 'テーブルがありません'}
                </div>
              ) : (
                filteredTables.map((table) => (
                  <Link
                    key={table.name}
                    href={`/manage/table/detail/${encodeURIComponent(table.name)}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:bg-gray-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{table.name}</h3>
                        <p className="text-sm text-gray-600">{table.description}</p>
                        {table.tags && table.tags.length > 0 && (
                          <div className="flex gap-1 mt-1">
                            {table.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-900">{table.records?.toLocaleString()} レコード</div>
                        <div className="text-gray-500">サイズ情報</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      最終更新: {table.lastUpdated}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* 最近のクエリ */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            最近実行されたクエリ
          </h2>
          
          {isHistoryLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse border border-gray-200 rounded-lg p-3">
                  <div className="h-16 bg-gray-200 rounded mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {recentQueries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>まだクエリが実行されていません</p>
                  <p className="text-sm">SQLエディタでクエリを実行してみましょう</p>
                </div>
              ) : (
                recentQueries.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm font-mono bg-gray-100 p-2 rounded mb-2 text-xs overflow-x-auto">
                      {query.query}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`font-semibold ${query.success ? 'text-green-600' : 'text-red-600'}`}>
                        結果: {query.result}
                      </span>
                      <span className="text-gray-500">{query.executedAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="mt-4">
            <Link href="/manage/table/sql">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                新しいクエリを実行
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* データベース統計サマリー */}
      {statsData?.data && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            データベース統計サマリー
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-600 text-sm font-medium">総容量</div>
              <div className="text-2xl font-bold text-blue-800">{statsData.data.totalSize}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-green-600 text-sm font-medium">最大テーブル</div>
              <div className="text-lg font-bold text-green-800">{statsData.data.largestTable?.name}</div>
              <div className="text-sm text-green-600">{statsData.data.largestTable?.records.toLocaleString()}件</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-yellow-600 text-sm font-medium">平均クエリ時間</div>
              <div className="text-2xl font-bold text-yellow-800">{statsData.data.performance?.avgQueryTime.toFixed(3)}秒</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-600 text-sm font-medium">実行クエリ数</div>
              <div className="text-2xl font-bold text-purple-800">{statsData.data.performance?.totalQueries}</div>
            </div>
          </div>
        </div>
      )}

      {/* クイックアクション */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">クイックアクション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/manage/table/tables">
            <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Table className="w-4 h-4" />
              テーブル一覧を表示
            </button>
          </Link>
          <Link href="/manage/table/sql">
            <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
              <Code className="w-4 h-4" />
              SQLエディタを開く
            </button>
          </Link>
          <Link href="/manage/table/statistics">
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