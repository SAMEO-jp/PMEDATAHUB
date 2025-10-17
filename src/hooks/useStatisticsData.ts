/**
 * @file 統計情報用カスタムフック
 * データベース統計やパフォーマンス情報を管理するフック
 */

import { useState } from 'react';
import { trpc } from '@src/lib/trpc/client';

/**
 * データベース統計情報を取得するフック
 */
export const useDatabaseStats = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  return trpc.statistics.getDatabaseStats.useQuery(
    { period },
    {
      staleTime: 2 * 60 * 1000, // 2分間キャッシュ
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * テーブルサイズ情報を取得するフック
 */
export const useTableSizes = (
  limit = 20,
  sortBy: 'name' | 'size' | 'records' = 'size',
  order: 'asc' | 'desc' = 'desc'
) => {
  return trpc.statistics.getTableSizes.useQuery(
    { limit, sortBy, order },
    {
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * 成長率分析を取得するフック
 */
export const useGrowthRates = (
  period: 'week' | 'month' | 'quarter' | 'year' = 'month',
  tableName?: string,
  limit = 10
) => {
  return trpc.statistics.getGrowthRates.useQuery(
    { period, tableName, limit },
    {
      staleTime: 10 * 60 * 1000, // 10分間キャッシュ
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * パフォーマンス統計を取得するフック
 */
export const usePerformanceStats = (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  return trpc.statistics.getPerformanceStats.useQuery(
    { period },
    {
      staleTime: 60 * 1000, // 1分間キャッシュ
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * 統計ダッシュボード用統合フック
 */
export const useStatisticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [selectedTable, setSelectedTable] = useState<string | undefined>(undefined);
  
  const {
    data: databaseStats,
    isLoading: isDatabaseStatsLoading,
    error: databaseStatsError
  } = useDatabaseStats(selectedPeriod);
  
  const {
    data: tableSizes,
    isLoading: isTableSizesLoading,
    error: tableSizesError
  } = useTableSizes(20, 'size', 'desc');
  
  const {
    data: growthRates,
    isLoading: isGrowthRatesLoading,
    error: growthRatesError
  } = useGrowthRates(selectedPeriod === 'day' ? 'week' : selectedPeriod as 'year' | 'week' | 'month' | 'quarter', selectedTable);
  
  const {
    data: performanceStats,
    isLoading: isPerformanceStatsLoading,
    error: performanceStatsError
  } = usePerformanceStats(selectedPeriod);
  
  const utils = trpc.useUtils();
  
  const refreshAllStats = () => {
    void utils.statistics.getDatabaseStats.invalidate();
    void utils.statistics.getTableSizes.invalidate();
    void utils.statistics.getGrowthRates.invalidate();
    void utils.statistics.getPerformanceStats.invalidate();
  };
  
  const isLoading = isDatabaseStatsLoading || isTableSizesLoading || 
                   isGrowthRatesLoading || isPerformanceStatsLoading;
  
  const hasError = databaseStatsError || tableSizesError || 
                   growthRatesError || performanceStatsError;
  
  return {
    // データ
    databaseStats: databaseStats?.data,
    tableSizes: tableSizes?.data,
    growthRates: growthRates?.data,
    performanceStats: performanceStats?.data,
    
    // 状態
    selectedPeriod,
    selectedTable,
    isLoading,
    hasError,
    
    // アクション
    setSelectedPeriod,
    setSelectedTable,
    refreshAllStats,
    
    // 個別エラー
    errors: {
      databaseStats: databaseStatsError,
      tableSizes: tableSizesError,
      growthRates: growthRatesError,
      performanceStats: performanceStatsError,
    }
  };
};

/**
 * テーブルサイズ管理用フック
 */
export const useTableSizeManager = () => {
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'records'>('size');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pageSize, setPageSize] = useState(20);
  
  const { data: tableSizes, isLoading, error } = useTableSizes(pageSize, sortBy, sortOrder);
  
  const handleSort = (newSortBy: 'name' | 'size' | 'records') => {
    if (newSortBy === sortBy) {
      // 同じカラムをクリックした場合はソート順を反転
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // 異なるカラムをクリックした場合は新しいソートキーを設定
      setSortBy(newSortBy);
      setSortOrder('desc'); // デフォルトは降順
    }
  };
  
  const getTopTables = (limit: number) => {
    return tableSizes?.data?.tables?.slice(0, limit) || [];
  };
  
  const getTotalSize = () => {
    return tableSizes?.data?.summary?.totalDataSize || '0 KB';
  };
  
  const getTotalRecords = () => {
    return tableSizes?.data?.summary?.totalRecords || 0;
  };
  
  return {
    tables: tableSizes?.data?.tables || [],
    summary: tableSizes?.data?.summary,
    sortBy,
    sortOrder,
    pageSize,
    isLoading,
    error,
    handleSort,
    setPageSize,
    getTopTables,
    getTotalSize,
    getTotalRecords,
  };
};

/**
 * 成長率分析用フック
 */
export const useGrowthAnalysis = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [focusedTable, setFocusedTable] = useState<string | undefined>(undefined);
  
  const { data: growthData, isLoading, error } = useGrowthRates(period, focusedTable);
  
  const getFastestGrowingTables = (limit = 5) => {
    return growthData?.data?.growthData
      ?.filter(table => table.trend === 'increasing')
      ?.sort((a, b) => b.growthRate - a.growthRate)
      ?.slice(0, limit) || [];
  };
  
  const getSlowestGrowingTables = (limit = 5) => {
    return growthData?.data?.growthData
      ?.filter(table => table.trend === 'stable' || table.growthRate < 10)
      ?.sort((a, b) => a.growthRate - b.growthRate)
      ?.slice(0, limit) || [];
  };
  
  const getAverageGrowthRate = () => {
    const data = growthData?.data?.growthData || [];
    if (data.length === 0) return 0;
    
    const totalGrowth = data.reduce((sum, table) => sum + table.growthRate, 0);
    return totalGrowth / data.length;
  };
  
  const getGrowthTrend = (tableName: string) => {
    return growthData?.data?.growthData?.find(table => table.tableName === tableName);
  };
  
  return {
    growthData: growthData?.data,
    period,
    focusedTable,
    isLoading,
    error,
    setPeriod,
    setFocusedTable,
    getFastestGrowingTables,
    getSlowestGrowingTables,
    getAverageGrowthRate,
    getGrowthTrend,
  };
};

/**
 * パフォーマンス監視用フック
 */
export const usePerformanceMonitor = () => {
  const [alertThresholds] = useState({
    slowQueryTime: 1.0, // 1秒以上
    highCachemiss: 0.2, // 20%以上のミス率
    lowConnectionUtilization: 0.8 // 80%以上の利用率
  });
  
  const { data: performanceStats, isLoading, error } = usePerformanceStats();
  
  const getPerformanceAlerts = () => {
    if (!performanceStats?.data) return [];
    
    const alerts: Array<{type: string, message: string, severity: 'warning' | 'error'}> = [];
    const stats = performanceStats.data;
    
    // スロークエリの検証
    if (stats.queryStats.slowestQuery.executionTime > alertThresholds.slowQueryTime) {
      alerts.push({
        type: 'slow_query',
        message: `スロークエリが検出されました: ${stats.queryStats.slowestQuery.executionTime.toFixed(3)}秒`,
        severity: 'warning'
      });
    }
    
    // キャッシュヒット率の検証
    const hitRate = parseFloat(stats.cacheStats.hitRate.replace('%', '')) / 100;
    if (hitRate < (1 - alertThresholds.highCachemiss)) {
      alerts.push({
        type: 'cache_miss',
        message: `キャッシュヒット率が低下しています: ${stats.cacheStats.hitRate}`,
        severity: 'warning'
      });
    }
    
    // 接続数の検証
    const connectionUtilization = stats.connectionStats.activeConnections / stats.connectionStats.maxConnections;
    if (connectionUtilization > alertThresholds.lowConnectionUtilization) {
      alerts.push({
        type: 'high_connections',
        message: `接続数が上限に近づいています: ${stats.connectionStats.activeConnections}/${stats.connectionStats.maxConnections}`,
        severity: 'error'
      });
    }
    
    return alerts;
  };
  
  const getQueryPerformanceScore = () => {
    if (!performanceStats?.data) return 0;
    
    const avgTime = performanceStats.data.queryStats.averageExecutionTime;
    if (avgTime < 0.1) return 100;
    if (avgTime < 0.5) return 80;
    if (avgTime < 1.0) return 60;
    if (avgTime < 2.0) return 40;
    return 20;
  };
  
  return {
    performanceStats: performanceStats?.data,
    isLoading,
    error,
    alerts: getPerformanceAlerts(),
    performanceScore: getQueryPerformanceScore(),
    thresholds: alertThresholds,
  };
};