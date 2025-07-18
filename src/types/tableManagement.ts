import { z } from 'zod';

// テーブル情報の型定義
export interface TableInfo {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// Zodスキーマ
export const TableInfoSchema = z.object({
  name: z.string().min(1, 'テーブル名は必須です'),
});

export const DeleteTableSchema = z.object({
  tableName: z.string().min(1, 'テーブル名は必須です'),
});

export const DeleteMultipleTablesSchema = z.object({
  tableNames: z.array(z.string().min(1, 'テーブル名は必須です')).min(1, '少なくとも1つのテーブルを選択してください'),
});

// APIレスポンス型
export type TableListResponse = {
  success: boolean;
  data?: TableInfo[];
  error?: {
    code: string;
    message: string;
  };
};

export type DeleteTableResponse = {
  success: boolean;
  data?: { deletedTable: string };
  error?: {
    code: string;
    message: string;
  };
};

export type DeleteMultipleTablesResponse = {
  success: boolean;
  data?: { deletedTables: string[] };
  error?: {
    code: string;
    message: string;
  };
}; 