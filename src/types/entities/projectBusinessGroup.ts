import { z } from 'zod';

export interface ProjectBusinessGroup {
  ID: number;
  プロジェクト業務グループID?: number;
  親グループID?: number;
  業務種類ID: number;
  プロジェクトID: string;
  業務種類ID_2: number;
  使用目的: string;
  設置場所: string;
  ステータス: string;
  使用開始日: Date;
  使用終了日: Date;
  トランザクションID: number;
}

export const ProjectBusinessGroupSchema = z.object({
  ID: z.number().int().positive(),
  プロジェクト業務グループID: z.number().int().optional(),
  親グループID: z.number().int().optional(),
  業務種類ID: z.number().int().positive(),
  プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
  業務種類ID_2: z.number().int().positive(),
  使用目的: z.string().min(1, '使用目的は必須です'),
  設置場所: z.string().min(1, '設置場所は必須です'),
  ステータス: z.string().min(1, 'ステータスは必須です'),
  使用開始日: z.date(),
  使用終了日: z.date(),
  トランザクションID: z.number().int().positive(),
});

export const ProjectBusinessGroupCreateSchema = ProjectBusinessGroupSchema.omit({ ID: true });
export const ProjectBusinessGroupUpdateSchema = ProjectBusinessGroupSchema.partial();

export const ProjectBusinessGroupGetAllSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
}).optional();

export const ProjectBusinessGroupSearchSchema = z.object({
  プロジェクトID: z.string().optional(),
  業務種類ID: z.number().int().optional(),
  業務種類ID_2: z.number().int().optional(),
  ステータス: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});
