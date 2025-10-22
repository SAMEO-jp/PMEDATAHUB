import { trpc } from '@src/lib/trpc/client';

/**
 * 全テーブル一覧を取得するフック
 */
export const useAllTables = () => {
  return trpc.tableManagement.getAllTables.useQuery();
};

/**
 * 特定のテーブル情報を取得するフック
 */
export const useTableInfo = (tableName: string) => {
  return trpc.tableManagement.getTableInfo.useQuery(
    { tableName },
    {
      enabled: !!tableName,
    }
  );
};

/**
 * テーブル検索フック
 */
export const useTableSearch = (searchTerm?: string, tags?: string[]) => {
  return trpc.tableManagement.searchTables.useQuery(
    { searchTerm, tags },
    {
      enabled: !!(searchTerm || (tags && tags.length > 0)),
    }
  );
};

/**
 * テーブル管理用のミューテーション（将来の拡張用）
 */
export const useTableManagementMutations = () => {
  const utils = trpc.useUtils();
  
  // 将来的にテーブル作成・削除などのミューテーションを追加
  const invalidateQueries = () => {
    void utils.tableManagement.getAllTables.invalidate();
    void utils.tableManagement.searchTables.invalidate();
  };

  return { invalidateQueries };
};

/**
 * テーブルデータの型安全な取得
 */
export const useTableData = () => {
  const { data: allTablesData, isLoading: allTablesLoading, error: allTablesError } = useAllTables();
  
  return {
    tables: allTablesData?.data || [],
    isLoading: allTablesLoading,
    error: allTablesError,
    refetch: () => {
      // 必要に応じてrefetch機能を追加
    },
  };
};

/**
 * テーブル管理機能用のカスタムフック
 */
export const useTableManagementData = () => {
  const utils = trpc.useUtils();
  
  // テーブル一覧取得
  const getAllTables = trpc.tableManagement.getAllTables.useQuery(undefined, {
    staleTime: 30 * 1000, // 30秒間キャッシュ
    refetchOnWindowFocus: false,
  });

  // テーブル情報取得
  const getTableInfo = (tableName: string) => {
    return trpc.tableManagement.getTableInfo.useQuery(
      { tableName },
      {
        enabled: !!tableName,
        staleTime: 30 * 1000,
      }
    );
  };

  // 単一テーブル削除
  const deleteTableMutation = trpc.tableManagement.deleteTable.useMutation({
    onSuccess: () => {
      void utils.tableManagement.getAllTables.invalidate();
    },
    onError: (error: unknown) => {
      console.error('テーブル削除エラー:', error);
    },
  });

  // 複数テーブル一括削除（単一削除を複数回実行）
  const deleteMultipleTablesMutation = trpc.tableManagement.deleteTable.useMutation({
    onSuccess: () => {
      void utils.tableManagement.getAllTables.invalidate();
    },
    onError: (error: unknown) => {
      console.error('複数テーブル削除エラー:', error);
    },
  });

  return {
    // クエリ
    getAllTables,
    getTableInfo,
    
    // ミューテーション
    deleteTableMutation,
    deleteMultipleTablesMutation,
    
    // ユーティリティ
    utils,
  };
}; 