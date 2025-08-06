# zisseki-demo アプリケーション分析・リファクタリング計画書

## 📋 アプリケーション概要

### 🎯 想定される機能
この`zisseki-demo`アプリケーションは**週単位の実績管理・時間管理システム**です：

#### 主要機能
1. **週間タイムグリッド表示**
   - 7日間の時間軸表示（8:00-22:00）
   - 勤務時間の入力・管理
   - イベント（作業項目）の時間軸配置・表示

2. **イベント管理**
   - 新規イベント作成（タイムスロットクリック）
   - イベントの詳細編集（サイドバー）
   - イベントの削除・更新
   - ドラッグ・リサイズ機能（実装途中）

3. **プロジェクト・作業分類管理**
   - **直接作業**: プロジェクトコード、設備、購入品関連
   - **間接作業**: 純間接、目的間接、控除時間
   - **詳細分類**: 計画、設計、会議、出張等の細分化

4. **サイドバー詳細編集**
   - タブ切り替え（プロジェクト/間接）
   - サブタブによる詳細分類
   - 活動コードの設定
   - 設備・購入品の選択

## ❌ 現在の問題点

### 🔥 **Critical: 複雑化した状態管理**
1. **状態管理の分散**
   - `EventReducer` (useReducer)
   - `ZissekiStore` (Zustand)
   - `useState`（複数コンポーネント）
   - 3つの異なる状態管理手法が混在

2. **データの不整合**
   - サイドバーの状態とイベントデータが別管理
   - イベント選択時の状態反映が不完全
   - プロジェクト選択とイベント属性の同期問題

3. **複雑な依存関係**
   ```
   page.tsx
   ├── useZissekiStore (Zustand)
   ├── useWorkTimeReducer 
   ├── useSidebarProps
   │   ├── useEventContext
   │   └── useZissekiStore
   └── useTimeGridProps
       ├── useEventContext  
       └── useWorkTimeReducer
   ```

### 🐛 **コードの問題**
1. **未使用ファイル・削除済みファイルの参照**
   - `useSidebarState.ts`（削除済み）への参照
   - `useEventHandlers.ts`（移動済み）への参照

2. **不完全なリファクタリング**
   - Event Reducerの統合が半分完了状態
   - 旧コードと新コードの混在
   - 一貫性のない命名規則

3. **過度なコンソールログ**
   ```typescript
   console.log('useEventReducer - current state:', ...);
   console.log('ローディング状態:', ...);
   console.log('ZissekiSidebar - selectedEvent:', ...);
   ```

### 🔄 **設計上の問題**
1. **責務の分離不足**
   - UIロジックとビジネスロジックの混在
   - Propsフックに処理ロジックが含まれる

2. **型定義の重複**
   ```typescript
   // types/index.ts
   export interface Event { ... }
   
   // hooks/reducer/event/types.ts  
   export interface TimeGridEvent extends BaseTimeGridEvent { ... }
   ```

3. **エラーハンドリングの不統一**
   - 各フックで独自のエラー処理
   - エラー状態の統合不足

## 🎯 リファクタリング計画

### Phase 1: 状態管理の統合整理 【最優先】

#### 1.1 Event Reducerの完全統合
```typescript
// 統合後の理想的な状態管理
interface UnifiedEventState {
  // イベントデータ
  events: TimeGridEvent[];
  selectedEvent: TimeGridEvent | null;
  
  // UI状態（統合）
  ui: {
    activeTab: string;
    activeSubTabs: Record<string, string>;
    modals: Record<string, boolean>;
    dragState: DragState;
    resizeState: ResizeState;
  };
  
  // サイドバー状態（イベントと連携）
  sidebar: {
    selectedProjectCode: string;
    purposeProjectCode: string;
    tabDetails: TabDetails;
  };
  
  // システム状態
  loading: boolean;
  error: string | null;
}
```

#### 1.2 不要な状態管理の削除
- [ ] `useSidebarState`の完全削除
- [ ] Zustandからサイドバー状態を削除
- [ ] 重複するuseStateの整理

### Phase 2: コンポーネント構造の整理

#### 2.1 ファイル整理
```bash
# 削除対象
hooks/useEventHandlers.ts (移動済み)
hooks/useSidebarProps.ts (統合対象)
hooks/useTimeGridProps.ts (統合対象)
hooks/useUI.ts (削除済み)
utils/demoStorage.ts (削除済み)

# 統合対象
components/sidebar/hooks/useSidebarState.ts → EventReducer
```

#### 2.2 Propsの簡素化
```typescript
// 現在: 複雑なProps生成
const sidebarProps = useSidebarProps(year, week);
const timeGridProps = useTimeGridProps(year, week);

// 理想: 直接的なデータ渡し  
<ZissekiSidebar 
  eventState={eventState}
  masterData={masterData}
/>
<TimeGrid 
  eventState={eventState}
  workTimeState={workTimeState}
/>
```

### Phase 3: 機能の修正・完成

#### 3.1 イベント・サイドバー連携の修正
- [ ] イベント選択時の状態反映
- [ ] サイドバー操作時のイベント更新
- [ ] 双方向データバインディング

#### 3.2 未実装機能の完成
- [ ] ドラッグ・ドロップ機能
- [ ] イベントリサイズ機能
- [ ] 右クリックメニュー

## 🚀 実装開始地点

### **Step 1: Event Reducerの統合完成** 【開始地点】

最初に取り組むべき作業：

```typescript
// 1. EventReducerの状態を完全統合
// src/app/zisseki-demo/[year]/[week]/hooks/reducer/event/types.ts
interface EventState {
  // 既存
  events: TimeGridEvent[];
  selectedEvent: TimeGridEvent | null;
  
  // 統合: サイドバー状態
  sidebar: {
    selectedProjectCode: string;
    purposeProjectCode: string;
    tabDetails: {
      planning: { planningSubType: string; estimateSubType: string; };
      design: { designSubType: string; };
      meeting: { meetingType: string; };
      other: { travelType: string; stakeholderType: string; documentType: string; };
      indirect: { otherSubTab: string; indirectDetailTab: string; };
    };
  };
  
  // UI状態の統合
  ui: {
    activeTab: string;
    activeSubTabs: Record<string, string>;
    modals: Record<string, boolean>;
  };
}
```

#### 具体的な作業順序：
1. **型定義の統合** - `event/types.ts`の完成
2. **リデューサーの統合** - サイドバー状態の追加
3. **アクションの追加** - サイドバー操作用アクション
4. **イベント選択の修正** - 状態反映ロジック
5. **サイドバー連携の修正** - 双方向バインディング

### **Step 2: 不要ファイルの削除**
```bash
# 削除すべきファイル
rm hooks/useSidebarProps.ts
rm hooks/useTimeGridProps.ts  
rm hooks/useEventHandlers.ts
rm utils/demoStorage.ts
```

### **Step 3: コンポーネントの簡素化**
- [ ] `page.tsx`の簡素化
- [ ] 直接的なデータ渡し
- [ ] Propsフックの削除

## 📊 期待される改善効果

### 🎯 **解決される問題**
1. **状態の一元管理** - データの整合性確保
2. **保守性の向上** - 単一の状態管理手法
3. **デバッグの簡素化** - 状態の追跡が容易
4. **機能の完成** - イベント・サイドバー連携の修正

### 📈 **メトリクス目標**
- **ファイル数削減**: 25% (42 → 32ファイル)
- **状態管理の統一**: 3手法 → 1手法
- **コード行数削減**: 15%
- **型安全性向上**: any型の削除

## ⚠️ 注意事項

### 🔒 **リスク管理**
1. **段階的実装** - 一度に全て変更せず段階的に
2. **既存機能の保護** - 現在動作している機能を壊さない
3. **テストの実行** - 各段階でテスト確認

### 🧪 **検証方法**
```typescript
// 各段階での検証ポイント
1. イベント作成・編集・削除が動作するか
2. サイドバーの状態がイベントと同期するか
3. タブ切り替えが正常に動作するか
4. エラーハンドリングが適切か
```

## 📝 結論

このアプリケーションは**実績管理システム**として良い設計思想を持っていますが、**状態管理の複雑化**により機能が正常に動作しない状態です。

**Event Reducerの完全統合**から始めることで、段階的に問題を解決し、保守性の高いアプリケーションに改善できます。

---
*作成日: 2025-08-06*
*最終更新: 2025-08-06*