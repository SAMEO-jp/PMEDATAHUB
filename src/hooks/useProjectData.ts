/**
 * @file プロジェクト関連のtRPCデータ操作を集約したカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';
import type { DepartmentSchema, UserSchema } from '@src/lib/trpc/routers/db/project';

/**
 * プロジェクト一覧取得用のフック
 */
export const useProjectAll = (filters: {
  search?: string;
  status?: 'active' | 'completed' | 'archived' | 'all';
  page?: number;
  pageSize?: number;
}) => {
  const searchParams = {
    search: filters.search || undefined,
    status: filters.status === 'all' ? undefined : (filters.status as 'active' | 'completed' | 'archived'),
    page: filters.page || 1,
    pageSize: filters.pageSize || 10,
  };

  return trpc.project.getAll.useQuery(searchParams, {
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 10 * 60 * 1000, // 10分間キャッシュ保持
  });
};

/**
 * プロジェクト詳細取得用のフック
 */
export const useProjectById = (id: string) => {
  return trpc.project.getById.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );
};

/**
 * プロジェクト作成・更新・削除用のミューテーションフック
 */
export const useProjectMutations = () => {
  const utils = trpc.useUtils();

  // 作成ミューテーション
  const createMutation = trpc.project.create.useMutation({
    onSuccess: (result) => {
      console.log('プロジェクト作成成功:', result.data);
      // キャッシュを無効化して再取得
      void utils.project.getAll.invalidate();
    },
    onError: (error) => {
      console.error('プロジェクト作成エラー:', error);
    },
  });

  // 更新ミューテーション
  const updateMutation = trpc.project.update.useMutation({
    onSuccess: (result) => {
      console.log('プロジェクト更新成功:', result.data);
      // キャッシュを無効化して再取得
      void utils.project.getAll.invalidate();
      void utils.project.getById.invalidate();
    },
    onError: (error) => {
      console.error('プロジェクト更新エラー:', error);
    },
  });

  // 削除ミューテーション
  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      console.log('プロジェクト削除成功');
      // キャッシュを無効化して再取得
      void utils.project.getAll.invalidate();
    },
    onError: (error) => {
      console.error('プロジェクト削除エラー:', error);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};

/**
 * プロジェクトメンバー管理用のフック
 */
export const useProjectMembers = (projectId: string) => {
  const utils = trpc.useUtils();

  // メンバー取得
  const { data: membersData, isLoading: loadingMembers, error: membersError } = trpc.project.getMembers.useQuery(
    { projectId },
    {
      enabled: !!projectId,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    }
  );

  // メンバー追加ミューテーション
  const addMemberMutation = trpc.project.addMember.useMutation({
    onSuccess: () => {
      console.log('メンバー追加成功');
      // キャッシュを無効化して再取得
      void utils.project.getMembers.invalidate();
    },
    onError: (error) => {
      console.error('メンバー追加エラー:', error);
    },
  });

  // メンバー削除ミューテーション
  const removeMemberMutation = trpc.project.removeMember.useMutation({
    onSuccess: () => {
      console.log('メンバー削除成功');
      // キャッシュを無効化して再取得
      void utils.project.getMembers.invalidate();
    },
    onError: (error) => {
      console.error('メンバー削除エラー:', error);
    },
  });

  const handleAddMember = async (userId: string, role: string = 'メンバー') => {
    try {
      const result = await addMemberMutation.mutateAsync({ project_id: projectId, user_id: userId, role, joined_at: new Date().toISOString() });
      return result;
    } catch (error) {
      console.error('メンバー追加処理エラー:', error);
      throw error;
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      const result = await removeMemberMutation.mutateAsync({ projectId, userId });
      return result;
    } catch (error) {
      console.error('メンバー削除処理エラー:', error);
      throw error;
    }
  };

  return {
    members: membersData?.data || [],
    loadingMembers,
    membersError,
    handleAddMember,
    handleRemoveMember,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,
  };
};

/**
 * プロジェクト作成用のシンプルなフック
 */
export const useProjectCreate = () => {
  const { createMutation } = useProjectMutations();

  const handleCreate = async (formData: {
    PROJECT_ID: string;
    PROJECT_NAME: string;
    PROJECT_DESCRIPTION?: string;
    PROJECT_START_DATE: string;
    PROJECT_STATUS?: 'active' | 'completed' | 'archived';
    PROJECT_CLIENT_NAME: string;
    PROJECT_START_ENDDATE?: string;
    PROJECT_NOTE?: string;
    PROJECT_CLASSIFICATION?: string;
    PROJECT_BUDGENT_GRADE?: string;
    installationDate?: string;
    drawingCompletionDate?: string;
    PROJECT_EQUIPMENT_CATEGORY?: string;
    PROJECT_SYOHIN_CATEGORY?: string;
  }) => {
    try {
      const result = await createMutation.mutateAsync(formData);
      return result;
    } catch (error) {
      console.error('プロジェクト作成処理エラー:', error);
      throw error;
    }
  };

  return {
    handleCreate,
    isLoading: createMutation.isPending,
    error: createMutation.error,
  };
};

/**
 * プロジェクト更新用のシンプルなフック
 */
export const useProjectUpdate = () => {
  const { updateMutation } = useProjectMutations();

  const handleUpdate = async (id: string, data: Partial<{
    PROJECT_ID: string;
    PROJECT_NAME: string;
    PROJECT_DESCRIPTION?: string;
    PROJECT_START_DATE: string;
    PROJECT_STATUS?: 'active' | 'completed' | 'archived';
    PROJECT_CLIENT_NAME: string;
    PROJECT_START_ENDDATE?: string;
    PROJECT_NOTE?: string;
    PROJECT_CLASSIFICATION?: string;
    PROJECT_BUDGENT_GRADE?: string;
    installationDate?: string;
    drawingCompletionDate?: string;
    PROJECT_EQUIPMENT_CATEGORY?: string;
    PROJECT_SYOHIN_CATEGORY?: string;
  }>) => {
    try {
      const result = await updateMutation.mutateAsync({ id, data });
      return result;
    } catch (error) {
      console.error('プロジェクト更新処理エラー:', error);
      throw error;
    }
  };

  return {
    handleUpdate,
    isLoading: updateMutation.isPending,
    error: updateMutation.error,
  };
};

/**
 * プロジェクト削除用のシンプルなフック
 */
export const useProjectDelete = () => {
  const { deleteMutation } = useProjectMutations();

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMutation.mutateAsync({ id });
      return result;
    } catch (error) {
      console.error('プロジェクト削除処理エラー:', error);
      throw error;
    }
  };

  return {
    handleDelete,
    isLoading: deleteMutation.isPending,
    error: deleteMutation.error,
  };
};

/**
 * 部署データ取得用のフック
 */
export const useDepartments = () => {
  return trpc.project.getAllDepartments.useQuery(undefined, {
    enabled: true,
    staleTime: 10 * 60 * 1000, // 10分間キャッシュ
    gcTime: 30 * 60 * 1000, // 30分間キャッシュ保持
  });
};

/**
 * 全ユーザーデータ取得用のフック
 */
export const useAllUsers = () => {
  return trpc.project.getAllUsers.useQuery(undefined, {
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
    gcTime: 15 * 60 * 1000, // 15分間キャッシュ保持
  });
};

/**
 * ユーザー一覧取得用のフック（新規）
 */
export const useUserAll = () => {
  return trpc.user.getAll.useQuery(undefined, {
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
};

/**
 * ユーザー詳細取得用のフック
 */
export const useUserDetail = (userId: string) => {
  return trpc.user.getDetail.useQuery(
    { user_id: userId },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    }
  );
};

/**
 * ユーザータイムライン取得用のフック
 */
export const useUserTimeline = (userId: string) => {
  return trpc.user.getTimeline.useQuery(
    { user_id: userId },
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    }
  );
};
