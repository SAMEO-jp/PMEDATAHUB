# PMEDATAHUB 機能仕様管理

このディレクトリは機能別の仕様書を管理します。

## ディレクトリ構造

```
specs/
├── README.md                    # このファイル
└── [feature-name]/             # 機能別ディレクトリ
    ├── spec.md                 # 機能仕様書
    ├── plan.md                 # 実装プラン（自動生成）
    ├── tasks.md                # タスクリスト（自動生成）
    ├── contracts/              # API契約定義
    │   ├── api-contracts.md
    │   └── data-models.json
    └── docs/                   # 機能固有ドキュメント
        ├── research.md
        ├── data-model.md
        └── quickstart.md
```

## 現在の機能

### PLM アプリケーション (`plm-app/`)
- **仕様書**: `specs/plm-app/spec.md`
- **ステータス**: 仕様策定中
- **技術スタック**: Next.js 14, TypeScript, tRPC, SQLite
- **開発フェーズ**:
  1. データベース設計・基盤構築
  2. 認証・レイアウト構築
  3. データ操作機能
  4. データ表示・UI完成

## SPECKITコマンド

### 仕様作成・更新
```bash
# 新機能の仕様書作成
/speckit.specify [feature-description]

# 実装プラン生成
/speckit.plan

# タスクリスト生成
/speckit.tasks
```

### ファイル参照
```bash
# 仕様書確認
cat specs/[feature-name]/spec.md

# プラン確認
cat specs/[feature-name]/plan.md

# タスク確認
cat specs/[feature-name]/tasks.md
```

## 管理ルール

1. **機能名命名規則**: ケバブケース（例: `plm-app`, `user-management`）
2. **仕様書更新**: 機能変更時は必ずspec.mdを先に更新
3. **プラン生成**: 仕様確定後に`/speckit.plan`で自動生成
4. **タスク管理**: プラン確定後に`/speckit.tasks`で詳細タスク作成

## 品質基準

- 各機能の仕様書は独立してテスト可能なユーザーストーリーで構成
- APIコントラクトは型安全性を保証
- 実装前にデータモデルとAPIテストを完了
- PMEDATAHUB憲章の原則に準拠