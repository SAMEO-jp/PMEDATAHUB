# イベントデータ構造・仕様ドキュメント

## 概要

実績管理システム（zisseki-demo）におけるイベントデータの構造、使用方法、関連ロジックを整理したドキュメントです。

## データベース構造

### eventsテーブル

データベース：`data/achievements.db`  
テーブル名：`events`

#### カラム構造

| カラム名 | データ型 | NULL可否 | 説明 | 主な使用用途 |
|---------|---------|---------|------|-------------|
| `id` | TEXT | NOT NULL | イベントの一意の識別子 | 主キー、イベントの参照 |
| `title` | TEXT | NOT NULL | イベントのタイトル | UI表示、イベントの概要 |
| `description` | TEXT | NULL | イベントの詳細説明 | UI表示、追加情報 |
| `project` | TEXT | NULL | 関連プロジェクト | プロジェクトフィルタリング |
| `startDateTime` | TEXT | NOT NULL | イベント開始日時 | タイムグリッド表示、時間計算 |
| `endDateTime` | TEXT | NOT NULL | イベント終了日時 | タイムグリッド表示、時間計算 |
| `top` | INTEGER | NULL | UI上のY座標（ピクセル） | タイムグリッド内の位置表示 |
| `height` | INTEGER | NULL | UI上の高さ（ピクセル） | タイムグリッド内のサイズ表示 |
| `color` | TEXT | NULL | イベントの色 | UIでの視覚的区別 |
| `unsaved` | INTEGER | NULL | 未保存フラグ | 保存状態の管理 |
| `category` | TEXT | NULL | カテゴリ分類 | イベントの分類 |
| `employeeNumber` | TEXT | NULL | 従業員番号 | ユーザー関連付け |
| `activityCode` | TEXT | NULL | 業務分類コード | 業務内容の分類 |
| `purposeProject` | TEXT | NULL | 目的プロジェクト | プロジェクト関連付け |
| `departmentCode` | TEXT | NULL | 部署コード | 組織関連付け |
| `equipmentNumber` | TEXT | NULL | 設備番号 | 設備関連付け |
| `equipmentName` | TEXT | NULL | 設備名 | UI表示 |
| `equipment_id` | TEXT | NULL | 設備ID | 設備データ参照 |
| `equipment_Name` | TEXT | NULL | 設備名（別表記） | UI表示 |
| `itemName` | TEXT | NULL | 品目名 | 購入品関連付け |
| `planningSubType` | TEXT | NULL | 計画サブタイプ | 業務詳細分類 |
| `estimateSubType` | TEXT | NULL | 見積サブタイプ | 業務詳細分類 |
| `designSubType` | TEXT | NULL | 設計サブタイプ | 業務詳細分類 |
| `meetingType` | TEXT | NULL | 会議タイプ | 会議分類 |
| `travelType` | TEXT | NULL | 出張タイプ | 出張分類 |
| `stakeholderType` | TEXT | NULL | 関係者タイプ | 関係者分類 |
| `documentType` | TEXT | NULL | 資料タイプ | 資料分類 |
| `documentMaterial` | TEXT | NULL | 資料素材 | 資料詳細 |
| `subTabType` | TEXT | NULL | サブタブタイプ | UIタブ管理 |
| `activityColumn` | TEXT | NULL | 活動カラム | UI配置管理 |
| `indirectType` | TEXT | NULL | 間接業務タイプ | 間接業務分類 |
| `indirectDetailType` | TEXT | NULL | 間接業務詳細タイプ | 間接業務詳細分類 |
| `selectedTab` | TEXT | NULL | 選択中タブ | UI状態管理 |
| `selectedProjectSubTab` | TEXT | NULL | 選択中プロジェクトサブタブ | UI状態管理 |
| `selectedIndirectSubTab` | TEXT | NULL | 選択中間接業務サブタブ | UI状態管理 |
| `selectedIndirectDetailTab` | TEXT | NULL | 選択中間接業務詳細タブ | UI状態管理 |
| `selectedOtherSubTab` | TEXT | NULL | 選択中その他サブタブ | UI状態管理 |
| `status` | TEXT | NULL | ステータス | 進捗状況管理 |
| `createdAt` | TEXT | NOT NULL | 作成日時 | 監査ログ |
| `updatedAt` | TEXT | NOT NULL | 更新日時 | 監査ログ |

## 型定義

### TimeGridEventインターフェース

```typescript
// src/app/zisseki-demo/[year]/[week]/types/index.ts
export interface TimeGridEvent {
  id: string;
  title: string;
  description?: string;
  project?: string;
  setsubi?: string; // 選択された設備（製番）
  kounyu?: string; // 選択された購入品（管理番号）
  user_id?: string; // ユーザーID
  equipmentNumber?: string;
  equipmentName?: string;
  equipment_id?: string;
  equipment_Name?: string;
  itemName?: string;
  startDateTime: string;
  endDateTime: string;
  activityCode?: BusinessCode; // 業務分類コード
  purposeProject?: string;
  departmentCode?: string;

  // UI関連プロパティ
  top?: number;
  height?: number;
  status?: string;

  // UI拡張プロパティ
  color: string;
  unsaved?: boolean;
  category?: string;
  employeeNumber?: string;
  selectedTab?: string;
  selectedProjectSubTab?: string;
  selectedIndirectSubTab?: string;
  selectedIndirectDetailTab?: string;
  selectedOtherSubTab?: string;
}
```

## イベントデータの使用ロジック

### 1. データ取得ロジック

#### 週次データ取得
```typescript
// useZissekiData.ts - 週次データ取得
export const useZissekiWeekData = (year: number, week: number, userId: string) => {
  return trpc.zisseki.getWeekData.useQuery(
    { year, week, userId },
    {
      staleTime: Infinity,
      enabled: !!userId,
      // 週の開始・終了日時を計算してクエリ実行
    }
  );
};
```

#### データベースクエリ
```sql
-- zisseki.ts - 週次データ取得クエリ
SELECT * FROM events
WHERE startDateTime >= ? AND startDateTime <= ?
  AND (employeeNumber = ? OR employeeNumber IS NULL OR employeeNumber = '')
ORDER BY startDateTime ASC
```

### 2. 状態管理ロジック

#### Event Reducer
```typescript
// eventReducer.ts - イベント状態管理
export function eventReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false };
    case 'UPDATE_EVENT':
      const updatedEvents = state.events.map(event =>
        event.id === action.payload.eventId
          ? { ...event, ...action.payload.event }
          : event
      );
      return { ...state, events: updatedEvents };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload)
      };
  }
}
```

### 3. UI表示ロジック

#### タイムグリッド表示
```typescript
// EventDisplay.tsx - イベント表示コンポーネント
const EventDisplay = ({ event, selectedEvent, onClick }) => {
  const isSelected = selectedEvent?.id === event.id;
  const activityCode = event.activityCode || '未設定';

  return (
    <div
      style={{
        top: `${event.top}px`,
        height: `${event.height}px`,
        backgroundColor: event.color,
      }}
      onClick={() => onClick(event)}
    >
      {/* 業務コード表示 */}
      <div>{activityCode}</div>

      {/* イベントタイトル */}
      <div>{event.title}</div>

      {/* イベント説明（高さが十分な場合） */}
      {event.description && event.height >= 30 && (
        <div>{event.description}</div>
      )}
    </div>
  );
};
```

#### ドラッグ＆リサイズ処理
```typescript
// EventDisplay.tsx - ドラッグ移動処理
const handleMouseMove = (e: MouseEvent) => {
  if (isDragging) {
    // 日付変更処理
    const newDayIndex = calculateDayIndexFromMouseX(e.clientX, weekDays);
    const newTop = e.clientY - parentRect.top - dragOffset.y;

    // 位置更新
    setTempPosition({ top: snappedTop });
    setTempDayIndex(newDayIndex);
  }
};
```

## UIコンポーネントとの関連

### 1. タイムグリッド表示 (TimeGrid.tsx)
- `startDateTime`/`endDateTime` → イベントの時間位置計算
- `top`/`height` → UI上の表示位置・サイズ
- `color` → イベントの背景色
- `activityCode` → 右上に表示される業務コード
- `title`/`description` → イベントの内容表示

### 2. サイドバー編集 (ZissekiSidebar.tsx)
- 選択されたイベントの全プロパティを編集可能
- `activityCode` → タブ切り替えの判定に使用
- プロジェクト/設備/購入品の選択状態管理
- リアルタイムでのイベント更新

### 3. イベント作成 (EventCreationHandler.tsx)
- 新規イベントの作成時にデフォルト値を設定
- 日時クリック位置から`startDateTime`を計算
- UI位置から`top`/`height`を計算

## APIエンドポイント

### 1. データ取得
```typescript
// 週次データ取得
trpc.zisseki.getWeekData.useQuery({ year, week, userId })

// 月次データ取得
trpc.zisseki.getMonthData.useQuery({ year, month, userId })

// ワークタイム取得
trpc.zisseki.getWorkTimes.useQuery({ year, week, userId })
```

### 2. データ操作
```typescript
// 週次データ保存
trpc.zisseki.saveWeekData.useMutation()

// 個別イベント更新
trpc.zisseki.updateEvent.useMutation()

// 個別イベント削除
trpc.zisseki.deleteEvent.useMutation()
```

## 主要な処理フロー

### 1. イベント表示フロー
1. `DatabaseProvider` → ユーザーID取得
2. `useZissekiOperations` → tRPCで週次データ取得
3. `TimeGrid` → イベントをタイムグリッドに配置
4. `EventDisplay` → 各イベントの視覚的表示

### 2. イベント編集フロー
1. `EventDisplay` → クリックでイベント選択
2. `ZissekiSidebar` → サイドバーに編集UI表示
3. `eventReducer` → 状態更新
4. `useZissekiData` → tRPCでデータ保存

### 3. ドラッグ＆ドロップフロー
1. `EventDisplay` → マウスダウンでドラッグ開始
2. リアルタイムで位置計算・一時表示
3. マウスアップで確定
4. `calculateEventDateTime` → 位置から日時再計算
5. イベント更新

## データの整合性管理

### 1. 日時計算ユーティリティ
```typescript
// eventPositionCalculator.ts
export const calculateEventDateTime = (
  baseStartDateTime: string,
  top: number,
  height: number
) => {
  // top/heightからstartDateTime/endDateTimeを計算
  // 1時間 = 64px, 1分 = 1.0667px
};
```

### 2. 業務コード解析
```typescript
// businessCodeUtils.ts
export const parseActivityCode = (code: string) => {
  // 業務コードからタブ/サブタブ情報を解析
  // PP01 → プロジェクトタブ
  // ZW04 → 間接業務タブ
};
```

## パフォーマンス最適化

### 1. キャッシュ戦略
```typescript
// useZissekiData.ts
{
  staleTime: Infinity, // キャッシュ有効期間
  gcTime: Infinity,    // ガベージコレクション時間
  refetchOnWindowFocus: false,
  enabled: !!userId    // 条件付きクエリ実行
}
```

### 2. UI最適化
- ドラッグ中のリアルタイム更新（`isDragging`フラグ）
- イベントの高さに応じた表示内容の調整
- 選択状態の視覚的フィードバック

## エラーハンドリング

### 1. APIエラー
```typescript
// zisseki.ts
try {
  const result = await getAllRecords('events', query, params);
  if (!result.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: result.error?.message || 'データの取得に失敗しました'
    });
  }
} catch (error) {
  console.error('tRPC zisseki.getWeekData error:', error);
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'データの取得に失敗しました'
  });
}
```

### 2. UIエラー境界
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // エラーログ出力
    console.error('EventDisplay error:', error, errorInfo);
  }
}
```

## 拡張性と保守性

### 1. 型安全性の確保
- 全カラムに対応したTypeScriptインターフェース
- Zodスキーマによる入力バリデーション
- tRPCによるエンドポイントの型安全

### 2. 関心の分離
- UIコンポーネント：表示ロジックのみ
- カスタムフック：データ取得・状態管理
- tRPCルーター：サーバーサイド処理
- データベース層：永続化処理

### 3. テスト容易性
- 各層が独立してテスト可能
- モックデータによるUIテスト
- APIレスポンスのバリデーション

## まとめ

イベントデータは実績管理システムの中核をなすデータ構造であり、以下の特徴を持つ：

1. **包括的な業務分類**：40以上のカラムで多様な業務内容を表現
2. **柔軟なUI表現**：タイムグリッドでの視覚的表示と詳細編集
3. **リアルタイム操作**：ドラッグ＆ドロップによる直感的な操作
4. **堅牢なデータ管理**：tRPC + データベースによる型安全な処理
5. **拡張性**：新しい業務分類やUI機能を容易に追加可能

この構造により、複雑な実績管理業務を効率的に処理し、ユーザーの生産性を向上させている。
