/**
 * @file パレット関連のデータ操作をまとめたカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';
import type {
  PaletMasterCreate,
  KonpoPaletCreate,
  PaletListCreate,
  PaletStatusHistoryCreate,
  PaletScheduleCreate,
  PaletTempLocationsCreate,
  PaletMasterSearch,
  KonpoPaletSearch,
  PaletListSearch,
  PaletStatusHistorySearch,
  PaletScheduleSearch,
  PaletTempLocationsSearch
} from '@src/types/palet';

// ==========================================
// パレットマスター関連フック
// ==========================================

/**
 * 全てのパレットマスターを取得するフック
 */
export const usePaletMasterAll = () => {
  return trpc.palet.master.getAll.useQuery();
};

/**
 * ID指定でパレットマスターを取得するフック
 */
export const usePaletMasterById = (id: number) => {
  return trpc.palet.master.getById.useQuery({ id }, {
    enabled: !!id
  });
};

/**
 * 条件を指定してパレットマスターを検索するフック
 */
export const usePaletMasterSearch = (filters: PaletMasterSearch) => {
  return trpc.palet.master.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

/**
 * パレットマスターの作成・更新・削除フック
 */
export const usePaletMasterMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.palet.master.create.useMutation({
    onSuccess: () => {
      void utils.palet.master.getAll.invalidate();
      void utils.palet.master.search.invalidate();
    }
  });

  const updateMutation = trpc.palet.master.update.useMutation({
    onSuccess: () => {
      void utils.palet.master.getAll.invalidate();
      void utils.palet.master.search.invalidate();
    }
  });

  const deleteMutation = trpc.palet.master.delete.useMutation({
    onSuccess: () => {
      void utils.palet.master.getAll.invalidate();
      void utils.palet.master.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};

// ==========================================
// 構成パレット関連フック
// ==========================================

/**
 * 全ての構成パレットを取得するフック
 */
export const useKonpoPaletAll = () => {
  return trpc.palet.konpo.getAll.useQuery();
};

/**
 * ID指定で構成パレットを取得するフック
 */
export const useKonpoPaletById = (id: number) => {
  return trpc.palet.konpo.getById.useQuery({ id }, {
    enabled: !!id
  });
};

/**
 * 条件を指定して構成パレットを検索するフック
 */
export const useKonpoPaletSearch = (filters: KonpoPaletSearch) => {
  return trpc.palet.konpo.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

/**
 * 構成パレットの作成・更新・削除フック
 */
export const useKonpoPaletMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.palet.konpo.create.useMutation({
    onSuccess: () => {
      void utils.palet.konpo.getAll.invalidate();
      void utils.palet.konpo.search.invalidate();
    }
  });

  const updateMutation = trpc.palet.konpo.update.useMutation({
    onSuccess: () => {
      void utils.palet.konpo.getAll.invalidate();
      void utils.palet.konpo.search.invalidate();
    }
  });

  const deleteMutation = trpc.palet.konpo.delete.useMutation({
    onSuccess: () => {
      void utils.palet.konpo.getAll.invalidate();
      void utils.palet.konpo.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};

// ==========================================
// パレットリスト関連フック
// ==========================================

/**
 * 全てのパレットリストを取得するフック
 */
export const usePaletListAll = () => {
  return trpc.palet.list.getAll.useQuery();
};

/**
 * ID指定でパレットリストを取得するフック
 */
export const usePaletListById = (id: number) => {
  return trpc.palet.list.getById.useQuery({ id }, {
    enabled: !!id
  });
};

/**
 * 条件を指定してパレットリストを検索するフック
 */
export const usePaletListSearch = (filters: PaletListSearch) => {
  return trpc.palet.list.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

/**
 * パレットリストの作成・更新・削除フック
 */
export const usePaletListMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.palet.list.create.useMutation({
    onSuccess: () => {
      void utils.palet.list.getAll.invalidate();
      void utils.palet.list.search.invalidate();
    }
  });

  const updateMutation = trpc.palet.list.update.useMutation({
    onSuccess: () => {
      void utils.palet.list.getAll.invalidate();
      void utils.palet.list.search.invalidate();
    }
  });

  const deleteMutation = trpc.palet.list.delete.useMutation({
    onSuccess: () => {
      void utils.palet.list.getAll.invalidate();
      void utils.palet.list.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};

// ==========================================
// PALET_LIST関連
// ==========================================
export const usePaletList = () => {
  return trpc.palet.list.getAll.useQuery();
};

// ==========================================
// パレットステータス履歴関連フック
// ==========================================

/**
 * 全てのパレットステータス履歴を取得するフック
 */
export const usePaletStatusHistoryAll = () => {
  return trpc.palet.statusHistory.getAll.useQuery();
};

/**
 * ID指定でパレットステータス履歴を取得するフック
 */
export const usePaletStatusHistoryById = (id: number) => {
  return trpc.palet.statusHistory.getById.useQuery({ id }, {
    enabled: !!id
  });
};

/**
 * 条件を指定してパレットステータス履歴を検索するフック
 */
export const usePaletStatusHistorySearch = (filters: PaletStatusHistorySearch) => {
  return trpc.palet.statusHistory.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

/**
 * パレットステータス履歴の作成・更新・削除フック
 */
export const usePaletStatusHistoryMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.palet.statusHistory.create.useMutation({
    onSuccess: () => {
      void utils.palet.statusHistory.getAll.invalidate();
      void utils.palet.statusHistory.search.invalidate();
    }
  });

  const updateMutation = trpc.palet.statusHistory.update.useMutation({
    onSuccess: () => {
      void utils.palet.statusHistory.getAll.invalidate();
      void utils.palet.statusHistory.search.invalidate();
    }
  });

  const deleteMutation = trpc.palet.statusHistory.delete.useMutation({
    onSuccess: () => {
      void utils.palet.statusHistory.getAll.invalidate();
      void utils.palet.statusHistory.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};

// ==========================================
// パレットスケジュール関連フック
// ==========================================

/**
 * 全てのパレットスケジュールを取得するフック
 */
export const usePaletScheduleAll = () => {
  return trpc.palet.schedule.getAll.useQuery();
};

/**
 * ID指定でパレットスケジュールを取得するフック
 */
export const usePaletScheduleById = (id: number) => {
  return trpc.palet.schedule.getById.useQuery({ id }, {
    enabled: !!id
  });
};

/**
 * 条件を指定してパレットスケジュールを検索するフック
 */
export const usePaletScheduleSearch = (filters: PaletScheduleSearch) => {
  return trpc.palet.schedule.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

/**
 * パレットスケジュールの作成・更新・削除フック
 */
export const usePaletScheduleMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.palet.schedule.create.useMutation({
    onSuccess: () => {
      void utils.palet.schedule.getAll.invalidate();
      void utils.palet.schedule.search.invalidate();
    }
  });

  const updateMutation = trpc.palet.schedule.update.useMutation({
    onSuccess: () => {
      void utils.palet.schedule.getAll.invalidate();
      void utils.palet.schedule.search.invalidate();
    }
  });

  const deleteMutation = trpc.palet.schedule.delete.useMutation({
    onSuccess: () => {
      void utils.palet.schedule.getAll.invalidate();
      void utils.palet.schedule.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};

// ==========================================
// パレット一時場所関連フック
// ==========================================

/**
 * 全てのパレット一時場所を取得するフック
 */
export const usePaletTempLocationsAll = () => {
  return trpc.palet.tempLocations.getAll.useQuery();
};

/**
 * ID指定でパレット一時場所を取得するフック
 */
export const usePaletTempLocationsById = (id: number) => {
  return trpc.palet.tempLocations.getById.useQuery({ id }, {
    enabled: !!id
  });
};

/**
 * 条件を指定してパレット一時場所を検索するフック
 */
export const usePaletTempLocationsSearch = (filters: PaletTempLocationsSearch) => {
  return trpc.palet.tempLocations.search.useQuery(filters, {
    enabled: Object.values(filters).some(value => value && value.length > 0)
  });
};

/**
 * パレット一時場所の作成・更新・削除フック
 */
export const usePaletTempLocationsMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.palet.tempLocations.create.useMutation({
    onSuccess: () => {
      void utils.palet.tempLocations.getAll.invalidate();
      void utils.palet.tempLocations.search.invalidate();
    }
  });

  const updateMutation = trpc.palet.tempLocations.update.useMutation({
    onSuccess: () => {
      void utils.palet.tempLocations.getAll.invalidate();
      void utils.palet.tempLocations.search.invalidate();
    }
  });

  const deleteMutation = trpc.palet.tempLocations.delete.useMutation({
    onSuccess: () => {
      void utils.palet.tempLocations.getAll.invalidate();
      void utils.palet.tempLocations.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
}; 