import { trpc } from '@src/lib/trpc/client';
import { ProjectBusinessGroupCreateSchema, ProjectBusinessGroupUpdateSchema, ProjectBusinessGroupGetAllSchema, ProjectBusinessGroupSearchSchema } from '@src/types/projectBusinessGroup';

export const useProjectBusinessGroupGetAll = (input: ProjectBusinessGroupGetAllSchema) => {
  return trpc.projectBusinessGroup.getAll.useQuery(input);
};

export const useProjectBusinessGroupGetById = (ID: number) => {
  return trpc.projectBusinessGroup.getById.useQuery({ ID });
};

export const useProjectBusinessGroupSearch = (input: ProjectBusinessGroupSearchSchema) => {
  return trpc.projectBusinessGroup.search.useQuery(input, {
    enabled: Object.values(input).some(value => value !== undefined && value !== null && value !== '')
  });
};

export const useProjectBusinessGroupMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.projectBusinessGroup.create.useMutation({
    onSuccess: () => {
      void utils.projectBusinessGroup.getAll.invalidate();
      void utils.projectBusinessGroup.search.invalidate();
    },
  });

  const updateMutation = trpc.projectBusinessGroup.update.useMutation({
    onSuccess: () => {
      void utils.projectBusinessGroup.getAll.invalidate();
      void utils.projectBusinessGroup.search.invalidate();
      // 特定のIDのキャッシュを更新したい場合は、以下のようにIDを指定します
      // void utils.projectBusinessGroup.getById.invalidate({ ID: updatedProjectBusinessGroupId });
    },
  });

  const deleteMutation = trpc.projectBusinessGroup.delete.useMutation({
    onSuccess: () => {
      void utils.projectBusinessGroup.getAll.invalidate();
      void utils.projectBusinessGroup.search.invalidate();
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};
