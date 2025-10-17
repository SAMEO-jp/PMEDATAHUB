import { trpc } from '@src/lib/trpc/client';

/**
 * BOM_ZUMENデータを取得するためのカスタムフック
 */
export const useBomZumenData = () => {
  // 全BOM図面データを取得
  const getAllZumen = trpc.bomZumen.getAll.useQuery();

  // プロジェクトIDでBOM図面データを取得
  const getZumenByProjectId = (projectId: string) => {
    return trpc.bomZumen.getByProjectId.useQuery({ projectId });
  };

  // 図面IDでBOM図面データを取得
  const getZumenByZumenId = (zumenId: string) => {
    return trpc.bomZumen.getByZumenId.useQuery({ zumenId });
  };

  // ROWIDでBOM図面データを取得
  const getZumenById = (id: number) => {
    return trpc.bomZumen.getById.useQuery({ id });
  };

  // BOM図面データを作成
  const createZumen = trpc.bomZumen.create.useMutation();

  // BOM図面データを更新
  const updateZumen = trpc.bomZumen.update.useMutation();

  // BOM図面データを削除（ROWID）
  const deleteZumen = trpc.bomZumen.delete.useMutation();

  // BOM図面データを削除（図面ID）
  const deleteZumenByZumenId = trpc.bomZumen.deleteByZumenId.useMutation();

  return {
    // クエリ
    getAllZumen,
    getZumenByProjectId,
    getZumenByZumenId,
    getZumenById,
    
    // ミューテーション
    createZumen,
    updateZumen,
    deleteZumen,
    deleteZumenByZumenId,
  };
};

/**
 * プロジェクトIDでBOM図面データを取得するフック
 */
export const useBomZumenByProject = (projectId: string) => {
  const { data, isLoading, error, refetch } = trpc.bomZumen.getByProjectId.useQuery(
    { projectId },
    {
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  return {
    zumenList: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

/**
 * 図面IDでBOM図面データを取得するフック
 */
export const useBomZumenByZumenId = (zumenId: string) => {
  const { data, isLoading, error, refetch } = trpc.bomZumen.getByZumenId.useQuery(
    { zumenId },
    {
      enabled: !!zumenId,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    }
  );

  return {
    zumen: data?.data || null,
    isLoading,
    error,
    refetch,
  };
};

/**
 * BOM図面データの作成・更新・削除を行うフック
 */
export const useBomZumenMutations = () => {
  const utils = trpc.useUtils();
  
  const createZumen = trpc.bomZumen.create.useMutation({
    onSuccess: () => {
      // キャッシュを無効化して再取得
      void utils.bomZumen.getAll.invalidate();
    },
  });

  const updateZumen = trpc.bomZumen.update.useMutation({
    onSuccess: () => {
      // キャッシュを無効化して再取得
      void utils.bomZumen.getAll.invalidate();
    },
  });

  const deleteZumen = trpc.bomZumen.delete.useMutation({
    onSuccess: () => {
      // キャッシュを無効化して再取得
      void utils.bomZumen.getAll.invalidate();
    },
  });

  const deleteZumenByZumenId = trpc.bomZumen.deleteByZumenId.useMutation({
    onSuccess: () => {
      // キャッシュを無効化して再取得
      void utils.bomZumen.getAll.invalidate();
    },
  });

  return {
    createZumen,
    updateZumen,
    deleteZumen,
    deleteZumenByZumenId,
  };
}; 