/**
 * @file 図面組立図検索用のカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';

/**
 * 図面番号で組立図としてデータを登録している図面を検索するフック
 */
export const useZumenAssemblySearch = () => {
  const utils = trpc.useUtils();

  /**
   * 基本的な図面番号検索
   */
  const searchByZumenId = (zumenId: string) => {
    return trpc.zumenAssemblySearch.searchByZumenId.useQuery(
      { zumenId },
      {
        enabled: !!zumenId,
        staleTime: 5 * 60 * 1000, // 5分間キャッシュ
        gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
      }
    );
  };

  /**
   * 詳細検索（セミコロン区切りで完全一致）
   */
  const searchExactByZumenId = (zumenId: string) => {
    return trpc.zumenAssemblySearch.searchExactByZumenId.useQuery(
      { zumenId },
      {
        enabled: !!zumenId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      }
    );
  };

  /**
   * プロジェクトID指定での検索
   */
  const searchByZumenIdAndProject = (zumenId: string, projectId: string) => {
    return trpc.zumenAssemblySearch.searchByZumenIdAndProject.useQuery(
      { zumenId, projectId },
      {
        enabled: !!zumenId && !!projectId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      }
    );
  };

  /**
   * 図面種類指定での検索
   */
  const searchByZumenIdAndKind = (zumenId: string, zumenKind?: string) => {
    return trpc.zumenAssemblySearch.searchByZumenIdAndKind.useQuery(
      { zumenId, zumenKind },
      {
        enabled: !!zumenId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      }
    );
  };

  /**
   * キャッシュの無効化
   */
  const invalidateCache = () => {
    void utils.zumenAssemblySearch.searchByZumenId.invalidate();
    void utils.zumenAssemblySearch.searchExactByZumenId.invalidate();
    void utils.zumenAssemblySearch.searchByZumenIdAndProject.invalidate();
    void utils.zumenAssemblySearch.searchByZumenIdAndKind.invalidate();
  };

  return {
    searchByZumenId,
    searchExactByZumenId,
    searchByZumenIdAndProject,
    searchByZumenIdAndKind,
    invalidateCache,
  };
}; 