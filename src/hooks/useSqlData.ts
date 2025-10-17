/**
 * @file SQL実行用カスタムフック
 * tRPCのSQL実行機能をカスタマイズしたフック
 */

import { useState } from 'react';
import { trpc } from '@src/lib/trpc/client';

/**
 * SQL実行用フック
 */
export const useSqlExecution = () => {
  const utils = trpc.useUtils();
  
  const executeMutation = trpc.sql.executeQuery.useMutation({
    onSuccess: () => {
      // 実行後にクエリ履歴を無効化してリフレッシュ
      void utils.sql.getQueryHistory.invalidate();
    },
    onError: (error) => {
      console.error('SQL実行エラー:', error);
    }
  });
  
  return {
    executeQuery: executeMutation.mutate,
    executeQueryAsync: executeMutation.mutateAsync,
    isExecuting: executeMutation.isPending,
    executionResult: executeMutation.data,
    executionError: executeMutation.error,
    resetExecution: executeMutation.reset,
  };
};

/**
 * クエリ履歴取得用フック
 */
export const useQueryHistory = (limit = 20, offset = 0, autoRefresh = false) => {
  return trpc.sql.getQueryHistory.useQuery(
    { limit, offset },
    {
      staleTime: autoRefresh ? 30 * 1000 : 5 * 60 * 1000, // 自動リフレッシュ時は30秒、通常は5分
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchInterval: autoRefresh ? 30 * 1000 : undefined, // 自動リフレッシュ時は30秒間隔
    }
  );
};

/**
 * SQL検証用フック
 */
export const useSqlValidation = () => {
  return trpc.sql.validateQuery.useQuery;
};

/**
 * SQL実行計画取得用フック
 */
export const useSqlExecutionPlan = () => {
  return trpc.sql.getExecutionPlan.useQuery;
};

/**
 * SQLエディタ用統合フック
 * エディタに必要な機能をまとめたフック
 */
export const useSqlEditor = () => {
  const [query, setQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  
  const {
    executeQuery,
    executeQueryAsync,
    isExecuting,
    executionResult,
    executionError,
    resetExecution
  } = useSqlExecution();
  
  const { data: history, isLoading: isHistoryLoading } = useQueryHistory(10);
  
  const validateQuery = useSqlValidation();
  const getExecutionPlan = useSqlExecutionPlan();
  
  // クエリを実行
  const handleExecuteQuery = async () => {
    if (!query.trim()) {
      return;
    }
    
    try {
      await executeQueryAsync({
        query: query.trim(),
        limit: 100
      });
    } catch (error) {
      console.error('クエリ実行に失敗:', error);
    }
  };
  
  // 履歴からクエリを選択
  const handleSelectHistoryQuery = (historyQuery: string) => {
    setQuery(historyQuery);
    setSelectedQuery(historyQuery);
  };
  
  // クエリをクリア
  const handleClearQuery = () => {
    setQuery('');
    setSelectedQuery(null);
    resetExecution();
  };
  
  // クエリを検証
  const handleValidateQuery = async () => {
    if (!query.trim()) return null;
    
    try {
      const result = await validateQuery({ query: query.trim() });
      return result;
    } catch (error) {
      console.error('クエリ検証に失敗:', error);
      return null;
    }
  };
  
  // 実行計画を取得
  const handleGetExecutionPlan = async () => {
    if (!query.trim()) return null;
    
    try {
      const result = await getExecutionPlan({ query: query.trim() });
      return result;
    } catch (error) {
      console.error('実行計画の取得に失敗:', error);
      return null;
    }
  };
  
  return {
    // 状態
    query,
    setQuery,
    selectedQuery,
    isExecuting,
    executionResult,
    executionError,
    history: history?.data?.history || [],
    isHistoryLoading,
    
    // アクション
    executeQuery: handleExecuteQuery,
    selectHistoryQuery: handleSelectHistoryQuery,
    clearQuery: handleClearQuery,
    validateQuery: handleValidateQuery,
    getExecutionPlan: handleGetExecutionPlan,
    
    // ユーティリティ
    hasQuery: !!query.trim(),
    hasResult: !!executionResult,
    hasError: !!executionError,
  };
};

/**
 * クエリ履歴管理用フック
 */
export const useQueryHistoryManager = () => {
  const utils = trpc.useUtils();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  
  const { data: historyData, isLoading, error } = useQueryHistory(
    pageSize,
    currentPage * pageSize
  );
  
  const refreshHistory = () => {
    void utils.sql.getQueryHistory.invalidate();
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };
  
  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // ページサイズ変更時は最初のページに戻る
  };
  
  const totalPages = historyData?.data?.total ? 
    Math.ceil(historyData.data.total / pageSize) : 0;
  
  return {
    history: historyData?.data?.history || [],
    total: historyData?.data?.total || 0,
    currentPage,
    pageSize,
    totalPages,
    isLoading,
    error,
    goToPage,
    changePageSize,
    refreshHistory,
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0,
  };
};

/**
 * よく使用されるクエリテンプレート
 */
export const useSqlTemplates = () => {
  const templates = {
    tableList: 'SELECT name FROM sqlite_master WHERE type=\'table\' ORDER BY name;',
    tableSchema: (tableName: string) => `PRAGMA table_info(${tableName});`,
    recordCount: (tableName: string) => `SELECT COUNT(*) as count FROM ${tableName};`,
    sampleData: (tableName: string) => `SELECT * FROM ${tableName} LIMIT 10;`,
    recentData: (tableName: string) => `SELECT * FROM ${tableName} ORDER BY rowid DESC LIMIT 10;`,
  };
  
  const getTemplate = (type: keyof typeof templates, ...args: string[]) => {
    const template = templates[type];
    return typeof template === 'function' ? (template as (...args: string[]) => string)(...args) : template;
  };
  
  return {
    templates,
    getTemplate,
    templateNames: Object.keys(templates) as Array<keyof typeof templates>,
  };
};