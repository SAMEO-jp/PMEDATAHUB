# Zisseki アプリ構築計画

## 📋 概要

week-shiwakeの見た目を維持しつつ、リファクタリング仕様書とデータ型整理仕様書に基づいて、Zissekiフォルダに新しいアプリを構築します。

## 🎯 構築目標

### 1. 見た目の維持
- **TimeGrid**: 時間グリッドの表示
- **WeekSidebar**: サイドバーの機能
- **ドラッグ&ドロップ**: イベントの移動・コピー
- **勤務時間入力**: 出退勤時間の管理
- **イベント編集**: イベントの詳細編集

### 2. アーキテクチャの改善
- **型安全性**: 統一された型定義
- **コンポーネント分割**: 責務の明確化
- **カスタムフック**: ロジックの分離
- **状態管理**: Zustandの活用

## 🏗️ 構築計画

### Phase 1: 基本構造の作成

#### 1.1 フォルダ構造
```
src/app/zisseki/[year]/[week]/
├── page.tsx (メインページ)
├── layout.tsx (レイアウト)
├── imports.ts (インポート集約)
├── types/
│   ├── index.ts (型定義エクスポート)
│   ├── base.ts (基本型)
│   ├── client.ts (クライアント型)
│   ├── server.ts (サーバー型)
│   ├── ui.ts (UI状態型)
│   ├── data.ts (データ状態型)
│   └── api.ts (API型)
├── hooks/
│   ├── useZisseki.ts (メインフック)
│   ├── useWeekData.ts (週データ管理)
│   ├── useEventManager.ts (イベント管理)
│   ├── useWorkTimes.ts (勤務時間管理)
│   └── useResizeEvent.ts (リサイズ機能)
├── store/
│   ├── zissekiStore.ts (メインストア)
│   └── uiStore.ts (UI状態管理)
├── components/
│   ├── TimeGrid.tsx (時間グリッド)
│   ├── DraggableEvent.tsx (ドラッグ可能イベント)
│   ├── EventDragOverlay.tsx (ドラッグオーバーレイ)
│   ├── DroppableTimeSlot.tsx (ドロップ可能スロット)
│   ├── LoadingSpinner.tsx (ローディング)
│   ├── ErrorBoundary.tsx (エラー境界)
│   └── sidebar/
│       ├── ZissekiSidebar.tsx (メインサイドバー)
│       ├── ProjectTabContent.tsx (プロジェクトタブ)
│       ├── IndirectTabContent.tsx (間接業務タブ)
│       └── PurchaseTabContent.tsx (購買タブ)
├── lib/
│   ├── apiClient.ts (APIクライアント)
│   ├── storageManager.ts (ストレージ管理)
│   └── dataManager.ts (データ管理)
├── utils/
│   ├── typeConverters.ts (型変換)
│   ├── workTimeConverters.ts (勤務時間変換)
│   ├── colorUtils.ts (色関連)
│   ├── dateUtils.ts (日付ユーティリティ)
│   ├── eventUtils.ts (イベントユーティリティ)
│   ├── animationUtils.ts (アニメーション)
│   └── constants.ts (定数)
└── styles/
    └── zisseki.css (専用スタイル)
```

#### 1.2 型定義の作成
```typescript
// types/base.ts
export interface BaseEntity {
  id: string;
  keyID: string;
  employeeNumber: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseEvent extends BaseEntity {
  startDateTime: string;
  endDateTime: string;
  subject: string;
  content?: string;
  projectNumber?: string;
  type?: string;
  position?: string;
  facility?: string;
  status?: string;
  organizer?: string;
  businessCode?: string;
  departmentCode?: string;
  weekCode?: string;
  classification1?: string;
  classification2?: string;
  classification3?: string;
  classification4?: string;
  classification5?: string;
  classification6?: string;
  classification7?: string;
  classification8?: string;
  classification9?: string;
}
```

```typescript
// types/client.ts
export interface ClientEvent extends BaseEvent {
  title: string;
  description: string;
  project: string;
  category: string;
  color: string;
  top: number;
  height: number;
  unsaved?: boolean;
  activityCode?: string;
  activityRow?: string;
  activityColumn?: string;
  activitySubcode?: string;
  equipmentNumber?: string;
}

export interface ClientWorkTime {
  date: string;
  startTime?: string;
  endTime?: string;
  isDefault?: boolean;
}

export interface ClientUser {
  employeeNumber: string;
  name: string;
  department?: string;
  position?: string;
}

export interface ClientProject {
  id: string;
  name: string;
  number: string;
  category?: string;
  color?: string;
}

export interface ClientEmployee {
  employeeNumber: string;
  name: string;
  department?: string;
  position?: string;
  isActive?: boolean;
}
```

### Phase 2: カスタムフックの作成

#### 2.1 メインフック
```typescript
// hooks/useZisseki.ts
export const useZisseki = () => {
  // 週データ管理
  const weekData = useWeekData();
  
  // イベント管理
  const eventManager = useEventManager();
  
  // 勤務時間管理
  const workTimes = useWorkTimes();
  
  // UI状態管理
  const uiState = useUIStore();
  
  return {
    ...weekData,
    ...eventManager,
    ...workTimes,
    ...uiState
  };
};
```

#### 2.2 イベント管理フック
```typescript
// hooks/useEventManager.ts
export const useEventManager = () => {
  const [selectedEvent, setSelectedEvent] = useState<ClientEvent | null>(null);
  const [activeEvent, setActiveEvent] = useState<ClientEvent | null>(null);
  
  const createEvent = useCallback((params: CreateEventParams) => {
    // イベント作成ロジック
  }, []);
  
  const updateEvent = useCallback((event: ClientEvent) => {
    // イベント更新ロジック
  }, []);
  
  const deleteEvent = useCallback((id: string) => {
    // イベント削除ロジック
  }, []);
  
  const handleDragStart = useCallback((event: any) => {
    // ドラッグ開始ロジック
  }, []);
  
  const handleDragEnd = useCallback((event: any) => {
    // ドラッグ終了ロジック
  }, []);
  
  return {
    selectedEvent,
    setSelectedEvent,
    activeEvent,
    setActiveEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    handleDragStart,
    handleDragEnd
  };
};
```

### Phase 3: コンポーネントの作成

#### 3.1 メインページ
```typescript
// page.tsx
export default function ZissekiPage() {
  const {
    loading,
    events,
    handleEventClick,
    handleTimeSlotClick,
    handleDragStart,
    handleDragEnd,
    // ... その他の機能
  } = useZisseki();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <ErrorBoundary>
        <ZissekiLayout>
          <TimeGrid />
          <ZissekiSidebar />
        </ZissekiLayout>
      </ErrorBoundary>
    </div>
  );
}
```

#### 3.2 時間グリッド
```typescript
// components/TimeGrid.tsx
export const TimeGrid = ({
  weekDays,
  timeSlots,
  minuteSlots,
  isToday,
  events,
  handleTimeSlotClick,
  handleEventClick,
  handleResizeStart,
  workTimes = [],
  onWorkTimeChange = () => {},
}: TimeGridProps) => {
  // 既存のTimeGridのロジックを維持
  // 型安全性を向上
};
```

#### 3.3 サイドバー
```typescript
// components/sidebar/ZissekiSidebar.tsx
export const ZissekiSidebar = ({
  selectedTab,
  setSelectedTab,
  selectedEvent,
  hasChanges,
  handleDeleteEvent,
  updateEvent,
  employees,
  projects,
  setSelectedEvent,
  currentUser,
}: ZissekiSidebarProps) => {
  // 既存のWeekSidebarのロジックを維持
  // 型安全性を向上
};
```

### Phase 4: 状態管理の統合

#### 4.1 メインストア
```typescript
// store/zissekiStore.ts
interface ZissekiState {
  // 週データ
  events: ClientEvent[];
  employees: ClientEmployee[];
  projects: ClientProject[];
  currentUser: ClientUser;
  
  // UI状態
  selectedEvent: ClientEvent | null;
  activeEvent: ClientEvent | null;
  isSaving: boolean;
  hasChanges: boolean;
  
  // アクション
  setEvents: (events: ClientEvent[]) => void;
  updateEvent: (event: ClientEvent) => void;
  deleteEvent: (id: string) => void;
  // ... その他のアクション
}

export const useZissekiStore = create<ZissekiState>((set, get) => ({
  // 初期状態とアクションの実装
}));
```

### Phase 5: ユーティリティの作成

#### 5.1 型変換
```typescript
// utils/typeConverters.ts
export function convertToClientEvent(serverEvent: ServerEvent): ClientEvent {
  const startTime = new Date(serverEvent.startDateTime);
  const endTime = new Date(serverEvent.endDateTime);
  
  const top = startTime.getHours() * 64 + (startTime.getMinutes() / 60) * 64;
  const duration = (endTime.getTime() - startTime.getTime()) / 60000;
  const height = (duration / 60) * 64;
  
  return {
    ...serverEvent,
    title: serverEvent.subject,
    description: serverEvent.content || '',
    project: serverEvent.projectNumber || '',
    category: serverEvent.type || '',
    color: getEventColor(serverEvent.type),
    top,
    height,
    unsaved: false,
  };
}

export function convertToServerEvent(clientEvent: ClientEvent): ServerEvent {
  return {
    ...clientEvent,
    subject: clientEvent.title,
    content: clientEvent.description,
    projectNumber: clientEvent.project,
    type: clientEvent.category,
  };
}
```

#### 5.2 APIクライアント
```typescript
// lib/apiClient.ts
export class ZissekiAPI {
  static async getWeekData(year: number, week: number): Promise<WeekData> {
    const response = await fetch(`/api/zisseki/week/${year}/${week}`);
    if (!response.ok) {
      throw new Error(`API応答エラー: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }
  
  static async saveWeekData(year: number, week: number, data: WeekData): Promise<void> {
    const response = await fetch(`/api/zisseki/week/${year}/${week}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`保存エラー: ${response.status}`);
    }
  }
  
  static async deleteEvent(id: string): Promise<void> {
    const response = await fetch(`/api/zisseki/event/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`削除エラー: ${response.status}`);
    }
  }
}
```

## 🚀 実装順序

### Step 1: 基本構造の作成
1. **フォルダ構造の作成**
2. **型定義ファイルの作成**
3. **基本ユーティリティの作成**

### Step 2: カスタムフックの実装
1. **useWeekData** - 週データ管理
2. **useEventManager** - イベント管理
3. **useWorkTimes** - 勤務時間管理
4. **useZisseki** - メインフック

### Step 3: コンポーネントの実装
1. **TimeGrid** - 時間グリッド
2. **ZissekiSidebar** - サイドバー
3. **DraggableEvent** - ドラッグ可能イベント
4. **EventDragOverlay** - ドラッグオーバーレイ

### Step 4: 状態管理の実装
1. **zissekiStore** - メインストア
2. **uiStore** - UI状態管理
3. **ストアの統合**

### Step 5: APIとデータ管理
1. **apiClient** - APIクライアント
2. **storageManager** - ストレージ管理
3. **dataManager** - データ管理

### Step 6: 統合とテスト
1. **メインページの統合**
2. **型安全性の確認**
3. **機能テスト**

## 📝 移行ガイドライン

### 1. 段階的移行
- 一度に全てを移行せず、段階的に実装
- 各段階で動作確認
- 既存のweek-shiwakeは残して動作確認

### 2. 見た目の維持
- CSSクラス名の維持
- コンポーネントの構造維持
- スタイルの継承

### 3. 機能の確認
- ドラッグ&ドロップ機能
- イベント編集機能
- 勤務時間入力機能
- データ保存機能

## 🎯 期待される効果

### 1. 型安全性の向上
- 統一された型定義
- コンパイル時のエラー検出
- IDEの自動補完機能

### 2. 保守性の向上
- コンポーネントの分割
- カスタムフックの活用
- 状態管理の統合

### 3. 拡張性の向上
- 新機能の追加が容易
- 既存機能の修正が安全
- 再利用可能なコンポーネント

この構築計画に基づいて、Zissekiフォルダに新しいアプリを構築できます。見た目を維持しつつ、型安全性と保守性を向上させたアプリケーションが完成します。 