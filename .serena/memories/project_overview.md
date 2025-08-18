# PMEDATAHUB プロジェクト概要

## プロジェクトの目的
PMEDATAHUBは、プロジェクト管理と写真管理を統合したシステムです。主な機能として：
- プロジェクト管理（BOM、図面、写真管理）
- パレット管理システム
- 写真管理機能（アップロード、表示、検索）
- データベース管理（SQLite）

## 技術スタック
- **フロントエンド**: Next.js 14 (App Router), TypeScript, React 18
- **UIライブラリ**: Tailwind CSS, Radix UI, shadcn/ui
- **状態管理**: Zustand
- **API**: tRPC
- **データベース**: SQLite (achievements.db)
- **開発ツール**: ESLint, TypeScript, PostCSS

## プロジェクト構造
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── app_project/       # プロジェクト管理ページ
│   ├── main/              # メインページ
│   └── test/              # テストページ
├── components/            # 共通コンポーネント
├── lib/                   # ユーティリティ
│   ├── db/               # データベース関連
│   └── trpc/             # tRPC設定
├── store/                 # Zustandストア
└── types/                 # TypeScript型定義
```

## 主要機能
1. **プロジェクト管理**: プロジェクトの作成、編集、削除
2. **BOM管理**: 部品表の管理
3. **図面管理**: 図面の表示、管理
4. **写真管理**: プロジェクト関連写真の管理
5. **パレット管理**: パレットの状況管理

## 開発環境
- **OS**: Windows
- **Node.js**: 最新版
- **パッケージマネージャー**: npm
- **データベース**: SQLite (data/achievements.db)