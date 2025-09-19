import { trpc } from '@src/lib/trpc/client';

// ==========================================
// BOM部品データ用tRPCカスタムフック
// ==========================================

/**
 * プロジェクトIDでBOM部品データを取得するフック
 */
export const useBomBuhinByProjectId = (projectId: string) => {
  return trpc.bomBuhin.getByProjectId.useQuery(
    { projectId },
    { enabled: !!projectId }
  );
};

/**
 * 全BOM部品データを取得するフック
 */
export const useBomBuhinAll = () => {
  return trpc.bomBuhin.getAll.useQuery();
};

/**
 * 指定IDのBOM部品データを取得するフック
 */
export const useBomBuhinById = (id: number) => {
  return trpc.bomBuhin.getById.useQuery({ id }, { enabled: !!id });
};

/**
 * BOM部品作成ミューテーション
 */
export const useBomBuhinCreate = () => {
  const utils = trpc.useUtils();
  
  return trpc.bomBuhin.create.useMutation({
    onSuccess: () => {
      // キャッシュを無効化
      void utils.bomBuhin.getAll.invalidate();
      void utils.bomBuhin.getByProjectId.invalidate();
    }
  });
};

/**
 * BOM部品更新ミューテーション
 */
export const useBomBuhinUpdate = () => {
  const utils = trpc.useUtils();
  
  return trpc.bomBuhin.update.useMutation({
    onSuccess: () => {
      // キャッシュを無効化
      void utils.bomBuhin.getAll.invalidate();
      void utils.bomBuhin.getByProjectId.invalidate();
    }
  });
};

/**
 * BOM部品削除ミューテーション
 */
export const useBomBuhinDelete = () => {
  const utils = trpc.useUtils();
  
  return trpc.bomBuhin.delete.useMutation({
    onSuccess: () => {
      // キャッシュを無効化
      void utils.bomBuhin.getAll.invalidate();
      void utils.bomBuhin.getByProjectId.invalidate();
    }
  });
};

/**
 * 後方互換性のための既存フック（非推奨）
 * @deprecated useBomBuhinByProjectIdを使用してください
 */
export const useBomBuhinData = (projectId: string) => {
  const { data, isLoading, error, refetch } = useBomBuhinByProjectId(projectId);
  
  return {
    data: data?.data || [],
    loading: isLoading,
    error: error?.message || null,
    refetch
  };
}; 