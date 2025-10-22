/**
 * @file box item縺ｫ髢｢騾｣縺吶ｋtRPC繝・・ｽE繧ｿ謫堺ｽ懊ｒ髮・・ｽ・ｽE・ｽ・ｽ縺溘き繧ｹ繧ｿ繝繝輔ャ繧ｯ
 */

import { trpc } from '@src/lib/trpc/client';
import { skipToken } from '@tanstack/react-query';
import type { BoxItemSearchFilters as BoxItemSearchFiltersType } from '@src/types/box/box';

/**
 * 繝夲ｿｽE繧ｸ繝搾ｿｽE繧ｷ繝ｧ繝ｳ逕ｨ縺ｮ繝代Λ繝｡繝ｼ繧ｿ
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * BoxItemSearchFilters蝙九ｒ蜀稿xport
 */
export type BoxItemSearchFilters = BoxItemSearchFiltersType;

/**
 * 蜈ｨ縺ｦ縺ｮbox item繧貞叙蠕励☆繧九ヵ繝・・ｽ・ｽ・ｽE・ｽ・ｽE繝ｼ繧ｸ繝搾ｿｽE繧ｷ繝ｧ繝ｳ蟇ｾ蠢懶ｼ・ */
export const useBoxAll = (pagination?: PaginationParams) => {
  return trpc.box.getAll.useQuery(
    pagination ? { page: pagination.page, limit: pagination.limit } : skipToken,
    {
      staleTime: 5 * 60 * 1000, // 5蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･
      gcTime: 10 * 60 * 1000, // 10蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･菫晄戟
    }
  );
};

/**
 * 謖・・ｽ・ｽ縺輔ｌ縺櫑D縺ｮbox item繧貞叙蠕励☆繧九ヵ繝・・ｽ・ｽ
 */
export const useBoxById = (boxId: string, itemType: number) => {
  return trpc.box.getById.useQuery(
    { box_id: boxId, item_type: itemType },
    { enabled: !!boxId && itemType !== undefined }
  );
};

/**
 * 譚｡莉ｶ繧呈欠螳壹＠縺ｦbox item繧呈､懃ｴ｢縺吶ｋ繝輔ャ繧ｯ・ｽE・ｽ・ｽE繝ｼ繧ｸ繝搾ｿｽE繧ｷ繝ｧ繝ｳ蟇ｾ蠢懶ｼ・ */
export const useBoxSearch = (filters: BoxItemSearchFilters, pagination?: PaginationParams) => {
  const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '');
  const queryParams = hasFilters 
    ? { ...filters, page: pagination?.page || 1, limit: pagination?.limit || 20 }
    : undefined;

  return trpc.box.search.useQuery(
    hasFilters ? queryParams! : skipToken,
    {
      enabled: hasFilters,
      staleTime: 5 * 60 * 1000, // 5蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･
      gcTime: 10 * 60 * 1000, // 10蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･菫晄戟
    }
  );
};

/**
 * box item縺ｮ邨ｱ險域ュ蝣ｱ繧貞叙蠕励☆繧九ヵ繝・・ｽ・ｽ
 */
export const useBoxStats = () => {
  return trpc.box.getStats.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // 10蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･
    gcTime: 20 * 60 * 1000, // 20蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･菫晄戟
  });
};

/**
 * 隍・・ｽ・ｽ縺ｮbox_id縺ｫ蟇ｾ蠢懊☆繧九ヵ繧｡繧､繝ｫ蜷阪ｒ蜿門ｾ励☆繧九ヵ繝・・ｽ・ｽ
 */
export const useBoxFileNamesByIds = (boxIds: string, enabled: boolean = false) => {
  return trpc.box.getFileNamesByIds.useQuery(
    { boxIds },
    {
      enabled: enabled && boxIds.length > 0,
      staleTime: 5 * 60 * 1000, // 5蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･
      gcTime: 10 * 60 * 1000, // 10蛻・・ｽ・ｽ繧ｭ繝｣繝・・ｽ・ｽ繝･菫晄戟
    }
  );
};

/**
 * box item縺ｮCRUD謫堺ｽ懊ｒ縺ｾ縺ｨ繧√◆繝輔ャ繧ｯ
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
 * box item縺ｮ謫堺ｽ懊ｒ縺ｾ縺ｨ繧√◆繝輔ャ繧ｯ
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
