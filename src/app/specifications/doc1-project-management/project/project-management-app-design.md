# プロジェクト管理アプリ設計ドキュメント（tRPC版）

## 📋 概要

### 目的
プロジェクトの新規追加、状態変更、メンバー管理を行う統合的なプロジェクト管理システムの構築

### 技術スタック
- **フロントエンド**: Next.js 14 (App Router)
- **バックエンド**: tRPC v11 + Next.js API Routes
- **データベース**: SQLite (achievements.db)
- **状態管理**: Zustand + React Query (tRPC)
- **UI**: shadcn/ui + Tailwind CSS
- **認証**: カスタム認証システム
- **バリデーション**: Zod

## 🏗️ ドメイン設計

### 1. コアドメイン

#### プロジェクト (Project)
```typescript
interface Project {
  // 基本情報
  rowid: number;
  PROJECT_ID: string;           // プロジェクト識別子
  PROJECT_NAME: string;         // プロジェクト名
  PROJECT_DESCRIPTION: string;  // プロジェクト説明
  PROJECT_STATUS: ProjectStatus; // プロジェクト状態
  
  // 期間管理
  PROJECT_START_DATE: string;   // 開始日
  PROJECT_START_ENDDATE: string; // 終了予定日
  
  // クライアント情報
  PROJECT_CLIENT_NAME: string;     // クライアント名
  
  // 分類・予算
  PROJECT_CLASSIFICATION: string;     // プロジェクト分類
  PROJECT_BUDGENT_GRADE: string;      // 予算グレード
  
  // スケジュール
  installationDate: string;           // 設置日
  drawingCompletionDate: string;      // 図面完成日
  
  // カテゴリ
  PROJECT_EQUIPMENT_CATEGORY: string; // 設備カテゴリ
  PROJECT_SYOHIN_CATEGORY: string;    // 商品カテゴリ
  
  // メタデータ
  CREATED_AT: string;
  UPDATE_AT: string;
  IS_PROJECT: string;                 // プロジェクトフラグ
  
  // 拡張フィールド
  PROJECT_NOTE: string;               // 備考
  SPARE1: string;                     // 予備フィールド1
  SPARE2: string;                     // 予備フィールド2
  SPARE3: string;                     // 予備フィールド3
}
```

#### プロジェクト状態 (ProjectStatus)
```typescript
enum ProjectStatus {
  PLANNING = 'planning',           // 企画中
  IN_PROGRESS = 'in_progress',     // 進行中
  ON_HOLD = 'on_hold',            // 一時停止
  COMPLETED = 'completed',         // 完了
  CANCELLED = 'cancelled'          // キャンセル
}
```

#### プロジェクトメンバー (ProjectMember)
```typescript
interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectRole;
  assigned_at: string;
  assigned_by: string;
  is_active: boolean;
}

enum ProjectRole {
  PROJECT_MANAGER = 'project_manager', // プロジェクトマネージャー
  DEVELOPER = 'developer',             // 開発者
  DESIGNER = 'designer',               // 設計者
  TESTER = 'tester',                   // テスター
  VIEWER = 'viewer'                    // 閲覧者
}
```

#### ユーザー (User)
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  department: string;
  position: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

### 2. ドメインサービス

#### ProjectService
- プロジェクトの作成・更新・削除
- プロジェクト状態の変更
- プロジェクト検索・フィルタリング
- プロジェクト統計情報の取得

#### ProjectMemberService
- メンバーの追加・削除・権限変更
- プロジェクト参加履歴の管理
- メンバー一覧の取得

#### NotificationService
- プロジェクト状態変更の通知
- メンバー追加・削除の通知
- 期限切れプロジェクトの警告

## 🏛️ アーキテクチャ設計

### 1. レイヤー構造

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│  (Pages, Components, UI)           │
├─────────────────────────────────────┤
│           Application Layer         │
│  (tRPC Hooks, Custom Hooks)        │
├─────────────────────────────────────┤
│           Domain Layer              │
│  (tRPC Routers, Services)          │
├─────────────────────────────────────┤
│           Infrastructure Layer      │
│  (Database, DAL)                   │
└─────────────────────────────────────┘
```

### 2. フォルダ構造

```
src/
├── app/
│   ├── manage/                    # プロジェクト管理メインページ
│   │   ├── page.tsx              # プロジェクト一覧
│   │   ├── [project_id]/         # プロジェクト詳細
│   │   │   ├── page.tsx          # プロジェクト詳細ページ
│   │   │   ├── edit/             # プロジェクト編集
│   │   │   │   └── page.tsx      # 編集ページ
│   │   │   ├── members/          # メンバー管理
│   │   │   │   └── page.tsx      # メンバー管理ページ
│   │   │   └── settings/         # プロジェクト設定
│   │   │       └── page.tsx      # 設定ページ
│   │   ├── create/               # プロジェクト作成
│   │   │   └── page.tsx          # 作成ページ
│   │   └── components/           # 管理画面専用コンポーネント
│   │       ├── ProjectList.tsx   # プロジェクト一覧コンポーネント
│   │       ├── ProjectForm.tsx   # プロジェクトフォーム
│   │       ├── ProjectDetail.tsx # プロジェクト詳細
│   │       └── MemberManagement.tsx # メンバー管理
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts      # tRPC HTTPハンドラー
├── components/
│   ├── project/                  # プロジェクト関連コンポーネント
│   ├── member/                   # メンバー関連コンポーネント
│   └── ui/                       # 共通UIコンポーネント
├── hooks/
│   ├── useProjectData.ts         # プロジェクト関連フック
│   ├── useProjectMembers.ts      # メンバー関連フック
│   └── useProjectList.ts         # プロジェクト一覧フック
├── lib/
│   ├── trpc/
│   │   ├── client.ts             # createTRPCReact設定
│   │   ├── Provider.tsx          # 手動Provider設定
│   │   ├── trpc.ts               # プロシージャヘルパー
│   │   └── routers/
│   │       ├── _app.ts           # メインアプリルーター
│   │       ├── project.ts        # プロジェクトルーター
│   │       ├── member.ts         # メンバールーター
│   │       └── user.ts           # ユーザールーター
│   └── db/                       # データアクセス層
│       ├── db_advanced.ts
│       ├── db_connection.ts
│       ├── db_CRUD.ts
│       ├── db_DeleteTable.ts
│       └── db_GetData.ts
├── types/
│   ├── project.ts                # プロジェクト型定義
│   ├── member.ts                 # メンバー型定義
│   └── user.ts                   # ユーザー型定義
└── store/
    ├── projectStore.ts           # プロジェクト状態管理
    └── memberStore.ts            # メンバー状態管理
```

## 🎯 機能要件

### 1. プロジェクト管理機能

#### 1.1 プロジェクト一覧表示
- **機能**: プロジェクトの一覧表示
- **要件**:
  - ページネーション対応
  - 検索機能（プロジェクト名、クライアント名）
  - フィルタリング（ステータス、分類、予算グレード）
  - ソート機能（作成日、更新日、開始日）
  - 一括操作（削除、ステータス変更）

#### 1.2 プロジェクト作成
- **機能**: 新規プロジェクトの作成
- **要件**:
  - 必須項目のバリデーション（Zod）
  - プロジェクトIDの自動生成
  - 初期メンバーの設定
  - テンプレート機能

#### 1.3 プロジェクト編集
- **機能**: 既存プロジェクトの編集
- **要件**:
  - 権限チェック
  - 変更履歴の記録
  - バリデーション（Zod）
  - リアルタイム保存

#### 1.4 プロジェクト詳細表示
- **機能**: プロジェクトの詳細情報表示
- **要件**:
  - 基本情報表示
  - メンバー一覧表示
  - 進捗状況表示
  - 関連ファイル表示

### 2. メンバー管理機能

#### 2.1 メンバー追加
- **機能**: プロジェクトへのメンバー追加
- **要件**:
  - ユーザー検索機能
  - ロール選択
  - 権限設定
  - 通知送信

#### 2.2 メンバー削除
- **機能**: プロジェクトからのメンバー削除
- **要件**:
  - 確認ダイアログ
  - 権限チェック
  - 通知送信

#### 2.3 権限管理
- **機能**: メンバーの権限変更
- **要件**:
  - ロール変更
  - 権限の詳細設定
  - 変更履歴記録

### 3. 状態管理機能

#### 3.1 プロジェクト状態変更
- **機能**: プロジェクトの状態変更
- **要件**:
  - 状態遷移ルール
  - 自動通知
  - 履歴記録
  - 承認ワークフロー

#### 3.2 進捗管理
- **機能**: プロジェクトの進捗管理
- **要件**:
  - 進捗率の更新
  - マイルストーン管理
  - 遅延警告
  - レポート生成

## 🔧 技術実装（tRPC版）

### 1. tRPCルーター設計

#### プロジェクトルーター
```typescript
// lib/trpc/routers/project.ts
export const projectRouter = createTRPCRouter({
  // 全件取得
  getAll: publicProcedure
    .input(ProjectSearchSchema)
    .query(async ({ input }) => {
      // 実装
    }),

  // ID指定取得
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // 実装
    }),

  // 作成
  create: publicProcedure
    .input(CreateProjectSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 更新
  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: UpdateProjectSchema,
    }))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 削除
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 検索
  search: publicProcedure
    .input(ProjectSearchSchema)
    .query(async ({ input }) => {
      // 実装
    }),
});
```

#### メンバールーター
```typescript
// lib/trpc/routers/member.ts
export const memberRouter = createTRPCRouter({
  // プロジェクトのメンバー一覧取得
  getByProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      // 実装
    }),

  // メンバー追加
  add: publicProcedure
    .input(AddMemberSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // メンバー削除
  remove: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // メンバー権限変更
  updateRole: publicProcedure
    .input(z.object({
      id: z.string(),
      role: UpdateMemberSchema,
    }))
    .mutation(async ({ input }) => {
      // 実装
    }),
});
```

### 2. カスタムフック設計

#### useProjectData
```typescript
// hooks/useProjectData.ts
export const useProjectAll = (filters: ProjectSearchInput) => {
  return trpc.project.getAll.useQuery(filters, {
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
};

export const useProjectMutations = () => {
  const utils = trpc.useUtils();
  
  const createMutation = trpc.project.create.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.search.invalidate();
    }
  });

  const updateMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.search.invalidate();
    }
  });

  const deleteMutation = trpc.project.delete.useMutation({
    onSuccess: () => {
      void utils.project.getAll.invalidate();
      void utils.project.search.invalidate();
    }
  });

  return { createMutation, updateMutation, deleteMutation };
};
```

### 3. コンポーネント設計

#### ProjectList
- プロジェクト一覧表示
- 検索・フィルタリング機能
- ページネーション
- 一括操作

#### ProjectForm
- プロジェクト作成・編集フォーム
- Zodバリデーション
- リアルタイム保存

#### ProjectDetail
- プロジェクト詳細表示
- タブ形式での情報表示
- アクション実行

#### MemberManagement
- メンバー一覧表示
- メンバー追加・削除
- 権限変更

## 📊 データベース設計

### 1. テーブル構造

#### PROJECTS テーブル（既存）
```sql
CREATE TABLE PROJECTS (
  rowid INTEGER PRIMARY KEY,
  PROJECT_ID TEXT UNIQUE NOT NULL,
  PROJECT_NAME TEXT NOT NULL,
  PROJECT_DESCRIPTION TEXT,
  PROJECT_START_DATE TEXT,
  PROJECT_STATUS TEXT DEFAULT 'planning',
  PROJECT_CLIENT_NAME TEXT,
  PROJECT_START_ENDDATE TEXT,
  PROJECT_NOTE TEXT,
  CREATED_AT TEXT DEFAULT CURRENT_TIMESTAMP,
  UPDATE_AT TEXT DEFAULT CURRENT_TIMESTAMP,
  PROJECT_CLASSIFICATION TEXT,
  PROJECT_BUDGENT_GRADE TEXT,
  installationDate TEXT,
  drawingCompletionDate TEXT,
  PROJECT_EQUIPMENT_CATEGORY TEXT,
  PROJECT_SYOHIN_CATEGORY TEXT,
  SPARE1 TEXT,
  SPARE2 TEXT,
  SPARE3 TEXT,
  IS_PROJECT TEXT DEFAULT '1'
);
```

#### PROJECT_MEMBERS テーブル（新規）
```sql
CREATE TABLE PROJECT_MEMBERS (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  assigned_at TEXT DEFAULT CURRENT_TIMESTAMP,
  assigned_by TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (project_id) REFERENCES PROJECTS(PROJECT_ID),
  FOREIGN KEY (user_id) REFERENCES USERS(id),
  UNIQUE(project_id, user_id)
);
```

#### USERS テーブル（新規）
```sql
CREATE TABLE USERS (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT,
  position TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### PROJECT_HISTORY テーブル（新規）
```sql
CREATE TABLE PROJECT_HISTORY (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_by TEXT NOT NULL,
  changed_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES PROJECTS(PROJECT_ID),
  FOREIGN KEY (changed_by) REFERENCES USERS(id)
);
```

## 🚀 実装計画

### Phase 1: 基盤構築
1. **型定義の整備**
   - `src/types/project.ts` - プロジェクト関連の型定義
   - `src/types/member.ts` - メンバー関連の型定義
   - `src/types/user.ts` - ユーザー関連の型定義

2. **tRPCルーターの実装**
   - `src/lib/trpc/routers/project.ts` - プロジェクトルーター
   - `src/lib/trpc/routers/member.ts` - メンバールーター
   - `src/lib/trpc/routers/user.ts` - ユーザールーター

3. **データベーススキーマの更新**
   - 新規テーブルの作成
   - 既存テーブルの拡張

4. **カスタムフックの作成**
   - `src/hooks/useProjectData.ts` - プロジェクト関連フック
   - `src/hooks/useProjectMembers.ts` - メンバー関連フック

### Phase 2: プロジェクト管理機能
1. **プロジェクト一覧ページ**
   - `src/app/manage/page.tsx` - メインページ
   - `src/app/manage/components/ProjectList.tsx` - 一覧コンポーネント

2. **プロジェクト作成・編集機能**
   - `src/app/manage/create/page.tsx` - 作成ページ
   - `src/app/manage/[project_id]/edit/page.tsx` - 編集ページ
   - `src/app/manage/components/ProjectForm.tsx` - フォームコンポーネント

3. **プロジェクト詳細ページ**
   - `src/app/manage/[project_id]/page.tsx` - 詳細ページ
   - `src/app/manage/components/ProjectDetail.tsx` - 詳細コンポーネント

### Phase 3: メンバー管理機能
1. **メンバー管理ページ**
   - `src/app/manage/[project_id]/members/page.tsx` - メンバー管理ページ
   - `src/app/manage/components/MemberManagement.tsx` - メンバー管理コンポーネント

2. **権限管理機能**
   - ロール変更機能
   - 権限チェック機能

### Phase 4: 高度な機能
1. **進捗管理機能**
2. **レポート機能**
3. **通知システム**
4. **承認ワークフロー**

## 🔒 セキュリティ考慮事項

### 1. 認証・認可
- JWTトークンによる認証
- ロールベースアクセス制御（RBAC）
- プロジェクトレベルの権限管理

### 2. データ保護
- 入力値のサニタイゼーション
- SQLインジェクション対策
- XSS対策

### 3. 監査ログ
- 重要な操作のログ記録
- 変更履歴の保持
- アクセスログの記録

## 📈 パフォーマンス考慮事項

### 1. データベース最適化
- インデックスの適切な設定
- クエリの最適化
- ページネーションの実装

### 2. フロントエンド最適化
- コンポーネントのメモ化
- 遅延読み込み
- 仮想スクロール

### 3. キャッシュ戦略
- React Queryによるキャッシュ
- tRPCのキャッシュ機能活用
- 状態管理の最適化

## 🧪 テスト戦略

### 1. 単体テスト
- tRPCプロシージャのテスト
- カスタムフックのテスト
- ユーティリティ関数のテスト

### 2. 統合テスト
- APIエンドポイントのテスト
- データベース操作のテスト
- 認証・認可のテスト

### 3. E2Eテスト
- ユーザーフローのテスト
- エラーケースのテスト
- パフォーマンステスト

## 📝 今後の拡張性

### 1. 機能拡張
- ファイル管理機能
- コメント・チャット機能
- カレンダー連携
- 外部システム連携

### 2. 技術拡張
- マイクロサービス化
- リアルタイム通信（WebSocket）
- モバイルアプリ対応
- オフライン対応

---

この設計ドキュメントに基づいて、tRPCを使用したプロジェクト管理アプリを段階的に実装していきます。各フェーズでの詳細な実装計画や技術的な決定事項については、実装時に追加で検討いたします。
