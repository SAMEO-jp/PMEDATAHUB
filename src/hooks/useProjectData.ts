/**
 * @file プロジェクト関連のtRPCデータ操作を集約したカスタムフック
 * TODO: プロジェクトルーターの実装が必要
 */

// 一時的なダミー実装
const dummyQuery = () => ({ data: null, isLoading: false, error: null });
const dummyMutation = () => ({ mutate: () => {}, isPending: false, error: null });

export const useProjectAll = (filters?: any) => dummyQuery();
export const useProjectById = () => dummyQuery();
export const useProjectCreate = () => ({ 
  handleCreate: (data: any) => Promise.resolve({ success: true }), 
  isLoading: false 
});
export const useProjectUpdate = () => dummyMutation();
export const useProjectDelete = () => dummyMutation();
export const useProjectMembers = (projectId?: string) => ({ 
  members: [], 
  loadingMembers: false, 
  handleAddMember: (userId: string, role: string) => Promise.resolve(), 
  handleRemoveMember: (userId: string) => Promise.resolve(),
  isAddingMember: false,
  isRemovingMember: false
});
export const useProjectAddMember = () => dummyMutation();
export const useProjectRemoveMember = () => dummyMutation();
export const useUserAll = () => dummyQuery();
export const useUserDetail = (userId?: string) => dummyQuery();
export const useUserTimeline = (userId?: string) => dummyQuery();
export const useDepartments = () => dummyQuery();
export const useAllUsers = () => dummyQuery();
