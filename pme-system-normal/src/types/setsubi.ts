/**
 * 設備製番管理関連の型定義
 */

export interface SetsubiMaster {
  id: number;
  seiban: string;
  shohin_category?: string;
  setsubi_name: string;
  parent_seiban?: string;
  location_code?: string;
  created_at: string;
  updated_at: string;
}

export interface SetsubiHistory {
  id: number;
  project_id: string;
  seiban: string;
  created_at: string;
}

export interface SetsubiAssignment {
  id: number;
  project_id: string;
  user_id: string;
  setsubi_id: number;
  assigned_at: string;
  status: 'active' | 'inactive';
}

// APIレスポンス型
export interface SetsubiWithAssignment extends SetsubiMaster {
  assignments?: SetsubiAssignment[];
  assignee_count?: number;
  current_assignees?: Array<{
    user_id: string;
    name_japanese: string;
    role?: string;
  }>;
}

// フォーム用型
export interface SetsubiFormData {
  seiban: string;
  shohin_category?: string;
  setsubi_name: string;
  parent_seiban?: string;
  location_code?: string;
}

export interface SetsubiAssignmentFormData {
  user_id: string;
  setsubi_id: number;
  status?: 'active' | 'inactive';
}

// tRPC スキーマ
export const SetsubiSchema = {
  id: 'number',
  seiban: 'string',
  shohin_category: 'string?',
  setsubi_name: 'string',
  parent_seiban: 'string?',
  location_code: 'string?',
  created_at: 'string',
  updated_at: 'string'
};

export const SetsubiHistorySchema = {
  id: 'number',
  project_id: 'string',
  seiban: 'string',
  created_at: 'string'
};

export const SetsubiAssignmentSchema = {
  id: 'number',
  project_id: 'string',
  user_id: 'string',
  setsubi_id: 'number',
  assigned_at: 'string',
  status: 'string'
};
