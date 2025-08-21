# Event Reducer統合方針

## 🎯 統合の目的

現在、サイドバーの状態管理が複数の方法で分散しているため、Event Reducerに統合することで：
- データの整合性向上
- 状態管理の一元化
- 保守性の向上

を実現します。

## 🔄 サイドバーとイベントの関係性

### 重要な背景
**サイドバーは選択中のイベントの状態を表示・編集するUI**です：

1. **表示機能**: 選択中のイベントの属性を詳細表示
2. **編集機能**: サイドバーの操作でイベントの属性を変更
3. **双方向連携**: 
   - イベント選択 → サイドバーに状態反映
   - サイドバー操作 → イベントの属性更新

### 現在の問題
- サイドバーの状態とイベントの属性が別々に管理されている
- データの整合性が保たれない可能性
- イベント選択時の状態反映が不完全

### 統合の必要性
**イベントの属性とサイドバーの状態を一元管理**することで：
- 選択イベントの属性変更が即座にサイドバーに反映
- サイドバーの操作が即座にイベントの属性に反映
- データの整合性を保証

## 📊 現在の状態管理状況

### 分散している状態管理

#### 1. Event Reducer（既存）
```typescript
interface EventState {
  activeTab: string;
  activeSubTabs: {
    project: 'overview',
    indirect: '純間接'
  };
  // ... 他の状態
}
```

#### 2. Zustand Store（サイドバー専用）
```typescript
interface SidebarState {
  selectedProjectCode: string;
  purposeProjectCode: string;
  selectedOtherSubTab: string;
  selectedIndirectDetailTab: string;
}
```

#### 3. useState（各タブコンテンツ）
```typescript
// PlanningTabContent
const [planningSubType, setPlanningSubType] = useState<string>("");
const [estimateSubType, setEstimateSubType] = useState<string>("");

// DesignTabContent
const [designSubType, setDesignSubType] = useState<string>("");

// MeetingTabContent
const [meetingType, setMeetingType] = useState<string>("");

// OtherTabContent
const [travelType, setTravelType] = useState<string>("");
const [stakeholderType, setStakeholderType] = useState<string>("");
const [documentType, setDocumentType] = useState<string>("");
```

## 🔄 統合方針

### Phase 1: Event Reducerの拡張

#### 1.1 型定義の拡張
```typescript
// event/types.ts
interface EventState {
  // 既存の状態
  events: TimeGridEvent[];
  selectedEvent: TimeGridEvent | null;
  modals: Record<string, boolean>;
  dragState: { isDragging: boolean; draggedEvent: TimeGridEvent | null };
  resizeState: { isResizing: boolean; resizedEvent: TimeGridEvent | null };
  activeTab: string;
  activeSubTabs: Record<string, string>;
  loading: boolean;
  error: string | null;
  
  // 新規追加（Zustand Storeから統合）
  // 選択中のイベントのプロジェクト関連属性
  selectedProjectCode: string;
  purposeProjectCode: string;
  
  // 新規追加（useStateから統合）
  // 選択中のイベントのタブ詳細属性（サイドバーで編集可能）
  tabDetails: {
    planning: {
      planningSubType: string;
      estimateSubType: string;
    };
    design: {
      designSubType: string;
    };
    meeting: {
      meetingType: string;
    };
    other: {
      travelType: string;
      stakeholderType: string;
      documentType: string;
    };
    indirect: {
      otherSubTab: string;
      indirectDetailTab: string;
    };
  };
}
```

#### 1.2 アクションの拡張
```typescript
// event/eventActions.ts
export const eventActions = {
  // 既存のアクション
  setEvents: (events: TimeGridEvent[]): EventAction => ({...}),
  // ... 他の既存アクション
  
  // 新規追加（プロジェクト選択）
  // 選択中のイベントのプロジェクト属性を更新
  setSelectedProjectCode: (code: string): EventAction => ({
    type: 'SET_SELECTED_PROJECT_CODE',
    payload: code
  }),
  setPurposeProjectCode: (code: string): EventAction => ({
    type: 'SET_PURPOSE_PROJECT_CODE',
    payload: code
  }),
  
  // 新規追加（タブ詳細状態）
  // 選択中のイベントのタブ詳細属性を更新（サイドバー操作で呼び出し）
  setTabDetail: (tab: string, detail: string, value: string): EventAction => ({
    type: 'SET_TAB_DETAIL',
    payload: { tab, detail, value }
  }),
  
  // 新規追加（間接業務詳細）
  // 選択中のイベントの間接業務詳細属性を更新
  setIndirectDetail: (detail: string, value: string): EventAction => ({
    type: 'SET_INDIRECT_DETAIL',
    payload: { detail, value }
  }),
  
  // 新規追加（イベント選択時の状態反映）
  // イベント選択時にサイドバーの状態をイベントの属性で初期化
  syncEventToSidebar: (event: TimeGridEvent): EventAction => ({
    type: 'SYNC_EVENT_TO_SIDEBAR',
    payload: event
  })
};
```

#### 1.3 リデューサーの拡張
```typescript
// event/eventReducer.ts
export const initialState: EventState = {
  // 既存の初期状態
  events: [],
  selectedEvent: null,
  modals: {},
  dragState: { isDragging: false, draggedEvent: null },
  resizeState: { isResizing: false, resizedEvent: null },
  activeTab: 'dashboard',
  activeSubTabs: {
    project: 'overview',
    indirect: '純間接'
  },
  loading: true,
  error: null,
  
  // 新規追加
  selectedProjectCode: '',
  purposeProjectCode: '',
  tabDetails: {
    planning: { planningSubType: '', estimateSubType: '' },
    design: { designSubType: '' },
    meeting: { meetingType: '' },
    other: { travelType: '', stakeholderType: '', documentType: '' },
    indirect: { otherSubTab: '〇先対応', indirectDetailTab: '日報入力' }
  }
};

export function eventReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    // 既存のケース
    case 'SET_EVENTS': return {...},
    // ... 他の既存ケース
    
    // 新規追加
    case 'SET_SELECTED_PROJECT_CODE':
      return { ...state, selectedProjectCode: action.payload };
    
    case 'SET_PURPOSE_PROJECT_CODE':
      return { ...state, purposeProjectCode: action.payload };
    
    case 'SET_TAB_DETAIL':
      return {
        ...state,
        tabDetails: {
          ...state.tabDetails,
          [action.payload.tab]: {
            ...state.tabDetails[action.payload.tab],
            [action.payload.detail]: action.payload.value
          }
        }
      };
    
    case 'SET_INDIRECT_DETAIL':
      return {
        ...state,
        tabDetails: {
          ...state.tabDetails,
          indirect: {
            ...state.tabDetails.indirect,
            [action.payload.detail]: action.payload.value
          }
        }
      };
    
    // 新規追加（イベント選択時の状態反映）
    case 'SYNC_EVENT_TO_SIDEBAR':
      return {
        ...state,
        // イベントの属性でサイドバーの状態を初期化
        selectedProjectCode: action.payload.project || '',
        purposeProjectCode: action.payload.purposeProject || '',
        activeTab: action.payload.selectedTab || 'dashboard',
        activeSubTabs: {
          project: action.payload.selectedProjectSubTab || 'overview',
          indirect: action.payload.selectedIndirectSubTab || '純間接'
        },
        tabDetails: {
          planning: {
            planningSubType: action.payload.planningSubType || '',
            estimateSubType: action.payload.estimateSubType || ''
          },
          design: {
            designSubType: action.payload.designSubType || ''
          },
          meeting: {
            meetingType: action.payload.meetingType || ''
          },
          other: {
            travelType: action.payload.travelType || '',
            stakeholderType: action.payload.stakeholderType || '',
            documentType: action.payload.documentType || ''
          },
          indirect: {
            otherSubTab: action.payload.selectedOtherSubTab || '〇先対応',
            indirectDetailTab: action.payload.selectedIndirectDetailTab || '日報入力'
          }
        }
      };
    
    default:
      return state;
  }
}

### Phase 2: コンポーネントの更新

#### 2.1 タブコンテンツの更新
```typescript
// PlanningTabContent.tsx
export const PlanningTabContent = ({ selectedEvent, updateEvent }) => {
  const { tabDetails, setTabDetail } = useEventContext();
  const { planningSubType, estimateSubType } = tabDetails.planning;
  
  // サイドバーの操作でイベントの属性を更新
  const handlePlanningSubTypeChange = (value: string) => {
    setTabDetail('planning', 'planningSubType', value);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        planningSubType: value
      };
      updateEvent(updatedEvent);
    }
  };
  
  const handleEstimateSubTypeChange = (value: string) => {
    setTabDetail('planning', 'estimateSubType', value);
    
    // 選択中のイベントの属性も同時に更新
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        estimateSubType: value
      };
      updateEvent(updatedEvent);
    }
  };
  
  // ... レンダリング
};
```

#### 2.2 サイドバーコンポーネントの更新
```typescript
// ZissekiSidebar.tsx
export const ZissekiSidebar = ({ selectedEvent, updateEvent, ... }) => {
  const {
    selectedProjectCode,
    purposeProjectCode,
    tabDetails,
    setSelectedProjectCode,
    setPurposeProjectCode,
    setTabDetail
  } = useEventContext();
  
  // プロジェクト選択時の処理
  const handleProjectCodeChange = (code: string) => {
    setSelectedProjectCode(code);
    
    // 選択中のイベントのプロジェクト属性も更新
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        project: code
      };
      updateEvent(updatedEvent);
    }
  };
  
  // タブ詳細変更時の処理
  const handleTabDetailChange = (tab: string, detail: string, value: string) => {
    setTabDetail(tab, detail, value);
    
    // 選択中のイベントの対応する属性も更新
    if (selectedEvent) {
      const updatedEvent = {
        ...selectedEvent,
        [detail]: value
      };
      updateEvent(updatedEvent);
    }
  };
  
  // useStateの削除
  // const sidebarState = useSidebarState(); // 削除
  
  // ... レンダリング
};
```

### Phase 3: イベント選択時の状態反映

#### 3.1 イベント選択ハンドラーの更新
```typescript
// hooks/reducer/event/eventHandlers.ts
export const createEventHandlers = (dispatch, state) => {
  return {
    // 既存のハンドラー
    handleEventClick: (event: TimeGridEvent) => {
      console.log('イベントクリック:', event);
      
      // 1. イベントを選択状態に設定
      dispatch(eventActions.setSelectedEvent(event));
      
      // 2. イベントの属性でサイドバーの状態を初期化
      dispatch(eventActions.syncEventToSidebar(event));
      
      // 3. タブ状態を反映
      if (event.selectedTab) {
        dispatch(eventActions.setActiveTab(event.selectedTab));
      }
      if (event.selectedProjectSubTab) {
        dispatch(eventActions.setActiveSubTab('project', event.selectedProjectSubTab));
      }
      if (event.selectedIndirectSubTab) {
        dispatch(eventActions.setActiveSubTab('indirect', event.selectedIndirectSubTab));
      }
      
      dispatch(eventActions.clearError());
    },
    
    // ... 他のハンドラー
  };
};
```

### Phase 4: Zustand Storeの整理

#### 4.1 不要な状態の削除
```typescript
// store/zissekiStore.ts
interface ZissekiState {
  // マスターデータのみ残す
  workTimes: WorkTimeData[];
  employees: Employee[];
  projects: Project[];
  currentUser: User | null;
  
  // システム状態
  loading: boolean;
  error: string | null;
  isInitialized: boolean;
  
  // 削除予定（Event Reducerに移動）
  // selectedProjectCode: string; // 削除
  // purposeProjectCode: string; // 削除
  // selectedOtherSubTab: string; // 削除
  // selectedIndirectDetailTab: string; // 削除
}
```

#### 4.2 useSidebarStateの削除
```typescript
// components/sidebar/hooks/useSidebarState.ts
// このファイルを削除し、Event Reducerに統合
```

## 📋 実装順序

### Step 1: 型定義の拡張
1. `event/types.ts`の更新
2. 新しいアクション型の追加

### Step 2: リデューサーの拡張
1. `event/eventReducer.ts`の更新
2. 新しいケースの追加

### Step 3: アクションの拡張
1. `event/eventActions.ts`の更新
2. 新しいアクションクリエーターの追加

### Step 4: イベント選択時の状態反映
1. イベント選択ハンドラーの更新
2. サイドバー状態の初期化処理の追加

### Step 5: コンポーネントの更新
1. タブコンテンツの更新（イベント属性との連携）
2. サイドバーコンポーネントの更新（双方向連携）
3. useStateの削除

### Step 6: Zustand Storeの整理
1. 不要な状態の削除
2. useSidebarStateの削除

### Step 7: テスト・確認
1. イベント選択時のサイドバー状態反映確認
2. サイドバー操作時のイベント属性更新確認
3. データの整合性確認
4. エラーハンドリングの確認

## 🎯 期待される効果

### メリット
- **データの整合性向上**: イベントの属性とサイドバーの状態が常に同期
- **双方向連携**: イベント選択 → サイドバー反映、サイドバー操作 → イベント更新
- **保守性向上**: 状態管理の一元化
- **デバッグ容易性**: 状態の追跡が簡単
- **型安全性**: TypeScriptの恩恵を最大限活用

### 注意点
- **段階的移行**: 一度に全て変更せず、段階的に移行
- **既存機能の維持**: 現在の機能を壊さないよう注意
- **双方向連携のテスト**: イベント選択とサイドバー操作の両方向を確認
- **データ整合性の確認**: イベントの属性とサイドバーの状態が常に一致することを確認

## 🔍 統合後の状態管理構成

### 最終的な構成
1. **Event Reducer**: UI状態の統合管理
   - イベントデータ
   - 選択状態
   - タブ状態（メイン + 詳細）
   - プロジェクト選択状態
   - **サイドバー状態（イベントの属性と連携）**

2. **Zustand Store**: マスターデータ管理
   - 従業員データ
   - プロジェクト一覧
   - ユーザーデータ
   - 勤務時間データ

3. **useState**: 純粋なUI状態
   - モーダル状態
   - フォーム状態
   - ローディング状態

### 双方向連携の実現
- **イベント選択時**: イベントの属性でサイドバーの状態を初期化
- **サイドバー操作時**: サイドバーの状態でイベントの属性を更新
- **常時同期**: イベントの属性とサイドバーの状態が常に一致

この統合により、サイドバーとイベントの双方向連携が実現され、データの整合性が大幅に向上します。 