# 大製番体系技術管理システム API設計ガイドライン

## 📋 概要

### 目的
大製番体系技術管理システムのtRPC API設計と実装ガイドライン

### 技術スタック
- **tRPC v11**: エンドツーエンド型安全API
- **Zod**: バリデーション・型定義
- **SQLite**: データベース（achievements.db）
- **DAL層**: 統一データアクセス層

## 🎯 API設計原則

### 1. 型安全性
- TypeScript + Zodによる完全型安全
- 入力・出力の型定義を明確化
- コンパイル時エラーの検出

### 2. 統一レスポンス形式
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### 3. エラーハンドリング
- TRPCErrorによる標準化
- 適切なHTTPステータスコード
- 詳細なエラーメッセージ

### 4. 権限管理
- ロールベースアクセス制御
- 操作権限の明確化
- セキュリティ強化

## 🔧 tRPCルーター構造

### 1. 大製番体系ルーター (largeSeibanRouter)

#### クエリプロシージャ
```typescript
const largeSeibanRouter = router({
  // 大製番体系一覧取得
  getAll: publicProcedure
    .input(z.object({
      status: z.enum(['active', 'inactive', 'archived', 'deprecated']).optional(),
      category: z.string().optional(),
      orderBy: z.enum(['name', 'created_at', 'order_num']).default('order_num'),
      orderDirection: z.enum(['asc', 'desc']).default('asc'),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ input }) => {
      // 実装
    }),

  // 大製番体系詳細取得
  getById: publicProcedure
    .input(z.string().min(1, "大製番IDは必須です"))
    .query(async ({ input }) => {
      // 実装
    }),

  // 大製番体系検索
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1, "検索クエリは必須です"),
      category: z.string().optional(),
      status: z.enum(['active', 'inactive', 'archived', 'deprecated']).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ input }) => {
      // 実装
    }),

  // 大製番体系統計情報
  getStats: publicProcedure
    .query(async () => {
      // 実装
    })
});
```

#### ミューテーションプロシージャ
```typescript
const largeSeibanRouter = router({
  // 大製番体系作成
  create: publicProcedure
    .input(createLargeSeibanSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 大製番体系更新
  update: publicProcedure
    .input(updateLargeSeibanSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 大製番体系削除
  delete: publicProcedure
    .input(z.string().min(1, "大製番IDは必須です"))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 大製番体系状態更新
  updateStatus: publicProcedure
    .input(z.object({
      large_seiban_id: z.string().min(1, "大製番IDは必須です"),
      status: z.enum(['active', 'inactive', 'archived', 'deprecated'])
    }))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 大製番体系順序更新
  updateOrder: publicProcedure
    .input(z.object({
      large_seiban_id: z.string().min(1, "大製番IDは必須です"),
      order_num: z.number().int().min(0)
    }))
    .mutation(async ({ input }) => {
      // 実装
    })
});
```

### 2. 中製番体系ルーター (mediumSeibanRouter)

#### クエリプロシージャ
```typescript
const mediumSeibanRouter = router({
  // 中製番体系一覧取得（大製番別）
  getByLargeSeiban: publicProcedure
    .input(z.object({
      large_seiban_id: z.string().min(1, "大製番IDは必須です"),
      status: z.enum(['active', 'inactive', 'archived', 'deprecated']).optional(),
      orderBy: z.enum(['name', 'created_at', 'order_num']).default('order_num'),
      orderDirection: z.enum(['asc', 'desc']).default('asc'),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ input }) => {
      // 実装
    }),

  // 中製番体系詳細取得
  getById: publicProcedure
    .input(z.string().min(1, "中製番IDは必須です"))
    .query(async ({ input }) => {
      // 実装
    }),

  // 中製番体系検索
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1, "検索クエリは必須です"),
      large_seiban_id: z.string().optional(),
      category: z.string().optional(),
      status: z.enum(['active', 'inactive', 'archived', 'deprecated']).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ input }) => {
      // 実装
    })
});
```

#### ミューテーションプロシージャ
```typescript
const mediumSeibanRouter = router({
  // 中製番体系作成
  create: publicProcedure
    .input(createMediumSeibanSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 中製番体系更新
  update: publicProcedure
    .input(updateMediumSeibanSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 中製番体系削除
  delete: publicProcedure
    .input(z.string().min(1, "中製番IDは必須です"))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 中製番体系状態更新
  updateStatus: publicProcedure
    .input(z.object({
      medium_seiban_id: z.string().min(1, "中製番IDは必須です"),
      status: z.enum(['active', 'inactive', 'archived', 'deprecated'])
    }))
    .mutation(async ({ input }) => {
      // 実装
    })
});
```

### 3. 検討書ルーター (techDocumentRouter)

#### クエリプロシージャ
```typescript
const techDocumentRouter = router({
  // 検討書一覧取得（中製番別）
  getByMediumSeiban: publicProcedure
    .input(z.object({
      medium_seiban_id: z.string().min(1, "中製番IDは必須です"),
      status: z.enum(['draft', 'under_review', 'approved', 'published', 'archived', 'rejected']).optional(),
      type: z.enum(['technical_review', 'design_review', 'feasibility_study', 'specification', 'manual', 'report', 'other']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      orderBy: z.enum(['title', 'created_at', 'updated_at', 'priority']).default('created_at'),
      orderDirection: z.enum(['asc', 'desc']).default('desc'),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ input }) => {
      // 実装
    }),

  // 検討書詳細取得
  getById: publicProcedure
    .input(z.string().min(1, "検討書IDは必須です"))
    .query(async ({ input }) => {
      // 実装
    }),

  // 検討書検索
  search: publicProcedure
    .input(z.object({
      query: z.string().min(1, "検索クエリは必須です"),
      medium_seiban_id: z.string().optional(),
      type: z.enum(['technical_review', 'design_review', 'feasibility_study', 'specification', 'manual', 'report', 'other']).optional(),
      status: z.enum(['draft', 'under_review', 'approved', 'published', 'archived', 'rejected']).optional(),
      priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }))
    .query(async ({ input }) => {
      // 実装
    }),

  // 検討書統計情報
  getStats: publicProcedure
    .input(z.object({
      medium_seiban_id: z.string().optional()
    }).optional())
    .query(async ({ input }) => {
      // 実装
    })
});
```

#### ミューテーションプロシージャ
```typescript
const techDocumentRouter = router({
  // 検討書作成
  create: publicProcedure
    .input(createTechDocumentSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 検討書更新
  update: publicProcedure
    .input(updateTechDocumentSchema)
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 検討書削除
  delete: publicProcedure
    .input(z.string().min(1, "検討書IDは必須です"))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 検討書状態更新
  updateStatus: publicProcedure
    .input(z.object({
      document_id: z.string().min(1, "検討書IDは必須です"),
      status: z.enum(['draft', 'under_review', 'approved', 'published', 'archived', 'rejected']),
      reviewer_id: z.string().optional(),
      approved_by: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      // 実装
    }),

  // 検討書ファイルアップロード
  uploadFile: publicProcedure
    .input(z.object({
      document_id: z.string().min(1, "検討書IDは必須です"),
      file: z.any(), // ファイルアップロード処理
      file_type: z.string(),
      file_size: z.number().min(1)
    }))
    .mutation(async ({ input }) => {
      // 実装
    })
});
```

## 📝 バリデーションスキーマ

### 大製番体系スキーマ
```typescript
const createLargeSeibanSchema = z.object({
  large_seiban_id: z.string().min(1, "大製番IDは必須です"),
  large_seiban_name: z.string().min(1, "大製番名は必須です").max(100, "大製番名は100文字以内で入力してください"),
  large_seiban_description: z.string().max(500, "説明は500文字以内で入力してください").optional(),
  large_seiban_category: z.string().max(50, "カテゴリは50文字以内で入力してください").optional(),
  large_seiban_type: z.string().max(50, "タイプは50文字以内で入力してください").optional(),
  large_seiban_status: z.enum(['active', 'inactive', 'archived', 'deprecated']).default('active'),
  order_num: z.number().int().min(0, "表示順序は0以上の整数で入力してください").default(0),
  large_seiban_note: z.string().max(1000, "備考は1000文字以内で入力してください").optional(),
  spare1: z.string().max(100).optional(),
  spare2: z.string().max(100).optional(),
  spare3: z.string().max(100).optional()
});

const updateLargeSeibanSchema = createLargeSeibanSchema.partial().extend({
  large_seiban_id: z.string().min(1, "大製番IDは必須です")
});
```

### 中製番体系スキーマ
```typescript
const createMediumSeibanSchema = z.object({
  medium_seiban_id: z.string().min(1, "中製番IDは必須です"),
  large_seiban_id: z.string().min(1, "大製番IDは必須です"),
  medium_seiban_name: z.string().min(1, "中製番名は必須です").max(100, "中製番名は100文字以内で入力してください"),
  medium_seiban_description: z.string().max(500, "説明は500文字以内で入力してください").optional(),
  medium_seiban_category: z.string().max(50, "カテゴリは50文字以内で入力してください").optional(),
  medium_seiban_type: z.string().max(50, "タイプは50文字以内で入力してください").optional(),
  medium_seiban_status: z.enum(['active', 'inactive', 'archived', 'deprecated']).default('active'),
  order_num: z.number().int().min(0, "表示順序は0以上の整数で入力してください").default(0),
  medium_seiban_note: z.string().max(1000, "備考は1000文字以内で入力してください").optional(),
  spare1: z.string().max(100).optional(),
  spare2: z.string().max(100).optional(),
  spare3: z.string().max(100).optional()
});

const updateMediumSeibanSchema = createMediumSeibanSchema.partial().extend({
  medium_seiban_id: z.string().min(1, "中製番IDは必須です")
});
```

### 検討書スキーマ
```typescript
const createTechDocumentSchema = z.object({
  document_id: z.string().min(1, "検討書IDは必須です"),
  medium_seiban_id: z.string().min(1, "中製番IDは必須です"),
  document_title: z.string().min(1, "検討書タイトルは必須です").max(200, "タイトルは200文字以内で入力してください"),
  document_content: z.string().max(10000, "内容は10000文字以内で入力してください").optional(),
  document_summary: z.string().max(1000, "概要は1000文字以内で入力してください").optional(),
  document_type: z.enum(['technical_review', 'design_review', 'feasibility_study', 'specification', 'manual', 'report', 'other']).default('technical_review'),
  document_status: z.enum(['draft', 'under_review', 'approved', 'published', 'archived', 'rejected']).default('draft'),
  document_category: z.string().max(50, "カテゴリは50文字以内で入力してください").optional(),
  document_priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  author_id: z.string().optional(),
  document_note: z.string().max(1000, "備考は1000文字以内で入力してください").optional(),
  spare1: z.string().max(100).optional(),
  spare2: z.string().max(100).optional(),
  spare3: z.string().max(100).optional()
});

const updateTechDocumentSchema = createTechDocumentSchema.partial().extend({
  document_id: z.string().min(1, "検討書IDは必須です")
});
```

## 🔐 認証・権限管理

### 権限チェック関数
```typescript
// 権限チェック関数
const checkPermission = (user: User, permission: TechSystemPermission): boolean => {
  const userRole = getUserRole(user);
  return userRole.permissions.includes(permission);
};

// 大製番体系権限チェック
const checkLargeSeibanPermission = (user: User, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
  const permissions: TechSystemPermission[] = {
    view: TechSystemPermission.VIEW,
    create: TechSystemPermission.CREATE,
    edit: TechSystemPermission.EDIT,
    delete: TechSystemPermission.DELETE
  };
  return checkPermission(user, permissions[action]);
};

// 中製番体系権限チェック
const checkMediumSeibanPermission = (user: User, action: 'view' | 'create' | 'edit' | 'delete'): boolean => {
  return checkLargeSeibanPermission(user, action);
};

// 検討書権限チェック
const checkTechDocumentPermission = (user: User, action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'publish'): boolean => {
  const permissions: TechSystemPermission[] = {
    view: TechSystemPermission.VIEW,
    create: TechSystemPermission.CREATE,
    edit: TechSystemPermission.EDIT,
    delete: TechSystemPermission.DELETE,
    approve: TechSystemPermission.APPROVE,
    publish: TechSystemPermission.PUBLISH
  };
  return checkPermission(user, permissions[action]);
};
```

## 📊 エラーハンドリング

### カスタムエラー定義
```typescript
// カスタムエラークラス
class TechSystemError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
    public details?: any
  ) {
    super(message);
    this.name = 'TechSystemError';
  }
}

// エラーコード定義
const ErrorCodes = {
  LARGE_SEIBAN_NOT_FOUND: 'LARGE_SEIBAN_NOT_FOUND',
  MEDIUM_SEIBAN_NOT_FOUND: 'MEDIUM_SEIBAN_NOT_FOUND',
  TECH_DOCUMENT_NOT_FOUND: 'TECH_DOCUMENT_NOT_FOUND',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR'
} as const;

// エラーハンドリング関数
const handleError = (error: unknown): TRPCError => {
  if (error instanceof TechSystemError) {
    return new TRPCError({
      code: 'BAD_REQUEST',
      message: error.message,
      cause: error
    });
  }
  
  if (error instanceof Error) {
    return new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: '内部サーバーエラーが発生しました',
      cause: error
    });
  }
  
  return new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: '不明なエラーが発生しました'
  });
};
```

## 🚀 パフォーマンス最適化

### 1. クエリ最適化
```typescript
// ページネーション実装
const buildPaginationQuery = (limit: number, offset: number) => {
  return `LIMIT ${limit} OFFSET ${offset}`;
};

// 検索クエリ最適化
const buildSearchQuery = (query: string, fields: string[]) => {
  const conditions = fields.map(field => `${field} LIKE ?`).join(' OR ');
  return `WHERE ${conditions}`;
};

// インデックス活用
const buildOrderByQuery = (orderBy: string, orderDirection: 'asc' | 'desc') => {
  return `ORDER BY ${orderBy} ${orderDirection.toUpperCase()}`;
};
```

### 2. キャッシュ戦略
```typescript
// React Queryキャッシュ設定
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分
      cacheTime: 10 * 60 * 1000, // 10分
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    }
  }
});
```

## 📈 監視・ログ

### ログ出力
```typescript
// ログ出力関数
const logApiCall = (procedure: string, input: any, result: any, duration: number) => {
  console.log({
    timestamp: new Date().toISOString(),
    procedure,
    input,
    result: result.success ? 'success' : 'error',
    duration: `${duration}ms`
  });
};

// エラーログ出力
const logError = (procedure: string, error: Error, input?: any) => {
  console.error({
    timestamp: new Date().toISOString(),
    procedure,
    error: error.message,
    stack: error.stack,
    input
  });
};
```

## 🔄 実装計画

### Phase 1: 基盤実装
1. データベーステーブル作成
2. 基本tRPCルーター実装
3. バリデーションスキーマ実装
4. エラーハンドリング実装

### Phase 2: 機能実装
1. CRUD操作実装
2. 検索・フィルタリング実装
3. 権限管理実装
4. ファイルアップロード実装

### Phase 3: 最適化
1. パフォーマンス最適化
2. キャッシュ実装
3. ログ・監視実装
4. テスト実装
