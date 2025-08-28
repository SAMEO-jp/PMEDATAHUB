/**
 * @file テーブル管理用カスタムフック
 * tRPCのデータ操作（QueryやMutation）をテーブル管理用にカスタマイズしたフック
 */

import { trpc } from '@src/lib/trpc/client';

/**
 * 全テーブル一覧を取得するフック
 */
export const useTableAll = () => {
  return trpc.table.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
    refetchOnWindowFocus: false,
  });
};

/**
 * 特定テーブルの詳細情報を取得するフック
 */
export const useTableDetail = (tableName: string, enabled = true) => {
  return trpc.table.getById.useQuery(
    { tableName },
    {
      enabled: enabled && !!tableName,
      staleTime: 2 * 60 * 1000, // 2分間キャッシュ
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * テーブルのスキーマ情報を取得するフック
 */
export const useTableSchema = (tableName: string, enabled = true) => {
  return trpc.table.getSchema.useQuery(
    { tableName },
    {
      enabled: enabled && !!tableName,
      staleTime: 10 * 60 * 1000, // 10分間キャッシュ（スキーマは変更頻度が低い）
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * テーブル検索用フック
 */
export const useTableSearch = (searchFilters: {
  name?: string;
  description?: string;
  limit?: number;
  offset?: number;
}) => {
  return trpc.table.search.useQuery(
    searchFilters,
    {
      enabled: Object.values(searchFilters).some(value => 
        value !== undefined && value !== null && value !== ''
      ),
      staleTime: 30 * 1000, // 30秒キャッシュ（検索結果は短時間）
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * テーブル統計情報を取得するフック
 */
export const useTableStatistics = (tableName: string, enabled = true) => {
  return trpc.table.getStatistics.useQuery(
    { tableName },
    {
      enabled: enabled && !!tableName,
      staleTime: 60 * 1000, // 1分間キャッシュ
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * テーブルのサンプルデータを取得するフック
 */
export const useTableData = (tableName: string, limit = 50, enabled = true) => {
  return trpc.table.getData.useQuery(
    { tableName, limit },
    {
      enabled: enabled && !!tableName,
      staleTime: 30 * 1000, // 30秒間キャッシュ
      refetchOnWindowFocus: false,
    }
  );
};

/**
 * テーブル管理用ユーティリティフック
 * キャッシュの無効化やリフレッシュを提供
 */
export const useTableUtils = () => {
  const utils = trpc.useUtils();
  
  const invalidateAll = () => {
    void utils.table.getAll.invalidate();
  };
  
  const invalidateDetail = (tableName: string) => {
    void utils.table.getById.invalidate({ tableName });
    void utils.table.getSchema.invalidate({ tableName });
    void utils.table.getStatistics.invalidate({ tableName });
  };
  
  const invalidateSearch = () => {
    void utils.table.search.invalidate();
  };
  
  const refreshAll = () => {
    void utils.table.getAll.refetch();
  };
  
  return {
    invalidateAll,
    invalidateDetail,
    invalidateSearch,
    refreshAll,
  };
};

/**
 * テーブル一覧データの便利なヘルパー
 */
export const useTableListHelpers = () => {
  const { data: tables, isLoading, error } = useTableAll();
  
  const getTableByName = (name: string) => {
    return tables?.data?.find(table => table.name === name);
  };
  
  const getTablesByTag = (tag: string) => {
    return tables?.data?.filter(table => 
      table.tags?.includes(tag)
    ) || [];
  };
  
  const getTotalRecords = () => {
    return tables?.data?.reduce((sum, table) => sum + table.records, 0) || 0;
  };
  
  const getLargestTable = () => {
    return tables?.data?.reduce((largest, table) => 
      table.records > largest.records ? table : largest,
      tables.data[0]
    );
  };
  
  return {
    tables: tables?.data || [],
    isLoading,
    error,
    getTableByName,
    getTablesByTag,
    getTotalRecords,
    getLargestTable,
  };
};