# プロジェクト構造詳細

## 主要ディレクトリ構造

### src/app/ (Next.js App Router)
```
app/
├── api/                    # API routes
│   ├── bom/               # BOM関連API
│   ├── box/               # Box API
│   ├── db/                # データベースAPI
│   ├── photos/            # 写真管理API
│   └── trpc/              # tRPC API
├── app_project/           # プロジェクト管理
│   └── [project_id]/      # 動的ルート
│       ├── bom/           # BOM管理
│       ├── photo/         # 写真管理
│       ├── zumen/         # 図面管理
│       └── konpo/         # 工法管理
├── main/                  # メインページ
├── test/                  # テストページ
└── layout.tsx             # ルートレイアウト
```

### src/components/ (共通コンポーネント)
```
components/
├── layout/                # レイアウトコンポーネント
│   └── header/           # ヘッダー関連
├── ui/                    # shadcn/uiコンポーネント
└── cusutom_ui/           # カスタムUIコンポーネント
```

### src/lib/ (ユーティリティ)
```
lib/
├── db/                    # データベース関連
│   ├── db_connection.ts   # DB接続
│   └── db_CRUD.ts        # CRUD操作
├── trpc/                  # tRPC設定
│   ├── client.ts          # クライアント設定
│   ├── Provider.tsx       # プロバイダー
│   └── routers/           # ルーター
└── utils.ts               # 汎用ユーティリティ
```

### src/types/ (型定義)
```
types/
├── api.ts                 # API型定義
├── bom_buhin.ts          # BOM部品型定義
├── db_project.ts          # プロジェクト型定義
├── photo.ts               # 写真型定義
└── table-schema.ts        # テーブルスキーマ型定義
```

## 重要なファイル

### 設定ファイル
- `package.json`: 依存関係とスクリプト
- `tsconfig.json`: TypeScript設定
- `next.config.js`: Next.js設定
- `eslint.config.mjs`: ESLint設定
- `tailwind.config.js`: Tailwind CSS設定

### データベース
- `data/achievements.db`: SQLiteデータベース
- `src/lib/db/db_connection.ts`: DB接続設定

### 型定義
- `src/types/`: すべての型定義
- `src/lib/trpc/trpc.ts`: tRPC設定

## 命名規則

### ファイル名
- ページ: `page.tsx`
- レイアウト: `layout.tsx`
- コンポーネント: PascalCase
- ユーティリティ: camelCase

### データベース
- テーブル: スネークケース
- カラム: スネークケース（大文字）
- 主キー: `rowid`
- タイムスタンプ: `CREATED_AT`, `UPDATE_AT`

### コンポーネント
- 関数コンポーネント: PascalCase
- Props: PascalCase
- イベントハンドラー: camelCase