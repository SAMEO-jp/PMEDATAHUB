/**
 * 業務分類コード関連のエクスポート
 * 
 * 型定義、データ、生成ロジックを一箇所からエクスポート
 */

// 型定義
export * from './types';

// データ
export { PROJECT_DETAIL_CLASSIFICATIONS } from './project-codes';
export { INDIRECT_DETAIL_CLASSIFICATIONS } from './indirect-codes';

// 生成ロジック
export { 
  generateProjectActivityCode, 
  generateIndirectActivityCode, 
  generateDefaultCode 
} from './code-generators';
