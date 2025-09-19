'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database, ArrowLeft, History, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { SqlEditor } from '@src/components/sql/SqlEditor';
import { useSqlEditor, useQueryHistoryManager } from '@src/hooks/useSqlData';

export default function SqlExecutorPage() {
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  
  // SQLエディタのロジックを取得
  const {
    query,
    setQuery,
    selectedQuery,
    isExecuting,
    executionResult,
    executionError,
    history,
    isHistoryLoading,
    executeQuery,
    selectHistoryQuery,
    clearQuery,
    hasQuery,
    hasResult,
    hasError,
  } = useSqlEditor();
  
  // クエリ履歴管理
  const {
    history: fullHistory,
    total: totalQueries,
    currentPage,
    totalPages,
    goToPage,
    refreshHistory,
    hasNextPage,
    hasPreviousPage
  } = useQueryHistoryManager();

  const handleExecuteQuery = async () => {
    await executeQuery();
  };

  const handleSelectHistoryQuery = (historyQuery: string) => {
    selectHistoryQuery(historyQuery);
    setShowHistoryPanel(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              戻る
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL実行エディタ</h1>
            <p className="text-gray-600">データベースに対してSQLクエリを実行</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 統計表示 */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Database className="w-4 h-4" />
              <span>実行回数: {totalQueries}</span>
            </div>
            <div className="flex items-center gap-1">
              <History className="w-4 h-4" />
              <span>履歴: {fullHistory.length}件</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowHistoryPanel(!showHistoryPanel)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              showHistoryPanel 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <History className="w-4 h-4" />
            履歴パネル
          </button>
        </div>
      </div>

      {/* セキュリティ注意事項 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-800">セキュリティ注意事項</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>セキュリティのため、SELECT文のみ実行可能です</li>
                <li>UPDATE、DELETE、DROP等のデータ変更クエリは実行できません</li>
                <li>結果は最大1000件まで表示されます</li>
                <li>長時間実行されるクエリは自動的にタイムアウトします</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="lg:col-span-2">
          {/* SQLエディタ */}
          <SqlEditor
            onExecuteQuery={handleExecuteQuery}
            executionResult={executionResult?.data}
            isExecuting={isExecuting}
            executionError={executionError}
            history={history}
            onSelectHistoryQuery={handleSelectHistoryQuery}
          />
        </div>

        {/* サイドパネル: クエリ履歴 */}
        {showHistoryPanel && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">クエリ履歴</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={refreshHistory}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="履歴を更新"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowHistoryPanel(false)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                      title="パネルを閉じる"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {fullHistory.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>履歴がありません</p>
                    <p className="text-sm">クエリを実行すると履歴が表示されます</p>
                  </div>
                ) : (
                  fullHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectHistoryQuery(item.query)}
                      className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-gray-900 truncate">
                            {item.query}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{item.executedAt}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.executionTime.toFixed(3)}秒
                            </span>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {item.success ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-3 h-3" />
                              <span className="text-xs">{item.result}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="w-3 h-3" />
                              <span className="text-xs">エラー</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {totalQueries}件中 {Math.min((currentPage * 20) + 1, totalQueries)} - {Math.min((currentPage + 1) * 20, totalQueries)}件
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={!hasPreviousPage}
                        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                      >
                        前
                      </button>
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={!hasNextPage}
                        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                      >
                        次
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 実行結果サマリー */}
      {(hasResult || hasError) && (
        <div className="mt-6">
          <div className={`rounded-lg p-4 ${
            hasError 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center">
              {hasError ? (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">クエリ実行エラー</h3>
                    <p className="text-sm text-red-700 mt-1">{executionError?.message}</p>
                  </div>
                </>
              ) : executionResult && (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-semibold text-green-800">クエリ実行完了</h3>
                    <div className="flex items-center gap-4 text-sm text-green-700 mt-1">
                      <span>{executionResult.data?.rowCount}件取得</span>
                      <span>実行時間: {executionResult.data?.executionTime.toFixed(3)}秒</span>
                      <span>カラム数: {executionResult.data?.columns?.length}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ヘルプセクション */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">SQLクエリのヒント</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">よく使用されるクエリ</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• テーブル一覧: <code className="bg-gray-100 px-1 rounded">SHOW TABLES</code></li>
              <li>• テーブル構造: <code className="bg-gray-100 px-1 rounded">DESCRIBE table_name</code></li>
              <li>• レコード数: <code className="bg-gray-100 px-1 rounded">SELECT COUNT(*) FROM table_name</code></li>
              <li>• サンプルデータ: <code className="bg-gray-100 px-1 rounded">SELECT * FROM table_name LIMIT 10</code></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">キーボードショートカット</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• クエリ実行: <kbd className="bg-gray-100 px-1 rounded">Ctrl + Enter</kbd></li>
              <li>• クエリクリア: エディタ上の「クリア」ボタン</li>
              <li>• 履歴選択: 履歴パネルから選択</li>
              <li>• テンプレート: エディタ下のボタンから選択</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}