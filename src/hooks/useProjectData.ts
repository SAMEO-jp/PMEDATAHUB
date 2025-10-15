/**
 * @file プロジェクトデータを取得・操作するためのカスタムフック
 */

import { trpc } from '@src/lib/trpc/client';
import { ProjectCreateSchema, ProjectUpdateSchema, ProjectGetAllSchema, ProjectSearchSchema } from '@src/types/project';

export const useProjectGetAll = (input: ProjectGetAllSchema) => {
  return trpc.project.getAll.useQuery(input);
};

export const useProjectGetById = (ID: number) => {
  return trpc.project.getById.useQuery({ ID });
};

export const useProjectSearch = (input: ProjectSearchSchema) => {
  return trpc.project.search.useQuery(input, {
    enabled: Object.values(input).some(value => value !== undefined && value !== null && value !== '')
  });
};

export const useProjectMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.search.invalidate();
    },
  });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.search.invalidate();
      // 特定のIDのキャッシュを更新したい場合は、以下のようにIDを指定します
      // void utils.project.getById.invalidate({ ID: updatedProjectId });
    },
  });

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.search.invalidate();
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

export const useProjectGetStats = () => {
  return trpc.project.getStats.useQuery();
};

export const useProjectGetMembers = (プロジェクトID: string) => {
  return trpc.project.getMembers.useQuery({ プロジェクトID });
};

export const useProjectAddMember = () => {
  const utils = trpc.useUtils();
  return trpc.project.addMember.useMutation({
    onSuccess: () => {
      void utils.project.getMembers.invalidate();
    },
  });
};

export const useProjectRemoveMember = () => {
  const utils = trpc.useUtils();
  return trpc.project.removeMember.useMutation({
    onSuccess: () => {
      void utils.project.getMembers.invalidate();
    },
  });
};

export const useProjectAddProjectIdSubColumn = () => {
  const utils = trpc.useUtils();
  return trpc.project.addProjectIdSubColumn.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
    },
  });
};