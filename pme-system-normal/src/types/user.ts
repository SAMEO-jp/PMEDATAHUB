/**
 * ユーザー関連の型定義
 */

export interface User {
  user_id: string;
  name_japanese: string;
  company?: string | null;
  TEL: string | null;
  mail: string | null;
  bumon: string | null;
  sitsu: string | null;
  ka: string | null;
  in_year: string | null;
  Kengen: string | null;
  syokui?: string | null;
}

export interface UserWithProjects extends User {
  projects: UserProjectInfo[];
  setsubi_assignments: UserSetsubiAssignment[];
  kounyu_assignments: UserKounyuAssignment[];
}

export interface UserProjectInfo {
  project_id: string;
  project_name: string;
  role: string;
  joined_at: string;
  status: 'active' | 'completed' | 'archived';
  IS_PROJECT: string;
}

export interface UserSetsubiAssignment {
  id: number;
  project_id: string;
  setsubi_id: number;
  seiban: string;
  setsubi_name: string;
  assigned_at: string;
  status: 'active' | 'inactive';
}

export interface UserKounyuAssignment {
  id: number;
  project_id: string;
  kounyu_id: number;
  management_number: string;
  item_name: string;
  assigned_at: string;
  status: 'active' | 'inactive';
}

export interface UserTimelineItem {
  id: string;
  type: 'project_join' | 'project_leave' | 'setsubi_assign' | 'setsubi_unassign' | 'kounyu_assign' | 'kounyu_unassign';
  title: string;
  description: string;
  date: string;
  project_id?: string;
  project_name?: string;
  item_id?: number;
  item_name?: string;
}

// tRPC スキーマ
export const UserSchema = {
  user_id: 'string',
  name_japanese: 'string',
  TEL: 'string?',
  mail: 'string?',
  bumon: 'string?',
  sitsu: 'string?',
  ka: 'string?',
  in_year: 'string?',
  Kengen: 'string?'
};

export const UserWithProjectsSchema = {
  ...UserSchema,
  projects: 'UserProjectInfo[]',
  setsubi_assignments: 'UserSetsubiAssignment[]',
  kounyu_assignments: 'UserKounyuAssignment[]'
};
