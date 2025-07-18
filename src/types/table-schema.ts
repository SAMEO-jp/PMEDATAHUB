// テーブル構造変更用の型定義

// カラム情報の型定義
export interface ColumnInfo {
  name: string;
  type: string;
  notNull?: boolean;
  defaultValue?: string;
  primaryKey?: boolean;
}

// テーブル構造変更の型定義
export interface TableSchemaChange {
  tableName: string;
  operation: 'add' | 'drop' | 'rename' | 'modify';
  columnName: string;
  newColumnName?: string;
  newColumnType?: string;
  newColumnDefinition?: ColumnInfo;
}

// テーブル構造取得レスポンス
export interface TableSchemaResponse {
  tableName: string;
  columns: ColumnInfo[];
}

// テーブル構造変更リクエスト
export interface TableSchemaChangeRequest {
  changes: TableSchemaChange[];
}

// テーブル構造変更レスポンス
export interface TableSchemaChangeResponse {
  success: boolean;
  message: string;
  affectedTables: string[];
} 