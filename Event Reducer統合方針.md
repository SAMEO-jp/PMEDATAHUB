# Event Reducer統合方針

## 概要
サイドバーの状態管理をEvent Reducerから削除し、シンプルな構造に変更する。

## 変更の背景
- サイドバーは`activityCode`から動的に状態を生成するため、イベント側でサイドバー状態を保持する必要がない
- 状態管理の複雑性を削減し、保守性を向上させる

## 実施した変更

### ✅ 完了済み
- [x] TimeGridEvent型からサイドバー関連プロパティを削除
- [x] EventStateからサイドバー状態と階層状態を削除
- [x] EventActionからサイドバー関連アクションを削除
- [x] eventReducerからサイドバー関連ケースを削除
- [x] eventActionsからサイドバー関連アクションを削除
- [x] useEventReducerからサイドバー関連セレクターを削除

## 現在の状態管理構造

### イベント側（シンプル化）
```typescript
interface EventState {
  events: TimeGridEvent[];
  selectedEvent: TimeGridEvent | null;
  ui: {
    modals: Record<string, boolean>;
    dragState: { isDragging: boolean; draggedEvent: TimeGridEvent | null };
    resizeState: { isResizing: boolean; resizedEvent: TimeGridEvent | null };
  };
  loading: boolean;
  error: string | null;
}
```

### サイドバー側（ローカル状態管理）
- `activityCode`から動的に状態を生成
- ローカル状態でUI操作を管理
- 変更時に`activityCode`のみをイベント側に送信

## 利点

### ✅ シンプルなデータ構造
- イベントは`activityCode`文字列のみ保持
- 不要な状態同期が不要

### ✅ 責任の分離
- サイドバーは独自の状態管理を持つ
- イベント側は本質的なデータのみ管理

### ✅ 保守性の向上
- サイドバーのUI状態変更がイベントに影響しない
- 状態管理の複雑性が大幅に削減

### ✅ パフォーマンスの向上
- 不要な状態更新が発生しない
- レンダリングの最適化が容易

## 今後の方針

### サイドバーの分割
- `utils/activityCodeParser.ts`: コード解析ロジック
- `utils/activityCodeGenerator.ts`: コード生成ロジック
- `hooks/useActivityCodeState.ts`: 状態管理ロジック
- `hooks/useActivityCodeHandlers.ts`: イベントハンドラー
- `hooks/useActivityCodeData.ts`: データ準備ロジック
- `components/ActivityCodeDisplay.tsx`: 表示部分
- `components/ActivityCodeControls.tsx`: 制御部分
- `types/ActiveCodeEditorTypes.ts`: 型定義 