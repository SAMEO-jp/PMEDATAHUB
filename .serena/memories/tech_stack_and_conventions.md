# 技術スタックとコーディング規約

## 技術スタック詳細

### フロントエンド
- **Next.js 14**: App Router使用
- **TypeScript**: 厳密な型チェック
- **React 18**: 最新のReact機能
- **Tailwind CSS**: ユーティリティファーストCSS
- **Radix UI**: アクセシブルなUIコンポーネント
- **shadcn/ui**: カスタマイズ可能なUIコンポーネント

### 状態管理・API
- **Zustand**: 軽量な状態管理
- **tRPC**: 型安全なAPI通信
- **React Query**: データフェッチング

### データベース
- **SQLite**: achievements.db
- **Kysely**: 型安全なSQLクエリビルダー

### 開発ツール
- **ESLint**: コード品質管理
- **TypeScript**: 型安全性
- **PostCSS**: CSS処理

## コーディング規約

### TypeScript
- 厳密な型チェック（strict: true）
- 明示的な型定義
- インターフェースの使用
- any型の使用は最小限

### ファイル命名
- コンポーネント: PascalCase (例: ProjectCard.tsx)
- ユーティリティ: camelCase (例: dateUtils.ts)
- ページ: kebab-case (例: project-detail.tsx)

### インポート順序
1. React関連
2. 外部ライブラリ
3. 内部モジュール
4. 型定義

### コンポーネント構造
```typescript
// 1. インポート
import React from 'react'
import { ComponentProps } from './types'

// 2. 型定義
interface Props {
  // ...
}

// 3. コンポーネント
export const Component: React.FC<Props> = ({ ... }) => {
  // ...
}
```

### データベース命名規則
- テーブル名: スネークケース
- カラム名: スネークケース（大文字）
- 主キー: rowid
- タイムスタンプ: CREATED_AT, UPDATE_AT

### エラーハンドリング
- try-catch文の使用
- 型安全なエラー処理
- ユーザーフレンドリーなエラーメッセージ