import { z } from 'zod';

export interface Project {
  ID: number;
  プロジェクトID: string;
  プロジェクト名: string;
  プロジェクト説明?: string;
  プロジェクト開始日?: Date;
  プロジェクト終了日?: Date;
  プロジェクトステータスID?: number;
  クライアント名ID?: number;
  プロジェクト分類ID?: number;
  予算グレードID?: number;
  設備カテゴリID?: number;
  商品カテゴリID?: number;
  備考?: string;
  プロジェクトフラグ?: number;
}

export const ProjectSchema = z.object({
  ID: z.number().int().positive(),
  プロジェクトID: z.string().min(1, 'プロジェクトIDは必須です'),
  プロジェクト名: z.string().min(1, 'プロジェクト名は必須です'),
  プロジェクト説明: z.string().optional(),
  プロジェクト開始日: z.date().optional(),
  プロジェクト終了日: z.date().optional(),
  プロジェクトステータスID: z.number().int().optional(),
  クライアント名ID: z.number().int().optional(),
  プロジェクト分類ID: z.number().int().optional(),
  予算グレードID: z.number().int().optional(),
  設備カテゴリID: z.number().int().optional(),
  商品カテゴリID: z.number().int().optional(),
  備考: z.string().optional(),
  プロジェクトフラグ: z.number().int().optional(),
});

export const ProjectCreateSchema = ProjectSchema.omit({ ID: true });
export const ProjectUpdateSchema = ProjectSchema.partial();

export const ProjectGetAllSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
}).optional();

export const ProjectSearchSchema = z.object({
  プロジェクト名: z.string().optional(),
  プロジェクトステータスID: z.number().int().optional(),
  クライアント名ID: z.number().int().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});
