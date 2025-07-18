// ==========================================
// テーブル管理テストページ用型定義
// ==========================================

export interface TableItem {
  id: string;
  name: string;
  description: string;
  records: number;
  lastUpdated: string;
  tags: string[];
}

export interface IconProps {
  className?: string;
  [key: string]: any;
} 