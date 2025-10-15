/**
 * タスク管理システムの型定義
 */

// ========================================
// タスク関連の型定義
// ========================================

/**
 * タスクの優先度
 */
export type TaskPriority = 'high' | 'medium' | 'low';

/**
 * タスクのステータス
 */
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

/**
 * タスクのカテゴリ
 */
export type TaskCategory = '企画' | '会議' | '作成' | '開発' | '事務' | 'その他';

/**
 * タスクのメイン型
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedTime?: number; // 分単位
  assignee?: string;
  dueDate?: string;
  projectId?: string; // プロジェクトに紐づく場合
  createdAt: string;
  updatedAt: string;
}

/**
 * タスク作成用の入力データ型
 */
export interface TaskCreateInput {
  title: string;
  description?: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedTime?: number;
  assignee?: string;
  dueDate?: string;
  projectId?: string;
}

/**
 * タスク更新用の入力データ型
 */
export interface TaskUpdateInput {
  id: string;
  title?: string;
  description?: string;
  category?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  estimatedTime?: number;
  assignee?: string;
  dueDate?: string;
  projectId?: string;
}

/**
 * タスク検索用のフィルター型
 */
export interface TaskFilter {
  searchTerm?: string;
  category?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignee?: string;
  projectId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
}

/**
 * タスク統計情報
 */
export interface TaskStatistics {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  high: number;
  medium: number;
  low: number;
  byCategory: Record<string, number>;
  byAssignee: Record<string, number>;
}

// ========================================
// タスクテンプレート関連の型定義
// ========================================

/**
 * タスクテンプレート型
 */
export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: TaskPriority;
  estimatedTime: number; // 分単位
  defaultActivityCode: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * テンプレート使用履歴型
 */
export interface TemplateUsageHistory {
  id: string;
  templateId: string;
  eventId: string;
  projectId?: string;
  usedAt: string;
}

// ========================================
// API レスポンス型
// ========================================

/**
 * タスク一覧取得のレスポンス型
 */
export interface TaskListResponse {
  success: boolean;
  data?: Task[];
  error?: {
    code: string;
    message: string;
  };
}

/**
 * タスク詳細取得のレスポンス型
 */
export interface TaskDetailResponse {
  success: boolean;
  data?: Task;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * タスク作成のレスポンス型
 */
export interface TaskCreateResponse {
  success: boolean;
  data?: Task;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * タスク更新のレスポンス型
 */
export interface TaskUpdateResponse {
  success: boolean;
  data?: Task;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * タスク削除のレスポンス型
 */
export interface TaskDeleteResponse {
  success: boolean;
  data?: { id: string };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * タスク統計取得のレスポンス型
 */
export interface TaskStatisticsResponse {
  success: boolean;
  data?: TaskStatistics;
  error?: {
    code: string;
    message: string;
  };
}


