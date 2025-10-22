# Claude Code - SPECKIT 設定

このファイルはClaude Code用のプロジェクト設定を記述します。

## プロジェクト概要

PME DATAHUB - 総合プロジェクト管理システム
- Next.js App Router + TypeScript
- SQLite データベース
- tRPC API
- TailwindCSS + shadcn/ui

## 開発コマンド

### 基本コマンド
```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 型チェック
npm run type-check

# リント
npm run lint

# テスト
npm test
```

### SPECKIT コマンド

#### 1. プロジェクト分析
```bash
# プロジェクト憲章を確認
cat speckit.constitution.md

# 現在のタスクを確認
cat speckit.tasks

# 仕様書を確認
cat speckit.specify

# プランを確認
cat speckit.plan
```

#### 2. 開発フロー

**新機能開発時:**
1. `speckit.tasks` でタスクを確認
2. `speckit.specify` で仕様を確認
3. 実装
4. テスト実行
5. 型チェック実行

**リファクタリング時:**
1. `speckit.constitution.md` で原則を確認
2. 対象コードの分析
3. 段階的な改善実装

## ディレクトリ構造

```
src/
├── app/                 # Next.js App Router
├── components/          # UIコンポーネント
├── lib/                # 汎用ライブラリ
├── types/              # 型定義
├── utils/              # ユーティリティ関数
├── hooks/              # React Hooks
└── server/             # サーバーサイド
    ├── api/            # tRPC API
    └── db/             # データベース

.specify/               # SPECKIT 設定
├── memory/            # プロジェクトメモリ
├── scripts/           # 自動化スクリプト
└── templates/         # テンプレート
```

## 品質基準

### TypeScript
- 厳格な型安全性を遵守
- `any` の使用を避ける
- 公開APIは完全な型定義

### ドキュメント
- 新規関数にはJSDocコメント必須
- 複雑なロジックにはインラインコメント
- READMEとコンスティテューションの更新

### テスト
- 新機能にはテスト必須
- カバレッジ80%以上維持
- E2Eテストの実行確認

## Claude Code 使用時の注意事項

### ファイル作成・編集
1. 既存ファイルの構造を理解してから編集
2. `speckit.constitution.md` の原則を遵守
3. TypeScript型安全性を必ず確保

### 実装パターン
- API: `src/server/api/` 配下のtRPCパターンに従う
- UI: shadcn/uiコンポーネントを活用
- 状態管理: Zustandまたは React State

### エラーハンドリング
- 構造化されたエラーレスポンス
- ユーザーフレンドリーなエラーメッセージ
- ログ出力の適切な実装

## SPECKIT ワークフロー

### 1. タスク管理
```bash
# タスク一覧の確認
grep "^- \[ \]" speckit.tasks

# 進行中タスクの確認
grep "^- \[x\]" speckit.tasks
```

### 2. 仕様確認
```bash
# 機能仕様の確認
cat speckit.specify

# アーキテクチャ方針の確認
head -50 speckit.constitution.md
```

### 3. 実装ガイド
1. 憲章の原則確認
2. 既存パターンの調査
3. 型安全な実装
4. テスト追加
5. ドキュメント更新

---

**重要**: 実装前に必ず `speckit.constitution.md` を確認し、プロジェクトの原則に従ってください。