# zisseki-demo プロジェクトの現状分析

## プロジェクト概要
zisseki-demoは実績管理システムのデモアプリケーションで、週単位での時間管理とイベント管理機能を提供しています。

## 主要なアーキテクチャ構成

### 1. 状態管理システム
- **Zustand Store** (`zissekiStore.ts`): マスターデータ（プロジェクト、従業員、ユーザー）と実績データの管理
- **Event Context** (`EventContext.tsx`): イベントとUI状態の統合管理
- **useEventReducer** (`useEventReducer.ts`): イベント状態のリデューサーパターン実装

### 2. 主要コンポーネント
- **ZissekiPage** (`page.tsx`): メインページコンポーネント
- **TimeGrid** (`TimeGrid.tsx`): 週間時間グリッド表示
- **ZissekiSidebar** (`ZissekiSidebar.tsx`): サイドバー（イベント編集用）

### 3. 状態管理の詳細

#### EventState (統合されたイベント状態)
```typescript
interface EventState {
  events: TimeGridEvent[];           // イベントデータ
  selectedEvent: TimeGridEvent | null; // 選択されたイベント
  ui: UIState;                      // UI状態（4段階階層含む）
  sidebar: SidebarState;            // サイドバー状態
  loading: boolean;                 // ローディング状態
  error: string | null;             // エラー状態
}
```

#### 4段階階層システム
1. **レベル1**: メインタブ (`project` | `indirect`)
2. **レベル2**: サブタブ (計画、設計、会議、購入品、その他)
3. **レベル3**: 詳細タブ (計画図、詳細図、内部会議等)
4. **レベル4**: 業務タイプ (planningSubType, designSubType等)

### 4. ファイル構造
```
src/app/zisseki-demo/[year]/[week]/
├── components/
│   ├── sidebar/          # サイドバー関連
│   ├── weekgrid/         # 時間グリッド関連
│   ├── loadingspinner/   # ローディング表示
│   └── rightclickmenu/   # 右クリックメニュー
├── hooks/
│   └── reducer/
│       └── event/        # イベント状態管理
├── context/              # React Context
├── store/                # Zustand Store
├── types/                # 型定義
└── utils/                # ユーティリティ
```

### 5. 主要機能
- 週間時間グリッドでのイベント表示・編集
- 4段階階層による業務分類
- サイドバーでの詳細編集
- localStorage との同期
- ドラッグ&ドロップ機能
- エラーハンドリング

### 6. 技術スタック
- Next.js 14 (App Router)
- TypeScript
- Zustand (状態管理)
- React Context + useReducer
- Tailwind CSS
- localStorage (データ永続化)

### 7. 現在の実装状況
- ✅ 基本的なアーキテクチャが完成
- ✅ 状態管理システムが統合済み
- ✅ 4段階階層システムが実装済み
- ✅ コンポーネント分割が適切に実施済み
- ✅ 型安全性が確保済み
- ✅ エラーハンドリングが実装済み

このプロジェクトは、複雑な状態管理を必要とする実績管理システムとして、適切なアーキテクチャ設計と実装が行われています。