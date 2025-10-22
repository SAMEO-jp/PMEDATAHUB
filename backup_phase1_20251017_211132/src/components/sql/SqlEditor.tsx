'use client';

/**
 * @file SQLエディタコンポーネント
 * SQLクエリの入力・実行・結果表示機能を提供
 */

import { useState, useRef, useEffect } from 'react';
import { Play, History, Check, AlertCircle, FileText, Clock, RotateCcw } from 'lucide-react';
import { TableView } from '../table/TableView';

interface SqlExecutionResult {
  query: string;
  columns: string[];
  rows: any[];
  rowCount: number;
  executionTime: number;
  executedAt: string;
}

interface QueryHistoryItem {
  id: number;
  query: string;
  result: string;
  executionTime: number;
  executedAt: string;
  success: boolean;
  error?: string;
}

interface SqlEditorProps {
  onExecuteQuery: (query: string) => Promise<void>;
  executionResult?: SqlExecutionResult | null;
  isExecuting?: boolean;
  executionError?: any;
  history?: QueryHistoryItem[];
  onSelectHistoryQuery?: (query: string) => void;
  className?: string;
}

export function SqlEditor({
  onExecuteQuery,
  executionResult,
  isExecuting = false,
  executionError,
  history = [],
  onSelectHistoryQuery,
  className = ''
}: SqlEditorProps) {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleExecute = async () => {
    if (!query.trim() || isExecuting) return;
    
    setValidationResult(null);
    await onExecuteQuery(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleExecute();
    }
  };

  const handleSelectTemplate = (templateQuery: string) => {
    setQuery(templateQuery);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSelectHistory = (historyItem: QueryHistoryItem) => {
    setQuery(historyItem.query);
    onSelectHistoryQuery?.(historyItem.query);
    setShowHistory(false);
  };

  const clearQuery = () => {
    setQuery('');
    setValidationResult(null);
  };

  // テーブル用のカラム定義（実行結果表示用）
  const resultColumns = executionResult?.columns?.map(col => ({
    key: col,
    label: col,
    sortable: true,
    width: '150px'
  })) || [];

  // よく使用されるSQLテンプレート
  const templates = [
    {
      name: 'テーブル一覧',
      query: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"
    },
    {
      name: 'テーブル構造',
      query: "PRAGMA table_info(テーブル名);"
    },
    {
      name: 'レコード数確認',
      query: "SELECT COUNT(*) as count FROM テーブル名;"
    },
    {
      name: 'サンプルデータ',
      query: "SELECT * FROM テーブル名 LIMIT 10;"
    },
    {
      name: '最新データ',
      query: "SELECT * FROM テーブル名 ORDER BY rowid DESC LIMIT 10;"
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* SQLエディタ部分 */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">SQLエディタ</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1"
              >
                <History className="w-4 h-4" />
                履歴
              </button>
              <button
                onClick={clearQuery}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                クリア
              </button>
              <button
                onClick={handleExecute}
                disabled={!query.trim() || isExecuting}
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExecuting ? (
                  <>
                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    実行中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    実行 (Ctrl+Enter)
                  </>
                )}
              </button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="SQLクエリを入力してください..."
            className="w-full min-h-[120px] max-h-[400px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
          />
        </div>

        {/* SQLテンプレート */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 mb-2">よく使用するクエリ:</p>
          <div className="flex flex-wrap gap-2">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleSelectTemplate(template.query)}
                className="px-2 py-1 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* 実行結果情報 */}
        {(executionResult || executionError) && (
          <div className="px-4 py-3 border-b border-gray-200">
            {executionError ? (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">エラー:</span>
                <span className="text-sm">{executionError.message}</span>
              </div>
            ) : executionResult && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>{executionResult.rowCount}件取得</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{executionResult.executionTime.toFixed(3)}秒</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  実行日時: {new Date(executionResult.executedAt).toLocaleString('ja-JP')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* クエリ履歴 */}
      {showHistory && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">クエリ履歴</h3>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {history.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                履歴がありません
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-mono text-gray-900 line-clamp-2">
                        {item.query}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{item.executedAt}</span>
                        <span>{item.executionTime.toFixed(3)}秒</span>
                        {item.success ? (
                          <span className="text-green-600">{item.result}</span>
                        ) : (
                          <span className="text-red-600">エラー</span>
                        )}
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 実行結果テーブル */}
      {executionResult && !executionError && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <h3 className="text-lg font-semibold">実行結果</h3>
            </div>
          </div>
          
          <TableView
            data={executionResult.rows}
            columns={resultColumns}
            searchable={true}
            paginated={true}
            pageSize={20}
            emptyMessage="結果がありません"
            className="border-0 shadow-none"
          />
        </div>
      )}
    </div>
  );
}