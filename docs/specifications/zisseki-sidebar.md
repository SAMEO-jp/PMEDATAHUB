# Zissekidemo 右サイドバーコンポーネント仕様

## 概要

`ZissekiSidebar` は、Zissekidemo（実績デモ）アプリケーションの右サイドバーに表示される、作業イベントの詳細情報を管理するコンポーネントです。

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ZissekiSidebar.tsx`

## 主な機能

- 選択されたイベントの詳細表示と編集
- プロジェクト、装置（設備）、購入品の割り当て管理
- 業務分類コード（Activity Code）の設定
- イベントの色と進捗状況の管理
- イベントの削除

## コンポーネント構成

### プロパティ

`ZissekiSidebar` 自体は props を受け取りません。コンテキストとストアから必要な情報を取得します。

### 使用するコンテキスト・フック

#### 1. EventContext

```typescript
const {
  selectedEvent,           // 現在選択されているイベント（TimeGridEvent型）
  handleUpdateEvent,       // イベント更新関数
  handleDeleteEvent,       // イベント削除関数
  dispatch                 // 状態管理のディスパッチ関数
} = useEventContext();
```

#### 2. DatabaseContext

```typescript
const { userInfo } = useDatabase();  // ユーザー情報（プロジェクト参加情報を含む）
```

#### 3. useProjectAssignments フック

```typescript
const {
  userProjects,                      // ユーザーが参加しているプロジェクト一覧
  getSetsubiByProject,               // プロジェクトに紐づく装置を取得
  getKounyuByProject,                // プロジェクトに紐づく購入品を取得
  getProjectSetsubiCombinations,     // プロジェクト-装置の組み合わせ一覧
  getProjectKounyuCombinations       // プロジェクト-購入品の組み合わせ一覧
} = useProjectAssignments(userInfo);
```

#### 4. ZissekiStore

```typescript
const { projects } = useZissekiStore();  // プロジェクト一覧（フォールバック）
```

### 内部状態管理

コンポーネントは以下のローカル状態を管理します：

```typescript
const [localValues, setLocalValues] = useState({
  title: '',              // イベントタイトル
  description: '',        // イベント説明
  project: '',            // プロジェクトコード
  setsubi: '',           // 選択された装置（製番）
  kounyu: '',            // 選択された購入品（管理番号）
  activityCode: '',      // 業務分類コード
  color: '#3B82F6',      // イベントの表示色（デフォルト：青）
  status: ''             // 進捗状況
});
```

## サブコンポーネント

### 1. SidebarHeader

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/SidebarHeader.tsx`

**Props定義**:

```typescript
interface SidebarHeaderProps {
  title: string;                                    // ヘッダータイトル
  eventId: string;                                  // イベントID
  activeTab: Tab;                                   // アクティブなタブ（'project' | 'indirect'）
  onTabChange: (eventId: string, tab: Tab) => void; // タブ変更時のコールバック
}
```

**役割**: サイドバーのヘッダー部分を表示し、プロジェクト/間接業務のタブ切り替えを提供します。

---

### 2. SidebarEmpty

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/SidebarEmpty.tsx`

**Props定義**:

```typescript
interface SidebarEmptyProps {
  message: string;  // 空状態時に表示するメッセージ
}
```

**役割**: イベントが選択されていない時の空状態を表示します。

---

### 3. SidebarBasic

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/SidebarBasic.tsx`

**Props定義**:

```typescript
interface SidebarBasicProps {
  form: FormState;
}

interface FormState {
  title: string;                                    // タイトル
  description: string;                              // 説明
  project: string;                                  // プロジェクト
  activityCode: string;                             // 業務分類コード
  onLocalChange: (field: string, value: string) => void;  // 入力中の変更
  onCommit: (field: string, value: string) => void;       // 確定時の変更
}
```

**役割**: イベントの基本情報（タイトル、説明）の入力フィールドを表示します。

---

### 4. ProjectSelect

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/ProjectSelect.tsx`

**Props定義**:

```typescript
interface ProjectSelectProps {
  value: string;                      // 選択中のプロジェクトコード
  onLocalChange: OnLocalChange;       // 値変更時のコールバック
  onCommit?: OnCommit;               // 確定時のコールバック（オプション）
  projects?: ProjectVariant[];       // プロジェクト一覧
  label?: string;                    // ラベルテキスト（デフォルト: "プロジェクト"）
  placeholder?: string;              // プレースホルダー（デフォルト: "プロジェクト選択"）
}
```

**役割**: プロジェクトの選択ドロップダウンを提供します。

---

### 5. SetsubiSelect

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/SetsubiSelect.tsx`

**Props定義**:

```typescript
interface SetsubiSelectProps {
  value: string;                      // 選択中の装置コード（製番）
  onLocalChange: OnLocalChange;       // 値変更時のコールバック
  setsubiList: SetsubiInfo[];        // 装置情報一覧
  label?: string;                    // ラベルテキスト
}
```

**役割**: プロジェクトに紐づく装置（設備）の選択ドロップダウンを提供します。

---

### 6. KounyuSelect

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/KounyuSelect.tsx`

**Props定義**:

```typescript
interface KounyuSelectProps {
  value: string;                      // 選択中の購入品コード（管理番号）
  onLocalChange: OnLocalChange;       // 値変更時のコールバック
  kounyuList: KounyuInfo[];          // 購入品情報一覧
  label?: string;                    // ラベルテキスト
}
```

**役割**: プロジェクトに紐づく購入品の選択ドロップダウンを提供します。

---

### 7. ProjectSetsubiSelect

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/ProjectSetsubiSelect.tsx`

**Props定義**:

```typescript
interface ProjectSetsubiSelectProps {
  value: string;                                // 選択中の値（形式: "projectId|setsubiCode"）
  onLocalChange: (value: string) => void;       // 値変更時のコールバック
  combinations: ProjectSetsubiCombination[];    // プロジェクト-装置の組み合わせ一覧
  label?: string;                               // ラベルテキスト
}
```

**役割**: プロジェクトが未選択の場合に、プロジェクトと装置を同時に選択できるドロップダウンを提供します。

---

### 8. ProjectKounyuSelect

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/ProjectKounyuSelect.tsx`

**Props定義**:

```typescript
interface ProjectKounyuSelectProps {
  value: string;                                // 選択中の値（形式: "projectId|kounyuCode"）
  onLocalChange: (value: string) => void;       // 値変更時のコールバック
  combinations: ProjectKounyuCombination[];     // プロジェクト-購入品の組み合わせ一覧
  label?: string;                               // ラベルテキスト
}
```

**役割**: プロジェクトが未選択の場合に、プロジェクトと購入品を同時に選択できるドロップダウンを提供します。

---

### 9. ColorPicker

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/ColorPicker.tsx`

**Props定義**:

```typescript
interface ColorPickerProps {
  currentColor: string;                         // 現在の色（hex形式）
  onColorChange: (color: string) => void;       // 色変更時のコールバック
  label?: string;                               // ラベルテキスト
}
```

**役割**: イベントの表示色を選択するカラーピッカーを提供します。

---

### 10. ProgressSelect

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/ProgressSelect.tsx`

**Props定義**:

```typescript
interface ProgressSelectProps {
  currentProgress: string;                      // 現在の進捗状況
  onProgressChange: (status: string) => void;   // 進捗変更時のコールバック
  label?: string;                               // ラベルテキスト
}
```

**役割**: イベントの進捗状況を選択するドロップダウンを提供します。

---

### 11. SidebarActiveCodeEditor

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/SidebarActiveCodeEditor.tsx`

**Props定義**:

```typescript
interface SimpleActiveCodeEditorProps {
  selectedEvent: TimeGridEvent | null;                    // 選択中のイベント
  onEventUpdate?: (updates: Partial<TimeGridEvent>) => void;  // イベント更新関数
}
```

**役割**: 業務分類コード（Activity Code）を編集するためのUIを提供します。

---

### 12. DeleteButton

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ui/DeleteButton.tsx`

**Props定義**:

```typescript
interface DeleteButtonProps {
  onDelete: () => void;  // 削除実行時のコールバック
}
```

**役割**: イベントを削除するボタンを提供します。

## 主要な型定義

### Tab型

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ui/types.ts`

```typescript
export const TAB = { PROJECT: 'project', INDIRECT: 'indirect' } as const;
export type Tab = typeof TAB[keyof typeof TAB];
```

**値**:
- `'project'` - プロジェクト業務タブ
- `'indirect'` - 間接業務タブ

---

### TimeGridEvent型

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/types/index.ts`

```typescript
export type TimeGridEvent = Event & {
  top: number;                    // グリッド上のY座標位置
  height: number;                 // イベントの高さ
  color: string;                  // 表示色
  unsaved?: boolean;              // 未保存フラグ
  category?: string;              // カテゴリー
  employeeNumber?: string;        // 社員番号
  activityCode?: string;          // 業務分類コード
  selectedTab?: string;           // 選択中のタブ
  selectedProjectSubTab?: string; // プロジェクトサブタブ
  selectedIndirectSubTab?: string;// 間接業務サブタブ
  selectedIndirectDetailTab?: string; // 間接業務詳細タブ
  selectedOtherSubTab?: string;   // その他サブタブ
  dayIndex?: number;              // 曜日インデックス
  source?: string;                // イベントのソース
  hierarchy?: {                   // 階層情報
    activeTab: string;
    activeSubTabs: {
      [key: string]: string;
    };
  };
}
```

---

### FormState型

**ファイルパス**: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ui/types.ts`

```typescript
export interface FormState {
  title: string;
  description: string;
  project: string;
  activityCode: string;
  onLocalChange: (field: string, value: string) => void;
  onCommit: (field: string, value: string) => void;
}
```

## 動作フロー

### 1. イベント選択時

1. `EventContext` から `selectedEvent` を取得
2. `useEffect` でローカル状態 (`localValues`) を更新
3. サイドバーに選択されたイベントの詳細情報を表示

### 2. フィールド編集時

**テキスト入力フィールド（タイトル、説明）**:
1. 入力中: `handleLocalChange` でローカル状態のみ更新
2. blur時: `handleFieldBlur` でイベントを更新し、再選択

**セレクトボックス（プロジェクト、装置、購入品など）**:
1. 選択時: `handleSelectChange` で即座にイベントを更新し、再選択
2. プロジェクト変更時は装置と購入品の選択をリセット

### 3. タブ切り替え時

1. `handleTabChange` が呼ばれる
2. タブに応じてデフォルトの業務分類コードを設定:
   - プロジェクトタブ: `'PP01'`
   - 間接業務タブ: `'ZW04'`
3. イベントを更新し、再選択

### 4. プロジェクトフィルタリング

- **プロジェクトタブ**: `IS_PROJECT = '1'` のプロジェクトのみ表示
- **間接業務タブ**: `IS_PROJECT = '0'` のプロジェクトのみ表示

### 5. 装置/購入品の選択

**プロジェクト選択済みの場合**:
- そのプロジェクトに紐づく装置/購入品のみ表示

**プロジェクト未選択の場合**:
- プロジェクト-装置 or プロジェクト-購入品の組み合わせ選択UIを表示
- 選択時にプロジェクトと装置/購入品を同時に設定

## 使用例

```tsx
import { ZissekiSidebar } from './components/sidebar/ZissekiSidebar';

// 親コンポーネント内で使用
function ZissekiWeekPage() {
  return (
    <div className="flex">
      <div className="flex-1">
        {/* メインコンテンツ（カレンダーグリッドなど） */}
      </div>
      <div className="w-80">
        {/* 右サイドバー */}
        <ZissekiSidebar />
      </div>
    </div>
  );
}
```

## 関連ファイル

- メインコンポーネント: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ZissekiSidebar.tsx`
- 型定義: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ui/types.ts`
- サブコンポーネント: `src/app/zisseki-demo/[year]/[week]/components/sidebar/components/`
- UIコンポーネント: `src/app/zisseki-demo/[year]/[week]/components/sidebar/ui/`

## 注意事項

1. **プロジェクト変更時の副作用**: プロジェクトを変更すると、装置と購入品の選択がリセットされます
2. **タブ切り替え時のコード変更**: タブを切り替えると、業務分類コードがデフォルト値にリセットされます
3. **装置と購入品の排他制御**: 装置を選択すると購入品はリセットされ、逆も同様です
4. **プロジェクトフィルタリング**: タブに応じて表示されるプロジェクトが自動的にフィルタリングされます
