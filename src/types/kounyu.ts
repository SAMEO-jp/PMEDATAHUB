/**
 * 購入品管理関連の型定義
 */

export interface KounyuMaster {
  id: number;
  project_id: string;
  management_number: string;
  item_name: string;
  contract_number?: string;
  item_category: string;
  setsubi_seiban?: string;
  responsible_department?: string;
  drawing_number?: string;
  display_order: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface KounyuAssignment {
  id: number;
  kounyu_id: number;
  user_id: string;
  assigned_at: string;
  status: 'active' | 'inactive';
  user?: {
    user_id: string;
    name_japanese: string;
    bumon: string;
    sitsu: string;
    ka: string;
  };
}

export interface KounyuWithAssignment extends KounyuMaster {
  assignments?: KounyuAssignment[];
  assignee_count?: number;
  current_assignees?: Array<{
    user_id: string;
    name_japanese: string;
    department: string;
  }>;
}

// フォーム用型
export interface KounyuFormData {
  project_id: string;
  management_number: string;
  item_name: string;
  contract_number?: string;
  item_category: string;
  setsubi_seiban?: string;
  responsible_department?: string;
  drawing_number?: string;
  display_order: number;
  remarks?: string;
}

export interface KounyuAssignmentFormData {
  kounyu_id: number;
  user_id: string;
  status?: 'active' | 'inactive';
}

// tRPC スキーマ
export const KounyuSchema = {
  id: 'number',
  project_id: 'string',
  management_number: 'string',
  item_name: 'string',
  contract_number: 'string?',
  item_category: 'string',
  setsubi_seiban: 'string?',
  responsible_department: 'string?',
  drawing_number: 'string?',
  display_order: 'number',
  remarks: 'string?',
  created_at: 'string',
  updated_at: 'string'
};

export const KounyuAssignmentSchema = {
  id: 'number',
  kounyu_id: 'number',
  user_id: 'string',
  assigned_at: 'string',
  status: 'string'
};
