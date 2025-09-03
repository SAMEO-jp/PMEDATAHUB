/**
 * @file box itemに関連するtRPCデータ操作を集約したカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';
import type { BoxItemSearchFilters as BoxItemSearchFiltersType } from '@src/types/box/box';

/**
 * ページネーション用のパラメータ
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * BoxItemSearchFilters型を再export
 */
export type BoxItemSearchFilters = BoxItemSearchFiltersType;

/**
 * 全てのbox itemを取得するフック（ページネーション対応）
 */
export const useBoxAll = (pagination?: PaginationParams) => {
  return trpc.box.getAll.useQuery(
    pagination ? { page: pagination.page, limit: pagination.limit } : undefined,
    {
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
      gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
    }
  );
};

/**
 * 指定されたIDのbox itemを取得するフック
 */
export const useBoxById = (boxId: string, itemType: number) => {
  return trpc.box.getById.useQuery(
    { box_id: boxId, item_type: itemType },
    { enabled: !!boxId && itemType !== undefined }
  );
};

/**
 * 条件を指定してbox itemを検索するフック（ページネーション対応）
 */
export const useBoxSearch = (filters: BoxItemSearchFilters, pagination?: PaginationParams) => {
  const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '');
  const queryParams = hasFilters 
    ? { ...filters, page: pagination?.page || 1, limit: pagination?.limit || 20 }
    : undefined;

  return trpc.box.search.useQuery(
    hasFilters ? queryParams! : undefined,
    {
      enabled: hasFilters,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
      gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
    }
  );
};

/**
 * box itemの統計情報を取得するフック
 */
export const useBoxStats = () => {
  return trpc.box.getStats.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    gcTime: 20 * 60 * 1000, // 20分間キャッシュ保持
  });
};

/**
 * box itemのCRUD操作をまとめたフック
 */
export const useBoxMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.box.create.useMutation({
    onSuccess: () => {
      void utils.box.getAll.invalidate();
      void utils.box.getStats.invalidate();
    },
  });

  const updateMutation = trpc.box.update.useMutation({
    onSuccess: () => {
      void utils.box.getAll.invalidate();
      void utils.box.getStats.invalidate();
    },
  });

  const deleteMutation = trpc.box.delete.useMutation({
    onSuccess: () => {
      void utils.box.getAll.invalidate();
      void utils.box.getStats.invalidate();
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

/**
 * box itemの操作をまとめたフック
 */
export const useBoxOperations = () => {
  const { createMutation, updateMutation, deleteMutation } = useBoxMutations();
  const utils = trpc.useUtils();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (boxId: string, itemType: number, updates: any) => {
    updateMutation.mutate({ box_id: boxId, item_type: itemType, ...updates });
  };

  const handleDelete = (boxId: string, itemType: number) => {
    if (confirm('本当に削除しますか？')) {
      deleteMutation.mutate({ box_id: boxId, item_type: itemType });
    }
  };

  const refreshData = () => {
    void utils.box.getAll.invalidate();
    void utils.box.getStats.invalidate();
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    handleCreate,
    handleUpdate,
    handleDelete,
    refreshData,
  };
};
