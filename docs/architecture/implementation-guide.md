# アーキテクチャ実装ガイド

## 概要

このドキュメントは、PME DATAHUB システムの具体的な実装指針を提供する。クリーンアーキテクチャの原則に基づき、各層の実装方法を詳細に定義する。

## 1. ディレクトリ構造

### 1.1 全体構造
```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (tRPC)
│   ├── (auth)/                   # 認証関連ページ
│   ├── (main)/                   # メインアプリケーション
│   └── globals.css               # グローバルスタイル
├── components/                   # 再利用可能コンポーネント
│   ├── ui/                       # 基本UIコンポーネント
│   ├── layout/                   # レイアウトコンポーネント
│   └── forms/                    # フォームコンポーネント
├── lib/                          # ユーティリティ・設定
│   ├── prisma/                   # データベースクライアント
│   ├── trpc/                     # tRPC設定
│   ├── validations/              # Zodスキーマ
│   └── utils/                    # 汎用ユーティリティ
├── hooks/                        # カスタムフック
├── stores/                       # Zustandストア
├── types/                        # TypeScript型定義
└── utils/                        # ヘルパー関数
```

### 1.2 層別構造の対応
```
ドメイン層          → types/domain/
アプリケーション層    → lib/use-cases/
インフラストラクチャ層 → lib/repositories/
プレゼンテーション層  → components/, app/
```

## 2. ドメイン層の実装

### 2.1 エンティティ定義
```typescript
// types/domain/project.ts
export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// types/domain/value-objects.ts
export class ProjectId {
  constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Project ID cannot be empty');
    }
  }

  toString(): string {
    return this.value;
  }

  equals(other: ProjectId): boolean {
    return this.value === other.value;
  }
}
```

### 2.2 ドメインサービス
```typescript
// lib/domain/services/project-service.ts
export class ProjectDomainService {
  static canStartProject(project: Project): boolean {
    return project.status === 'draft' &&
           project.startDate &&
           project.startDate <= new Date();
  }

  static calculateProjectProgress(project: Project, tasks: Task[]): number {
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / tasks.length) * 100);
  }
}
```

## 3. アプリケーション層の実装

### 3.1 ユースケース実装
```typescript
// lib/use-cases/project/create-project.ts
export interface CreateProjectInput {
  name: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CreateProjectOutput {
  project: Project;
}

export class CreateProjectUseCase {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly eventPublisher: IEventPublisher
  ) {}

  async execute(input: CreateProjectInput): Promise<CreateProjectOutput> {
    // バリデーション
    if (!input.name || input.name.trim().length === 0) {
      throw new ValidationError('Project name is required');
    }

    // ドメインルール適用
    const project = Project.create({
      id: ProjectId.generate(),
      name: input.name.trim(),
      description: input.description?.trim(),
      startDate: input.startDate,
      endDate: input.endDate,
      status: 'draft'
    });

    // 永続化
    await this.projectRepository.save(project);

    // イベント発行
    await this.eventPublisher.publish(
      new ProjectCreatedEvent(project.id, project.name)
    );

    return { project };
  }
}
```

### 3.2 アプリケーションサービス
```typescript
// lib/use-cases/project/project-application-service.ts
export class ProjectApplicationService {
  constructor(
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly getProjectUseCase: GetProjectUseCase
  ) {}

  async createProject(input: CreateProjectInput): Promise<Project> {
    const result = await this.createProjectUseCase.execute(input);
    return result.project;
  }

  async updateProject(id: string, input: UpdateProjectInput): Promise<Project> {
    const result = await this.updateProjectUseCase.execute({ id, ...input });
    return result.project;
  }

  async getProject(id: string): Promise<Project | null> {
    const result = await this.getProjectUseCase.execute({ id });
    return result.project;
  }
}
```

## 4. インフラストラクチャ層の実装

### 4.1 リポジトリ実装
```typescript
// lib/repositories/interfaces/project-repository.ts
export interface IProjectRepository {
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  save(project: Project): Promise<void>;
  update(project: Project): Promise<void>;
  delete(id: string): Promise<void>;
}

// lib/repositories/implementations/prisma-project-repository.ts
export class PrismaProjectRepository implements IProjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Project | null> {
    const data = await this.prisma.project.findUnique({
      where: { id }
    });

    return data ? this.mapToDomain(data) : null;
  }

  async save(project: Project): Promise<void> {
    const data = this.mapToPersistence(project);

    await this.prisma.project.create({ data });
  }

  private mapToDomain(data: any): Project {
    return Project.create({
      id: data.id,
      name: data.name,
      description: data.description,
      status: data.status,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    });
  }

  private mapToPersistence(project: Project): any {
    return {
      id: project.id.toString(),
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate?.toISOString(),
      endDate: project.endDate?.toISOString(),
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    };
  }
}
```

### 4.2 tRPC ルーター実装
```typescript
// lib/trpc/routers/project-router.ts
export const projectRouter = router({
  create: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const useCase = new CreateProjectUseCase(
        ctx.repositories.project,
        ctx.eventPublisher
      );

      return await useCase.execute(input);
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const useCase = new GetProjectUseCase(ctx.repositories.project);
      return await useCase.execute(input);
    }),

  list: protectedProcedure
    .input(listProjectsSchema)
    .query(async ({ input, ctx }) => {
      const useCase = new ListProjectsUseCase(ctx.repositories.project);
      return await useCase.execute(input);
    })
});
```

## 5. プレゼンテーション層の実装

### 5.1 ページコンポーネント
```typescript
// app/(main)/projects/page.tsx
export default function ProjectsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">プロジェクト一覧</h1>
        <Button asChild>
          <Link href="/projects/new">新規作成</Link>
        </Button>
      </div>

      <ProjectsList />
    </div>
  );
}
```

### 5.2 機能コンポーネント
```typescript
// components/projects/projects-list.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc/client';

export function ProjectsList() {
  const { data: projects, isLoading, error } = trpc.projects.list.useQuery({
    limit: 20,
    offset: 0
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました</div>;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects?.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### 5.3 Zustand ストア
```typescript
// stores/project-store.ts
interface ProjectState {
  selectedProject: Project | null;
  filters: ProjectFilters;
  actions: {
    setSelectedProject: (project: Project | null) => void;
    updateFilters: (filters: Partial<ProjectFilters>) => void;
    clearFilters: () => void;
  };
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  selectedProject: null,
  filters: {
    status: 'all',
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  },

  actions: {
    setSelectedProject: (project) => set({ selectedProject: project }),

    updateFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),

    clearFilters: () =>
      set({
        filters: {
          status: 'all',
          search: '',
          sortBy: 'updatedAt',
          sortOrder: 'desc'
        }
      })
  }
}));
```

## 6. バリデーション実装

### 6.1 Zod スキーマ
```typescript
// lib/validations/project-schemas.ts
export const createProjectSchema = z.object({
  name: z.string()
    .min(1, 'プロジェクト名は必須です')
    .max(100, 'プロジェクト名は100文字以内で入力してください'),

  description: z.string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional(),

  startDate: z.date()
    .optional()
    .refine((date) => !date || date >= new Date(), {
      message: '開始日は今日以降の日付を指定してください'
    }),

  endDate: z.date()
    .optional()
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.endDate >= data.startDate;
  }
  return true;
}, {
  message: '終了日は開始日以降の日付を指定してください',
  path: ['endDate']
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().uuid('無効なプロジェクトIDです')
});
```

## 7. エラーハンドリング

### 7.1 カスタムエラークラス
```typescript
// lib/errors/domain-errors.ts
export class DomainError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource}が見つかりません`, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message = '権限がありません') {
    super(message, 'UNAUTHORIZED');
  }
}
```

### 7.2 エラーハンドリングミドルウェア
```typescript
// lib/trpc/middleware/error-handler.ts
export const errorHandlerMiddleware = middleware(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error instanceof DomainError) {
      throw new TRPCError({
        code: error.code === 'VALIDATION_ERROR' ? 'BAD_REQUEST' :
              error.code === 'NOT_FOUND' ? 'NOT_FOUND' :
              error.code === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }

    console.error('Unhandled error:', error);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: '内部サーバーエラーが発生しました'
    });
  }
});
```

## 8. テスト実装

### 8.1 単体テスト例
```typescript
// __tests__/domain/project.test.ts
describe('Project', () => {
  it('should create a valid project', () => {
    const project = Project.create({
      id: ProjectId.generate(),
      name: 'Test Project',
      status: 'draft'
    });

    expect(project.name).toBe('Test Project');
    expect(project.status).toBe('draft');
  });

  it('should throw error for empty name', () => {
    expect(() => {
      Project.create({
        id: ProjectId.generate(),
        name: '',
        status: 'draft'
      });
    }).toThrow(ValidationError);
  });
});

// __tests__/use-cases/create-project.test.ts
describe('CreateProjectUseCase', () => {
  let mockRepository: jest.Mocked<IProjectRepository>;
  let useCase: CreateProjectUseCase;

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };

    useCase = new CreateProjectUseCase(mockRepository, mockEventPublisher);
  });

  it('should create project successfully', async () => {
    const input = { name: 'New Project' };

    const result = await useCase.execute(input);

    expect(result.project.name).toBe('New Project');
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

## 9. パフォーマンス最適化

### 9.1 データベース最適化
```sql
-- インデックスの作成
CREATE INDEX idx_projects_status_updated ON projects(status, updated_at DESC);
CREATE INDEX idx_projects_name ON projects USING gin(to_tsvector('japanese', name));

-- 複合インデックスの活用
CREATE INDEX idx_project_members_user_status ON project_members(user_id, status);
```

### 9.2 React 最適化
```typescript
// コンポーネントのメモ化
export const ProjectCard = memo(({ project }: ProjectCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant={getStatusVariant(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
      </CardContent>
    </Card>
  );
});

// カスタムフックの最適化
export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => api.getProjects(filters),
    staleTime: 5 * 60 * 1000, // 5分
    gcTime: 10 * 60 * 1000,   // 10分
  });
}
```

---

**作成日**: 2025年10月17日
**最終更新**: 2025年10月17日
**バージョン**: 1.0
