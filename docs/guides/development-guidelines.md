# 開発ガイドライン

## 概要

このドキュメントは、PME DATAHUB プロジェクトの開発における標準的な手順、コーディング規約、品質管理について定義する。

## 1. 開発環境のセットアップ

### 1.1 必須環境
```bash
# Node.js バージョン
Node.js: 18.17.0 以上
npm: 9.0.0 以上

# データベース
SQLite: 5.1.0 以上

# IDE
Visual Studio Code (推奨)
  - 拡張機能: TypeScript, ESLint, Prettier
```

### 1.2 環境構築手順
```bash
# リポジトリクローン
git clone <repository-url>
cd pmedatahub

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# データベース初期化
npx prisma generate
npx prisma db push

# 開発サーバー起動
npm run dev
```

## 2. コーディング規約

### 2.1 命名規則

#### ファイル命名
```typescript
// ✅ 正しい例
user-repository.ts
create-project-use-case.ts
project-card.tsx
project-store.ts

// ❌ 避ける例
UserRepository.ts     // PascalCase
userRepository.ts     // camelCase
repo.ts              // 略語
user_repo.ts         // snake_case
```

#### 変数・関数命名
```typescript
// ✅ クラス・インターフェース
class ProjectRepository {}        // PascalCase
interface IProjectService {}      // PascalCase + I prefix

// ✅ 変数・関数
const projectName = 'Test';       // camelCase
function createProject() {}       // camelCase
const isActive = true;           // camelCase + is/has prefix

// ✅ 定数
const MAX_RETRY_COUNT = 3;       // UPPER_SNAKE_CASE
const API_BASE_URL = '/api';     // UPPER_SNAKE_CASE
```

#### データベース命名
```sql
-- ✅ テーブル
projects              -- 複数形
project_members       -- snake_case
user_settings         -- snake_case

-- ✅ カラム
project_id           -- snake_case
created_at           -- snake_case
is_active            -- snake_case

-- ✅ インデックス
idx_projects_status  -- idx_[table]_[column]
idx_projects_created_at_desc
```

### 2.2 コード構造

#### TypeScript インターフェース
```typescript
// ✅ 適切なインターフェース定義
interface Project {
  readonly id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  readonly createdAt: Date;
  updatedAt: Date;
}

// ✅ ジェネリック型の使用
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  update(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
```

#### React コンポーネント
```typescript
// ✅ 関数コンポーネント
interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const handleEdit = useCallback(() => {
    onEdit?.(project);
  }, [onEdit, project]);

  const handleDelete = useCallback(() => {
    onDelete?.(project.id);
  }, [onDelete, project.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
      </CardHeader>
      <CardActions>
        <Button onClick={handleEdit}>編集</Button>
        <Button onClick={handleDelete} variant="destructive">
          削除
        </Button>
      </CardActions>
    </Card>
  );
}
```

#### カスタムフック
```typescript
// ✅ カスタムフックの命名規則
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectApi.getProjects(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProject() {
  const utils = trpc.useUtils();

  return trpc.projects.create.useMutation({
    onSuccess: () => {
      utils.projects.list.invalidate();
    },
  });
}
```

### 2.3 コメント規約

#### ビジネスロジックコメント（日本語）
```typescript
// プロジェクトのステータスが「完了」であるかを判定
// 完了条件: 全てのタスクが完了し、品質チェックが通っていること
if (project.status === 'completed') {
  // 完了プロジェクトの処理を実行
  await completeProject(project.id);
}
```

#### 技術的コメント（英語）
```typescript
// Calculate project progress based on completed tasks
// Formula: (completed tasks / total tasks) * 100
const progress = totalTasks > 0
  ? Math.round((completedTasks / totalTasks) * 100)
  : 0;
```

#### JSDoc コメント
```typescript
/**
 * プロジェクト作成ユースケース
 * プロジェクトの基本情報を検証し、新規プロジェクトを作成する
 */
export class CreateProjectUseCase {
  /**
   * プロジェクトを作成する
   * @param input 作成に必要な情報
   * @returns 作成されたプロジェクト
   * @throws ValidationError 入力値が不正な場合
   * @throws DuplicateError 同名のプロジェクトが既に存在する場合
   */
  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    // 実装...
  }
}
```

## 3. コミット規約

### 3.1 コミットメッセージ形式
```
[種類] 簡潔な説明

詳細な説明（必要に応じて）
```

#### コミット種類
- `[feat]`: 新機能の追加
- `[fix]`: バグ修正
- `[docs]`: ドキュメント更新
- `[style]`: コードスタイル修正（機能変更なし）
- `[refactor]`: リファクタリング
- `[test]`: テスト追加・修正
- `[chore]`: その他の変更（ビルド、設定など）

#### コミットメッセージ例
```bash
# ✅ 良い例
[feat] プロジェクト一覧にフィルタ機能を追加

ユーザーがプロジェクトをステータス、カテゴリ、日付で
フィルタリングできるようになりました。

[fix] プロジェクト作成時のバリデーションエラーを修正

プロジェクト名が空文字の場合に適切にエラーメッセージを表示するよう修正

# ❌ 悪い例
[fix] bug fix
update
修正
```

### 3.2 コミット粒度
- **1コミット1機能**: 関連する変更をまとめてコミット
- **アトミックコミット**: コンパイルエラーを起こさない状態を維持
- **レビュアブル**: 変更内容が理解しやすいサイズ

## 4. ブランチ戦略

### 4.1 Git Flow 採用
```
main (本番用ブランチ)
├── develop (開発統合ブランチ)
│   ├── feature/PROJ-123-user-authentication
│   ├── feature/PROJ-124-project-dashboard
│   └── bugfix/PROJ-125-validation-error
└── release/v1.2.0
```

### 4.2 ブランチ命名規則
```bash
# 機能開発
feature/PROJ-123-user-login-form

# バグ修正
bugfix/PROJ-125-api-validation-error

# ホットフィックス（本番緊急対応）
hotfix/PROJ-130-critical-security-patch

# リリース
release/v1.2.0
```

### 4.3 マージ戦略
- **Squash Merge**: featureブランチを統合する際
- **Merge Commit**: releaseブランチを統合する際
- **Rebase**: developブランチの更新を取り込む際

## 5. コードレビュープロセス

### 5.1 レビューポイント
- **機能要件**: 要件通りに実装されているか
- **コード品質**: 規約に従っているか
- **セキュリティ**: 脆弱性がないか
- **パフォーマンス**: 効率的な実装か
- **テスト**: 適切なテストが記述されているか

### 5.2 レビューコメントテンプレート
```markdown
## ✅ 承認ポイント
- [x] 機能要件を満たしている
- [x] コーディング規約を守っている
- [x] 適切なテストが記述されている

## 💡 改善提案
- [ ] エラーハンドリングを追加
- [ ] パフォーマンスを最適化

## ❓ 質問
- この実装の意図は？
- 別のアプローチを検討したか？
```

## 6. テスト方針

### 6.1 テスト種類と責任
```typescript
// 単体テスト - 開発者責任
describe('ProjectService', () => {
  it('should calculate progress correctly', () => {
    // テスト実装
  });
});

// 統合テスト - 開発者責任
describe('Project Creation Flow', () => {
  it('should create project with valid data', () => {
    // APIからUIまでの一連の流れをテスト
  });
});

// E2Eテスト - QAチーム責任
describe('Project Management', () => {
  it('should allow user to create and edit projects', () => {
    // ブラウザ操作によるテスト
  });
});
```

### 6.2 テストカバレッジ目標
- **単体テスト**: 80%以上
- **統合テスト**: 主要フロー100%
- **E2Eテスト**: クリティカルパス100%

### 6.3 テスト命名規則
```typescript
// テストファイル
project-service.test.ts
create-project.use-case.test.ts

// テストケース
describe('ProjectService', () => {
  describe('calculateProgress', () => {
    it('should return 0 when no tasks exist', () => {
      // テスト実装
    });

    it('should return 100 when all tasks are completed', () => {
      // テスト実装
    });
  });
});
```

## 7. パフォーマンス基準

### 7.1 レスポンスタイム
```typescript
// APIレスポンスタイム
const API_RESPONSE_TIME_LIMIT = 1000; // 1秒

// ページロードタイム
const PAGE_LOAD_TIME_LIMIT = 3000; // 3秒

// データベースクエリ
const DB_QUERY_TIME_LIMIT = 100; // 100ms
```

### 7.2 バンドルサイズ
```typescript
// 初期バンドルサイズ制限
const INITIAL_BUNDLE_SIZE_LIMIT = 500 * 1024; // 500KB

// ベンダーバンドルサイズ制限
const VENDOR_BUNDLE_SIZE_LIMIT = 300 * 1024; // 300KB
```

### 7.3 パフォーマンス測定
```typescript
// Web Vitals 監視
export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch (metric.name) {
    case 'FCP':
      console.log(`First Contentful Paint: ${metric.value}ms`);
      break;
    case 'LCP':
      console.log(`Largest Contentful Paint: ${metric.value}ms`);
      break;
    case 'CLS':
      console.log(`Cumulative Layout Shift: ${metric.value}`);
      break;
    case 'FID':
      console.log(`First Input Delay: ${metric.value}ms`);
      break;
    case 'TTFB':
      console.log(`Time to First Byte: ${metric.value}ms`);
      break;
  }
}
```

## 8. セキュリティチェックリスト

### 8.1 コードレビュ時チェック
- [ ] SQLインジェクション対策
- [ ] XSS対策（サニタイズ処理）
- [ ] CSRF対策（トークン検証）
- [ ] 認証・認可の実装
- [ ] 機密情報の適切な扱い

### 8.2 依存関係チェック
```bash
# 脆弱性スキャン
npm audit

# 依存関係更新
npm update

# 古いパッケージ確認
npm outdated
```

## 9. 継続的インテグレーション

### 9.1 CI パイプライン
```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm test -- --coverage
      - run: npm run build
```

### 9.2 品質ゲート
- **テスト成功率**: 100%
- **型チェック**: エラーなし
- **Lint**: エラーなし
- **セキュリティスキャン**: 脆弱性なし
- **テストカバレッジ**: 閾値以上

---

## 付録: 便利なスクリプト

### 開発支援スクリプト
```bash
# package.json に追加するスクリプト例
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  }
}
```

### Pre-commit フック
```bash
#!/bin/sh
# .husky/pre-commit

# 型チェック
npm run typecheck

# Lint チェック
npm run lint

# テスト実行
npm run test
```

---

**作成日**: 2025年10月17日
**最終更新**: 2025年10月17日
**バージョン**: 1.0
