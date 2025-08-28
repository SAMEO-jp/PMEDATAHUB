'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Save, History, Download, Copy, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// デモデータ
const sampleQueries = [
  {
    name: 'プロジェクト一覧',
    query: 'SELECT PROJECT_ID, PROJECT_NAME, PROJECT_STATUS, PROJECT_CLIENT_NAME FROM PROJECT LIMIT 10;',
    category: 'SELECT'
  },
  {
    name: '進行中のプロジェクト数',
    query: 'SELECT COUNT(*) as count FROM PROJECT WHERE PROJECT_STATUS = "進行中";',
    category: 'COUNT'
  },
  {
    name: 'ユーザー一覧',
    query: 'SELECT user_id, name_japanese, company, bumon FROM USER LIMIT 10;',
    category: 'SELECT'
  },
  {
    name: 'BOM部品数',
    query: 'SELECT COUNT(*) as count FROM BOM_BUHIN;',
    category: 'COUNT'
  },
  {
    name: 'プロジェクト別レコード数',
    query: `SELECT 
  'PROJECT' as table_name, COUNT(*) as record_count FROM PROJECT
UNION ALL
SELECT 'USER', COUNT(*) FROM USER
UNION ALL
SELECT 'BOM_BUHIN', COUNT(*) FROM BOM_BUHIN;`,
    category: 'UNION'
  }
];

const queryHistory = [
  {
    id: 1,
    query: 'SELECT COUNT(*) FROM PROJECT WHERE PROJECT_STATUS = "進行中"',
    result: '45件',
    status: 'success',
    executionTime: '0.023s',
    executedAt: '2025-01-15 14:30:25'
  },
  {
    id: 2,
    query: 'SELECT * FROM USER WHERE company = "新日鉄住金" LIMIT 10',
    result: '10件',
    status: 'success',
    executionTime: '0.015s',
    executedAt: '2025-01-15 13:45:12'
  },
  {
    id: 3,
    query: 'SELECT PROJECT_NAME, COUNT(*) as member_count FROM PROJECT_MEMBERS GROUP BY PROJECT_ID',
    result: '67件',
    status: 'success',
    executionTime: '0.034s',
    executedAt: '2025-01-15 12:20:45'
  },
  {
    id: 4,
    query: 'SELECT * FROM NON_EXISTENT_TABLE',
    result: 'エラー: テーブルが存在しません',
    status: 'error',
    executionTime: '0.001s',
    executedAt: '2025-01-15 11:15:30'
  }
];

// デモ実行結果
const demoResults = {
  'SELECT PROJECT_ID, PROJECT_NAME, PROJECT_STATUS, PROJECT_CLIENT_NAME FROM PROJECT LIMIT 10;': {
    columns: ['PROJECT_ID', 'PROJECT_NAME', 'PROJECT_STATUS', 'PROJECT_CLIENT_NAME'],
    data: [
      ['E923BXX215000', '君津２高炉BP水素吹き込み対応', '進行中', '新日鉄住金'],
      ['E924CXX216000', '名古屋製鉄所設備更新', '企画中', '新日鉄住金'],
      ['E925DXX217000', '八幡製鉄所自動化システム', '完了', '新日鉄住金'],
      ['E926EXX218000', '千葉製鉄所環境対策', '一時停止', '新日鉄住金'],
      ['E927FXX219000', '室蘭製鉄所設備点検', '進行中', '新日鉄住金']
    ],
    rowCount: 5,
    executionTime: '0.023s'
  },
  'SELECT COUNT(*) as count FROM PROJECT WHERE PROJECT_STATUS = "進行中";': {
    columns: ['count'],
    data: [['45']],
    rowCount: 1,
    executionTime: '0.015s'
  },
  'SELECT user_id, name_japanese, company, bumon FROM USER LIMIT 10;': {
    columns: ['user_id', 'name_japanese', 'company', 'bumon'],
    data: [
      ['U001', '田中太郎', '新日鉄住金', '技術部'],
      ['U002', '佐藤花子', '新日鉄住金', '開発部'],
      ['U003', '鈴木一郎', '新日鉄住金', '設計部'],
      ['U004', '高橋次郎', '新日鉄住金', '品質管理部'],
      ['U005', '渡辺三郎', '新日鉄住金', '製造部']
    ],
    rowCount: 5,
    executionTime: '0.018s'
  }
};

export default function SQLExecutorPage() {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return;

    setIsExecuting(true);
    
    // デモ用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));

    // デモ結果を返す
    const result = demoResults[sqlQuery as keyof typeof demoResults];
    if (result) {
      setQueryResult({
        ...result,
        status: 'success'
      });
    } else {
      setQueryResult({
        status: 'error',
        error: 'デモモード: このクエリの結果は表示されません',
        executionTime: '0.001s'
      });
    }

    setIsExecuting(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportToCSV = () => {
    if (!queryResult || queryResult.status !== 'success') return;

    const csvContent = [
      queryResult.columns.join(','),
      ...queryResult.data.map((row: any[]) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'query_result.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const insertSampleQuery = (query: string) => {
    setSqlQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ヘッダー */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/manage/table/demo">
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SQL実行</h1>
            <p className="text-gray-600">カスタムSQLクエリを実行・結果確認</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            実行履歴
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインコンテンツ */}
        <div className="lg:col-span-2 space-y-6">
          {/* SQLエディタ */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-2">SQLクエリ</h2>
              <div className="flex gap-2">
                <button
                  onClick={executeQuery}
                  disabled={isExecuting || !sqlQuery.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isExecuting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" />
                      実行中...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      実行
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(sqlQuery)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'コピー完了' : 'コピー'}
                </button>
                <button
                  onClick={() => setSqlQuery('')}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  クリア
                </button>
              </div>
            </div>
            <div className="p-4">
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="SQLクエリを入力してください..."
                className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* 実行結果 */}
          {queryResult && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200 p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">実行結果</h2>
                  <div className="flex items-center gap-4">
                    {queryResult.status === 'success' && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>実行時間: {queryResult.executionTime}</span>
                        <span>•</span>
                        <span>{queryResult.rowCount} 行</span>
                      </div>
                    )}
                    {queryResult.status === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>エラー</span>
                      </div>
                    )}
                    {queryResult.status === 'success' && (
                      <button
                        onClick={exportToCSV}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        CSV出力
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                {queryResult.status === 'success' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          {queryResult.columns.map((column: string, index: number) => (
                            <th key={index} className="border border-gray-300 px-3 py-2 text-left font-medium text-sm">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.data.map((row: any[], rowIndex: number) => (
                          <tr key={rowIndex} className="hover:bg-gray-50">
                            {row.map((cell: any, cellIndex: number) => (
                              <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">エラー</span>
                    </div>
                    <p className="text-red-700 mt-2">{queryResult.error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* サンプルクエリ */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">サンプルクエリ</h3>
            <div className="space-y-2">
              {sampleQueries.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => insertSampleQuery(sample.query)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{sample.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{sample.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 実行履歴 */}
          {showHistory && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">実行履歴</h3>
              <div className="space-y-3">
                {queryHistory.map((history) => (
                  <div key={history.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm font-mono bg-gray-100 p-2 rounded mb-2 text-xs">
                      {history.query}
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className={`font-semibold ${
                        history.status === 'success' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {history.result}
                      </span>
                      <span className="text-gray-500">{history.executionTime}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {history.executedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ヒント */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2 text-blue-900">ヒント</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• SELECT文でデータを取得できます</li>
              <li>• LIMIT句で結果を制限できます</li>
              <li>• WHERE句で条件を指定できます</li>
              <li>• ORDER BY句でソートできます</li>
              <li>• デモモードでは一部のクエリのみ結果を表示</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
