# DatabaseContext実装計画

## 🎯 目標
EventContextとDatabaseContextの関心分離を実現し、シンプルな手動保存パターンを実装する。

## 📊 現在の状況
- ✅ EventContext: 既に存在し、イベント状態管理を担当
- ❌ DatabaseContext: 未作成
- ❌ データベース通信ロジック: 分散している
- ❌ 保存ボタン: 未実装
- ❌ 保存タイミング制御: 未実装

## 🔄 新しいデータフロー

### 1. データベース → React状態
```
ページ読み込み
↓
DatabaseContext初期化
↓
api.loadEvents(year, week) でデータベースから取得
↓
EventContext.dispatch(setEvents(events)) でReact状態に保存
↓
Context経由で全コンポーネントがアクセス可能
```

### 2. React状態 → データベース
```
ユーザーがイベント作成/更新/削除
↓
EventContextで即座にUI更新
↓
ユーザーが保存ボタンをクリック
↓
DatabaseContext.saveEvents() でデータベースに保存
↓
成功: 保存完了メッセージ
失敗: エラーメッセージ表示
```

## 📁 ファイル構成
```
context/
├── EventContext.tsx (既存 - 状態管理のみ)
└── DatabaseContext.tsx (新規 - 通信ロジックのみ)

hooks/
├── useEventReducer.ts (既存 - 調整)
└── useDatabaseOperations.ts (新規 - データベース操作)

components/
└── TimeGridHeader.tsx (新規 - 保存ボタン付きヘッダー)
```

## 🚀 実装計画

### Phase 1: DatabaseContextの作成
- [ ] **DatabaseContext.tsx** の新規作成
  - [ ] データベース通信ロジックの集約
  - [ ] エラーハンドリング
  - [ ] ローディング状態管理
  - [ ] 保存ボタンの状態管理

- [ ] **DatabaseContextの型定義**
  - [ ] `loadEvents(year, week)`
  - [ ] `saveEvents(events)`
  - [ ] `isLoading`
  - [ ] `error`
  - [ ] `isSaving`

### Phase 2: EventContextの調整
- [ ] **楽観的更新パターンの実装**
  - [ ] 即座にUI状態を更新
  - [ ] データベース保存は手動のみ
  - [ ] エラー時のアラート表示

- [ ] **EventContextの調整**
  - [ ] DatabaseContextとの連携

### Phase 3: 保存ボタンの実装
- [ ] **TimeGridHeader.tsx** の新規作成
  - [ ] 保存ボタンの配置
  - [ ] 保存中の表示
  - [ ] エラー表示

- [ ] **保存ボタンの機能**
  - [ ] クリック時の保存処理
  - [ ] 保存中の無効化
  - [ ] 成功/失敗メッセージ

### Phase 4: 統合とテスト
- [ ] **コンテキストの統合**
  - [ ] EventProviderとDatabaseProviderの組み合わせ
  - [ ] 依存関係の設定

- [ ] **動作確認**
  - [ ] データフローの検証
  - [ ] エラーハンドリングの確認
  - [ ] 保存ボタンの動作確認

## 📋 TODOリスト

### 高優先度
- [ ] DatabaseContext.tsxの作成
- [ ] DatabaseContextの型定義
- [ ] TimeGridHeader.tsxの作成
- [ ] 保存ボタンの基本機能

### 中優先度
- [ ] EventContextとの統合
- [ ] エラーハンドリングの実装
- [ ] 保存中の表示

### 低優先度
- [ ] ページ離脱時の警告
- [ ] 保存成功メッセージ
- [ ] パフォーマンス最適化

## 🎨 設計原則

### 関心の分離
- **EventContext**: イベントの状態管理のみ
- **DatabaseContext**: データベース通信のみ
- **TimeGridHeader**: UI表示のみ

### シンプルな実装
- 保存状態管理は最小限（保存中フラグのみ）
- 手動保存のみ（自動保存なし）
- エラーハンドリングはシンプルなアラート

### ユーザビリティ
- 保存ボタンは常に表示
- 保存中は無効化
- エラー時は明確なメッセージ
