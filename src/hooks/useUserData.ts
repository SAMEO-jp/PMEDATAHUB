/**
 * @file ユーザーデータを取得・操作するためのカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';
import { skipToken } from '@tanstack/react-query';

/**
 * ページネーション用のパラメータ
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * ユーザー検索フィルター
 */
export interface UserSearchFilters {
  name?: string;
  department?: string;
  position?: string;
}

/**
 * 全てのユーザーを取得するフック
 */
export const useUserAll = () => {
  return trpc.user.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
  });
};

/**
 * 指定されたIDのユーザーを取得するフック
 */
export const useUserById = (userId: string) => {
  return trpc.user.getDetail.useQuery(
    { user_id: userId },
    { enabled: !!userId }
  );
};

/**
 * ユーザーを検索するフック
 */
export const useUserSearch = (filters: UserSearchFilters) => {
  const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '');
  
  return trpc.auth.searchUsers.useQuery(
    { name: filters.name || '' },
    {
      enabled: hasFilters && !!filters.name,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
      gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
    }
  );
};

/**
 * ユーザーのCRUD操作を提供するフック
 */
export const useUserMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.user.create.useMutation({
    onSuccess: () => {
      void utils.user.getAll.invalidate();
    },
  });

  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      void utils.user.getAll.invalidate();
    },
  });

  return { createMutation, updateMutation };
};

/**
 * ユーザーの操作を提供するフック
 */
export const useUserOperations = () => {
  const { createMutation, updateMutation } = useUserMutations();
  const utils = trpc.useUtils();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (userId: string, updates: any) => {
    updateMutation.mutate({ user_id: userId, ...updates });
  };

  const refreshData = () => {
    void utils.user.getAll.invalidate();
  };

  return {
    createMutation,
    updateMutation,
    handleCreate,
    handleUpdate,
    refreshData,
  };
};

/**
 * 認証関連のフック
 */
export const useAuthOperations = () => {
  const loginMutation = trpc.auth.login.useMutation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const validateUserQuery = trpc.auth.validateUser.useQuery;

  const handleLogin = (userId: string, password: string) => {
    return loginMutation.mutateAsync({ userId, password });
  };

  const handleLogout = () => {
    return logoutMutation.mutateAsync();
  };

  const checkUserExists = (userId: string) => {
    return validateUserQuery({ userId }, { enabled: !!userId });
  };

  return {
    loginMutation,
    logoutMutation,
    handleLogin,
    handleLogout,
    checkUserExists,
  };
};
