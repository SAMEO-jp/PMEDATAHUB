/**
 * @file 繝励Ο繧ｸ繧ｧ繧ｯ繝育ｮ｡逅・↓髢｢騾｣縺吶ｋAPI繧ｨ繝ｳ繝峨・繧､繝ｳ繝茨ｼ医・繝ｭ繧ｷ繝ｼ繧ｸ繝｣・峨ｒ螳夂ｾｩ縺吶ｋ繝ｫ繝ｼ繧ｿ繝ｼ繝輔ぃ繧､繝ｫ縺ｧ縺吶・ */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { GetConditionData, GetAllData } from '../../../db/crud/db_GetData';
import { getProjectDetail } from '../../../db/queries/projectQueries';
import { createRecord } from '../../../db/crud/db_CRUD';
import {
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  getAllUsers,
  getDepartments
} from '../../../db/queries/projectMemberQueries';
import type { Project } from '@src/types/db_project';

// Zod schema definitions
export const ProjectCreateSchema = z.object({
  PROJECT_ID: z.string().min(1, 'Project ID is required'),
  PROJECT_NAME: z.string().min(1, 'Project name is required'),
  PROJECT_DESCRIPTION: z.string().default(''),
  PROJECT_START_DATE: z.string().min(1, 'Start date is required'),
  PROJECT_STATUS: z.enum(['active', 'completed', 'archived']).default('active'),
  PROJECT_CLIENT_NAME: z.string().min(1, 'Client name is required'),
  PROJECT_START_ENDDATE: z.string().default(''),
  PROJECT_NOTE: z.string().default(''),
  PROJECT_CLASSIFICATION: z.string().default(''),
  PROJECT_BUDGENT_GRADE: z.string().default(''),
  installationDate: z.string().default(''),
  drawingCompletionDate: z.string().default(''),
  PROJECT_EQUIPMENT_CATEGORY: z.string().default(''),
  PROJECT_SYOHIN_CATEGORY: z.string().default(''),
});

export const ProjectSearchSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

export const ProjectUpdateSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  data: ProjectCreateSchema.partial(),
});

// Department schema
export const DepartmentSchema = z.object({
  id: z.number(),
  name: z.string(),
  department_kind: z.string(),
  top_department: z.string().nullable(),
  status: z.string(),
});

// User schema
export const UserSchema = z.object({
  user_id: z.string(),
  name_japanese: z.string(),
  TEL: z.string().nullable(),
  mail: z.string().nullable(),
  name_english: z.string().nullable(),
  name_yomi: z.string().nullable(),
  company: z.string().nullable(),
  bumon: z.string().nullable(),
  in_year: z.string().nullable(),
  Kengen: z.string().nullable(),
  TEL_naisen: z.string().nullable(),
  sitsu: z.string().nullable(),
  ka: z.string().nullable(),
  syoki: z.string().nullable(),
});

// Project member schema
export const ProjectMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.string().default('member'),
});

export const ProjectMemberRemoveSchema = z.object({
  userId: z.string().min(1, '繝ｦ繝ｼ繧ｶ繝ｼID縺ｯ蠢・医〒縺・),
});

/**
 * 繝励Ο繧ｸ繧ｧ繧ｯ繝育ｮ｡逅・未騾｣縺ｮ繝励Ο繧ｷ繝ｼ繧ｸ繝｣繧偵∪縺ｨ繧√◆繝ｫ繝ｼ繧ｿ繝ｼ縲・ */
export const projectRouter = createTRPCRouter({
  /**
   * 蜈ｨ縺ｦ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蜿門ｾ励☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  getAll: publicProcedure
    .input(ProjectSearchSchema.optional())
    .query(async ({ input }) => {
      try {
        const searchInput = input || { page: 1, pageSize: 10 };
        console.log('tRPC project.getAll: 髢句ｧ・, searchInput);

        let result;
        if (searchInput.search) {
          console.log('tRPC project.getAll: 讀懃ｴ｢螳溯｡・, { search: searchInput.search });
          result = await GetConditionData<Project[]>(
            'PROJECT_NAME LIKE ? OR PROJECT_CLIENT_NAME LIKE ?',
            [`%${searchInput.search}%`, `%${searchInput.search}%`],
            { tableName: 'PROJECT', idColumn: 'PROJECT_ID' }
          );
        } else {
          console.log('tRPC project.getAll: 蜈ｨ莉ｶ蜿門ｾ・);
          result = await GetAllData<Project[]>({
            tableName: 'PROJECT'
          });
        }

        if (!result.success) {
          console.error('tRPC project.getAll: 繝・・繧ｿ蜿門ｾ励お繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'string' ? result.error : '繝励Ο繧ｸ繧ｧ繧ｯ繝医・蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        let projects = result.data || [];

        // 繧ｹ繝・・繧ｿ繧ｹ縺ｧ繝輔ぅ繝ｫ繧ｿ繝ｪ繝ｳ繧ｰ
        if (searchInput.status) {
          console.log('tRPC project.getAll: 繧ｹ繝・・繧ｿ繧ｹ繝輔ぅ繝ｫ繧ｿ繝ｼ驕ｩ逕ｨ', { status: searchInput.status });
          projects = projects.filter(project => project.PROJECT_STATUS === searchInput.status);
        }

        // 繝壹・繧ｸ繝阪・繧ｷ繝ｧ繝ｳ
        const start = (searchInput.page - 1) * searchInput.pageSize;
        const end = start + searchInput.pageSize;
        const paginatedProjects = projects.slice(start, end);
        const totalPages = Math.ceil(projects.length / searchInput.pageSize);

        console.log('tRPC project.getAll: 螳御ｺ・, {
          projectCount: paginatedProjects.length,
          total: projects.length,
          totalPages
        });

        return {
          success: true,
          data: paginatedProjects,
          total: projects.length,
          totalPages,
          currentPage: searchInput.page,
          pageSize: searchInput.pageSize
        };
      } catch (error) {
        console.error("tRPC project.getAll error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝井ｸ隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｩｳ邏ｰ繧貞叙蠕励☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  getDetail: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｯ蠢・医〒縺・),
    }))
    .query(async ({ input }) => {
      try {
        console.log('tRPC project.getDetail: 髢句ｧ・, input);

        const result = await getProjectDetail(input.project_id);

        if (!result.success) {
          console.error('tRPC project.getDetail: 繝・・繧ｿ蜿門ｾ励お繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: result.error || '繝励Ο繧ｸ繧ｧ繧ｯ繝医′隕九▽縺九ｊ縺ｾ縺帙ｓ',
          });
        }

        console.log('tRPC project.getDetail: 螳御ｺ・, {
          projectId: result.data.PROJECT_ID,
          projectName: result.data.PROJECT_NAME
        });

        return {
          success: true,
          data: (result.data ?? [])
        };
      } catch (error) {
        console.error("tRPC project.getDetail error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝郁ｩｳ邏ｰ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 謖・ｮ壹＆繧後◆繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蜿門ｾ励☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  getById: publicProcedure
    .input(z.object({ id: z.string().min(1, '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｯ蠢・医〒縺・) }))
    .query(async ({ input }) => {
      try {
        console.log('tRPC project.getById: 髢句ｧ・, { id: input.id });

        const result = await GetConditionData<Project[]>(
          'PROJECT_ID = ?',
          [input.id],
          { tableName: 'PROJECT', idColumn: 'PROJECT_ID' }
        );

        if (!result.success) {
          console.error('tRPC project.getById: 繝・・繧ｿ蜿門ｾ励お繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'string' ? result.error : '繝励Ο繧ｸ繧ｧ繧ｯ繝医・蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        const project = result.data?.[0];

        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '謖・ｮ壹＆繧後◆繝励Ο繧ｸ繧ｧ繧ｯ繝医′隕九▽縺九ｊ縺ｾ縺帙ｓ',
          });
        }

        console.log('tRPC project.getById: 螳御ｺ・, { id: input.id });
        return { success: true, data: project };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.getById error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝医・蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 譁ｰ縺励＞繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ菴懈・縺吶ｋ繝励Ο繧ｷ繝ｼ繧ｸ繝｣縲・   */
  create: publicProcedure
    .input(ProjectCreateSchema)
    .mutation(async ({ input }) => {
      try {
        console.log('tRPC project.create: 髢句ｧ・, { projectId: input.PROJECT_ID });

        const result = await createRecord('PROJECT', input);

        if (!result.success) {
          console.error('tRPC project.create: 菴懈・繧ｨ繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: typeof result.error === 'string' ? result.error : '繝励Ο繧ｸ繧ｧ繧ｯ繝医・菴懈・縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        console.log('tRPC project.create: 螳御ｺ・, { projectId: input.PROJECT_ID });
        return { success: true, data: (result.data ?? []) };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.create error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝医・菴懈・縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ譖ｴ譁ｰ縺吶ｋ繝励Ο繧ｷ繝ｼ繧ｸ繝｣縲・   */
  update: publicProcedure
    .input(ProjectUpdateSchema)
    .mutation(async ({ input }) => {
      try {
        console.log('tRPC project.update: 髢句ｧ・, { id: input.id });

        // 迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蜿門ｾ・        const getResult = await GetConditionData<Project[]>(
          'PROJECT_ID = ?',
          [input.id],
          { tableName: 'PROJECT', idColumn: 'PROJECT_ID' }
        );

        if (!getResult.success || !getResult.data?.[0]) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: '譖ｴ譁ｰ蟇ｾ雎｡縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝医′隕九▽縺九ｊ縺ｾ縺帙ｓ',
          });
        }

        const currentProject = getResult.data[0];
        const updatedData = { ...currentProject, ...input.data, UPDATE_AT: new Date().toISOString() };

        // TODO: updateRecord髢｢謨ｰ縺悟ｮ溯｣・＆繧後◆繧臥ｽｮ縺肴鋤縺・        // const result = await updateRecord('PROJECT', input.id, updatedData, 'PROJECT_ID');

        // 荳譎ら噪縺ｫ繝｢繝・け繝ｬ繧ｹ繝昴Φ繧ｹ・磯撼蜷梧悄蜃ｦ逅・ｒ繧ｷ繝溘Η繝ｬ繝ｼ繝茨ｼ・        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('tRPC project.update: 螳御ｺ・, { id: input.id });
        return { success: true, data: updatedData };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.update error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝医・譖ｴ譁ｰ縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 繝励Ο繧ｸ繧ｧ繧ｯ繝医ｒ蜑企勁縺吶ｋ繝励Ο繧ｷ繝ｼ繧ｸ繝｣縲・   */
  delete: publicProcedure
    .input(z.object({ id: z.string().min(1, '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｯ蠢・医〒縺・) }))
    .mutation(async ({ input }) => {
      try {
        console.log('tRPC project.delete: 髢句ｧ・, { id: input.id });

        // TODO: deleteRecord髢｢謨ｰ縺悟ｮ溯｣・＆繧後◆繧臥ｽｮ縺肴鋤縺・        // const result = await deleteRecord('PROJECT', input.id, 'PROJECT_ID');

        // 荳譎ら噪縺ｫ繝｢繝・け繝ｬ繧ｹ繝昴Φ繧ｹ・磯撼蜷梧悄蜃ｦ逅・ｒ繧ｷ繝溘Η繝ｬ繝ｼ繝茨ｼ・        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('tRPC project.delete: 螳御ｺ・, { id: input.id });
        return { success: true };
      } catch (error) {
        console.error("tRPC project.delete error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝医・蜑企勁縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 繝励Ο繧ｸ繧ｧ繧ｯ繝医Γ繝ｳ繝舌・繧貞叙蠕励☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  getMembers: publicProcedure
    .input(z.object({ projectId: z.string().min(1, '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｯ蠢・医〒縺・) }))
    .query(async ({ input }) => {
      try {
        console.log('tRPC project.getMembers: 髢句ｧ・, { projectId: input.projectId });

        const result = await getProjectMembers(input.projectId);

        if (!result.success) {
          console.error('tRPC project.getMembers: 繝・・繧ｿ蜿門ｾ励お繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '繝励Ο繧ｸ繧ｧ繧ｯ繝医Γ繝ｳ繝舌・縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        console.log('tRPC project.getMembers: 螳御ｺ・, { projectId: input.projectId, count: (result.data ?? []).length || 0 });
        return { success: true, data: (result.data ?? []) || [] };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.getMembers error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝励Ο繧ｸ繧ｧ繧ｯ繝医Γ繝ｳ繝舌・縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 繝励Ο繧ｸ繧ｧ繧ｯ繝医Γ繝ｳ繝舌・繧定ｿｽ蜉縺吶ｋ繝励Ο繧ｷ繝ｼ繧ｸ繝｣縲・   */
  addMember: publicProcedure
    .input(z.object({
      project_id: z.string().min(1, '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｯ蠢・医〒縺・),
      user_id: z.string().min(1, '繝ｦ繝ｼ繧ｶ繝ｼID縺ｯ蠢・医〒縺・),
      role: z.string().default('member'),
      joined_at: z.string().min(1, '蜿ょ刈譌･縺ｯ蠢・医〒縺・),
    }))
    .mutation(async ({ input }) => {
      try {
        console.log('tRPC project.addMember: 髢句ｧ・, { projectId: input.project_id, userId: input.user_id });

        const result = await addProjectMember(input.project_id, input.user_id, input.role, input.joined_at);

        if (!result.success) {
          console.error('tRPC project.addMember: 菴懈・繧ｨ繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '繝｡繝ｳ繝舌・縺ｮ霑ｽ蜉縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        console.log('tRPC project.addMember: 螳御ｺ・, { projectId: input.project_id, userId: input.user_id });
        return { success: true, data: (result.data ?? []) };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.addMember error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝｡繝ｳ繝舌・縺ｮ霑ｽ蜉縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 繝励Ο繧ｸ繧ｧ繧ｯ繝医Γ繝ｳ繝舌・繧貞炎髯､・磯蜃ｺ・峨☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  removeMember: publicProcedure
    .input(z.object({
      projectId: z.string().min(1, '繝励Ο繧ｸ繧ｧ繧ｯ繝・D縺ｯ蠢・医〒縺・),
      userId: z.string().min(1, '繝ｦ繝ｼ繧ｶ繝ｼID縺ｯ蠢・医〒縺・),
    }))
    .mutation(async ({ input }) => {
      try {
        console.log('tRPC project.removeMember: 髢句ｧ・, { projectId: input.projectId, userId: input.userId });

        const result = await removeProjectMember(input.projectId, input.userId);

        if (!result.success) {
          console.error('tRPC project.removeMember: 蜑企勁繧ｨ繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '繝｡繝ｳ繝舌・縺ｮ蜑企勁縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        console.log('tRPC project.removeMember: 螳御ｺ・, { projectId: input.projectId, userId: input.userId });
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.removeMember error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝｡繝ｳ繝舌・縺ｮ蜑企勁縺ｫ螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 蜈ｨ驛ｨ鄂ｲ繝・・繧ｿ繧貞叙蠕励☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  getAllDepartments: publicProcedure
    .query(async () => {
      try {
        console.log('tRPC project.getAllDepartments: 髢句ｧ・);
        const result = await getDepartments();

        if (!result.success) {
          console.error('tRPC project.getAllDepartments: 蜿門ｾ励お繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '驛ｨ鄂ｲ繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        console.log('tRPC project.getAllDepartments: 螳御ｺ・, { count: (result.data ?? []).length || 0 });
        return result.data || [];
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.getAllDepartments error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '驛ｨ鄂ｲ繝・・繧ｿ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),

  /**
   * 蜈ｨ繝ｦ繝ｼ繧ｶ繝ｼ繝・・繧ｿ繧貞叙蠕励☆繧九・繝ｭ繧ｷ繝ｼ繧ｸ繝｣縲・   */
  getAllUsers: publicProcedure
    .query(async () => {
      try {
        console.log('tRPC project.getAllUsers: 髢句ｧ・);
        const result = await getAllUsers();

        if (!result.success) {
          console.error('tRPC project.getAllUsers: 蜿門ｾ励お繝ｩ繝ｼ', result.error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: result.error || '繝ｦ繝ｼ繧ｶ繝ｼ荳隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
          });
        }

        console.log('tRPC project.getAllUsers: 螳御ｺ・, { count: (result.data ?? []).length || 0 });
        return result.data || [];
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error("tRPC project.getAllUsers error:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '繝ｦ繝ｼ繧ｶ繝ｼ荳隕ｧ縺ｮ蜿門ｾ励↓螟ｱ謨励＠縺ｾ縺励◆',
        });
      }
    }),
});
