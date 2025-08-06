# Event Reducer統合方針

## 概要
サイドバーの状態管理をEvent Reducerに統合し、双方向連携を実現する。

## 現在の状態管理の課題
1. **状態の分散**: サイドバー関連の状態が複数の場所に分散
   - `useSidebarState` (Zustand)
   - `useState` (各タブコンテンツ)
   - `Event Reducer` (一部のUI状態)
2. **双方向連携の不足**: サイドバーの操作とイベントの属性が独立して管理されている

## 統合方針

### Phase 1-4: ✅ 完了済み
- [x] EventStateの拡張（selectedProjectCode, purposeProjectCode, tabDetails追加）
- [x] EventActionの拡張（新しいアクションタイプ追加）
- [x] eventReducerの拡張（新しいケース追加）
- [x] eventActionsの拡張（新しいアクションクリエーター追加）
- [x] eventSelectorsの拡張（新しいセレクター追加）
- [x] eventHandlersの更新（syncEventToSidebar実装）
- [x] useEventReducerの更新（新しい状態とアクションを公開）

### Phase 5: ✅ 完了済み
- [x] useSidebarProps.tsの更新（Event Contextから新しい状態を取得）
- [x] PlanningTabContent.tsxの更新（Event Context使用、双方向連携実装）
- [x] DesignTabContent.tsxの更新（Event Context使用、双方向連携実装）
- [x] MeetingTabContent.tsxの更新（Event Context使用、双方向連携実装）
- [x] OtherTabContent.tsxの更新（Event Context使用、双方向連携実装）
- [x] ZissekiSidebar.tsxの更新（useSidebarState削除、Event Context使用）

### Phase 6: ✅ 完了済み
- [x] useSidebarState.tsの削除
- [x] zissekiStore.tsの確認（削除すべき状態なし）

### Phase 7: 🔄 進行中
- [ ] 動作確認
- [ ] エラーハンドリングの確認
- [ ] データの整合性確認

## サイドバーとイベントの関係性

### 双方向連携の実現
1. **イベント選択時**: イベントの属性でサイドバーの状態を初期化
   ```typescript
   // handleEventClick内で実行
   dispatch(eventActions.syncEventToSidebar(event));
   ```

2. **サイドバー操作時**: サイドバーの変更でイベントの属性を更新
   ```typescript
   // PlanningTabContent.tsx内の例
   const handlePlanningSubTypeChange = (subType) => {
     // Event Contextの状態を更新
     setTabDetail('planning', 'planningSubType', subType.name);
     
     // 選択中のイベントの属性も同時に更新
     if (selectedEvent) {
       const updatedEvent = {
         ...selectedEvent,
         planningSubType: subType.name,
         activityCode: newCode,
         businessCode: newCode,
       };
       updateEvent(updatedEvent);
     }
   };
   ```

## 実装された機能

### 1. 統合された状態管理
- **Event Context**: サイドバー関連の状態を一元管理
- **双方向連携**: イベント選択 ↔ サイドバー状態の同期
- **型安全性**: TypeScriptによる完全な型チェック

### 2. 更新されたコンポーネント
- **タブコンテンツ**: すべてEvent Contextを使用
- **メインサイドバー**: useSidebarState削除、Event Context統合
- **Props生成**: 新しい状態とアクションを提供

### 3. 削除されたファイル
- **useSidebarState.ts**: 不要になったZustand Store

## 次のステップ
1. **動作確認**: イベント選択時のサイドバー状態反映
2. **双方向連携テスト**: サイドバー操作時のイベント属性更新
3. **エラーハンドリング**: エラー状態の適切な処理
4. **パフォーマンス確認**: 状態更新の効率性

## 技術的詳細

### EventStateの拡張
```typescript
export interface EventState {
  // ... 既存のプロパティ
  
  // 新規追加（Zustand Storeから統合）
  selectedProjectCode: string;
  purposeProjectCode: string;
  
  // 新規追加（useStateから統合）
  tabDetails: {
    planning: { planningSubType: string; estimateSubType: string; };
    design: { designSubType: string; };
    meeting: { meetingType: string; };
    other: { travelType: string; stakeholderType: string; documentType: string; };
    indirect: { otherSubTab: string; indirectDetailTab: string; };
  };
}
```

### 新しいアクション
```typescript
export type EventAction = 
  // ... 既存のアクション
  
  // 新規追加
  | { type: 'SET_SELECTED_PROJECT_CODE'; payload: string }
  | { type: 'SET_PURPOSE_PROJECT_CODE'; payload: string }
  | { type: 'SET_TAB_DETAIL'; payload: { tab: string; detail: string; value: string } }
  | { type: 'SET_INDIRECT_DETAIL'; payload: { detail: string; value: string } }
  | { type: 'SYNC_EVENT_TO_SIDEBAR'; payload: TimeGridEvent };
```

## 注意事項
- インポートパスのエラーが残っているため、正しいパスに修正が必要
- 動作確認後に必要に応じて微調整を行う 