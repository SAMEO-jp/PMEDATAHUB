/**
 * @file プロジェクトデータを取得・操作するためのカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';
import { skipToken } from '@tanstack/react-query';
import type { Project } from '@src/types/db_project';

/**
 * ページネーション用のパラメータ
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * プロジェクト検索フィルター
 */
export interface ProjectSearchFilters {
  PROJECT_NAME?: string;
  PROJECT_STATUS?: 'active' | 'completed' | 'archived';
  PROJECT_CLIENT_NAME?: string;
}

/**
 * 全てのプロジェクトを取得するフック（ページネーション対応）
 */
export const useProjectAll = (pagination?: PaginationParams) => {
  return trpc.project.getAll.useQuery(
    pagination ? { 
      limit: pagination.limit, 
      offset: (pagination.page - 1) * pagination.limit 
    } : skipToken,
    {
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
      gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  );
};

/**
 * 指定されたIDのプロジェクトを取得するフック
 */
export const useProjectById = (projectId: string) => {
  return trpc.project.getById.useQuery(
    { project_id: projectId },
    { enabled: !!projectId }
  );
};

/**
 * 条件を指定してプロジェクトを検索するフック（ページネーション対応）
 */
export const useProjectSearch = (filters: ProjectSearchFilters, pagination?: PaginationParams) => {
  const hasFilters = Object.values(filters).some(value => value !== undefined && value !== '');
  const queryParams = hasFilters 
    ? { 
        ...filters, 
        limit: pagination?.limit || 20, 
        offset: pagination ? (pagination.page - 1) * pagination.limit : 0 
      }
    : undefined;

  return trpc.project.search.useQuery(
    hasFilters ? queryParams! : skipToken,
    {
      enabled: hasFilters,
      staleTime: 5 * 60 * 1000, // 5分間キャッシュ
      gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
    }
  );
};

/**
 * プロジェクトの統計情報を取得するフック
 */
export const useProjectStats = () => {
  return trpc.project.getStats.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    gcTime: 20 * 60 * 1000, // 20分間キャッシュ保持
  });
};

/**
 * プロジェクトのCRUD操作を提供するフック
 */
export const useProjectMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getStats.invalidate();
    },
  });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getStats.invalidate();
    },
  });

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getStats.invalidate();
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

/**
 * プロジェクトの操作を提供するフック
 */
export const useProjectOperations = () => {
  const { createMutation, updateMutation, deleteMutation } = useProjectMutations();
  const utils = trpc.useUtils();

  const handleCreate = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handleUpdate = (projectId: string, updates: any) => {
    updateMutation.mutate({ project_id: projectId, data: updates });
  };

  const handleDelete = (projectId: string) => {
    if (confirm('本当に削除しますか？')) {
      deleteMutation.mutate({ project_id: projectId });
    }
  };

  const refreshData = () => {
    void utils.project.getAll.invalidate();
    void utils.project.getStats.invalidate();
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

/**
 * プロジェクトメンバー管理のフック
 */
export const useProjectMembers = (projectId: string) => {
  const utils = trpc.useUtils();
  
  const { data: members = [], isLoading } = trpc.project.getMembers.useQuery(
    { project_id: projectId },
    { enabled: !!projectId }
  );

  const addMemberMutation = trpc.project.addMember.useMutation({
    onSuccess: () => {
      void utils.project.getMembers.invalidate({ project_id: projectId });
    },
  });

  const removeMemberMutation = trpc.project.removeMember.useMutation({
    onSuccess: () => {
      void utils.project.getMembers.invalidate({ project_id: projectId });
    },
  });

  const handleAddMember = async (userId: string, role: string) => {
    return addMemberMutation.mutateAsync({
      project_id: projectId,
      user_id: userId,
      role: role,
    });
  };

  const handleRemoveMember = async (userId: string) => {
    return removeMemberMutation.mutateAsync({
      project_id: projectId,
      user_id: userId,
    });
  };

  return {
    members: (members as any)?.data || [],
    isLoading,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
    handleAddMember,
    handleRemoveMember,
  };
};

/**
 * 部署データを取得するフック
 */
export const useDepartments = () => {
  const query = trpc.department.getAll.useQuery(undefined, {
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    gcTime: 20 * 60 * 1000, // 20分間キャッシュ保持
  });
  
  return {
    ...query,
    data: query.data?.data || [],
  };
};

/**
 * 全ユーザーデータを取得するフック
 */
export const useAllUsers = () => {
  const query = trpc.user.getAll.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
  });
  
  return {
    ...query,
    data: query.data?.data || [],
  };
};

/**
 * プロジェクト作成のフック
 */
export const useProjectCreate = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.getStats.invalidate();
    },
  });

  const handleCreate = (formData: any) => {
    return createMutation.mutateAsync(formData);
  };

  return {
    ...createMutation,
    handleCreate,
    isLoading: createMutation.isPending,
  };
};