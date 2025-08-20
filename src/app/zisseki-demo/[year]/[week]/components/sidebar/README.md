# サイドバーコンポーネント Props ドキュメント

## 📋 概要

このドキュメントは、実績デモ機能のサイドバーコンポーネントのProps仕様を説明します。サイドバーは、イベントの詳細編集機能を提供し、Propsまとまりのオブジェクト化により保守性と可読性を向上させています。

## 🏗️ コンポーネント構成

```
sidebar/
├── ZissekiSidebar.tsx          # メインサイドバーコンポーネント
├── components/                  # 中規模コンポーネント
│   ├── SidebarHeader.tsx       # ヘッダー（タイトル + タブ選択）
│   ├── SidebarBasic.tsx        # 基本情報編集（タイトル + 説明）
│   ├── SidebarActiveCodeEditor.tsx # アクティビティコード編集
│   ├── ProjectSelect.tsx       # プロジェクト選択
│   └── SidebarEmpty.tsx        # 空状態表示
├── ui/                         # 小規模UIコンポーネント
│   ├── TabSelector.tsx         # タブ選択UI
│   ├── TitleField.tsx          # タイトル入力フィールド
│   ├── DescriptionField.tsx    # 説明入力フィールド
│   ├── DeleteButton.tsx        # 削除ボタン
│   ├── TimeInputField.tsx      # 時間入力フィールド
│   ├── DetailClassifications.tsx # 詳細分類選択
│   └── ...                     # その他のUIコンポーネント
└── types.ts                    # 型定義
```

## 🎯 型定義

### 基本型

```typescript
// タブ型の集中管理
export const TAB = { PROJECT: 'project', INDIRECT: 'indirect' } as const;
export type Tab = typeof TAB[keyof typeof TAB];

// Project型の厳密化
export interface Project {
  code: string;        // プロジェクトコード
  name: string;        // プロジェクト名
  description?: string;
  status?: string;
}

// イベント更新の型定義
export type UpdateEvent = (patch: any) => void;

// ローカル変更と確定の型定義
export type OnLocalChange = (value: string) => void;
export type OnCommit = (value: string) => void;
```

## 📦 メインコンポーネント

### ZissekiSidebar

**役割**: サイドバーのメインコンポーネント。イベントの詳細編集機能を統合管理。

```typescript
interface ZissekiSidebarProps {
  projects: Project[];
}
```

**Props説明**:
- `projects`: プロジェクト一覧データ

**使用例**:
```tsx
<ZissekiSidebar projects={projectList} />
```

## 🧩 中規模コンポーネント

### SidebarHeader

**役割**: サイドバーのヘッダー部分。タイトル表示とタブ選択機能を提供。

```typescript
interface SidebarHeaderProps {
  title: string;
  eventId: string;
  activeTab: Tab;
  onTabChange: (eventId: string, tab: Tab) => void;
}
```

**Props説明**:
- `title`: ヘッダーのタイトル
- `eventId`: 現在選択中のイベントID
- `activeTab`: 現在アクティブなタブ
- `onTabChange`: タブ変更時のコールバック

**使用例**:
```tsx
<SidebarHeader 
  title="業務詳細"
  eventId={selectedEvent.id}
  activeTab={activeTab}
  onTabChange={handleTabChange}
/>
```

### SidebarBasic

**役割**: 基本情報（タイトル、説明）の編集機能を提供。

```typescript
interface SidebarBasicProps {
  form: FormState;
}

interface FormState {
  title: string;
  description: string;
  project: string;
  activityCode: string;
  onLocalChange: (field: string, value: string) => void;
  onCommit: (field: string, value: string) => void;
}
```

**Props説明**:
- `form`: フォーム状態とアクションをまとめたオブジェクト
  - `title`: タイトル値
  - `description`: 説明値
  - `project`: プロジェクト値
  - `activityCode`: アクティビティコード値
  - `onLocalChange`: ローカル変更時のコールバック
  - `onCommit`: 確定時のコールバック

**使用例**:
```tsx
<SidebarBasic
  form={{
    title: localValues.title,
    description: localValues.description,
    project: localValues.project,
    activityCode: localValues.activityCode,
    onLocalChange: handleLocalChange,
    onCommit: handleFieldBlur
  }}
/>
```

### SidebarActiveCodeEditor

**役割**: アクティビティコードの詳細編集機能を提供。

```typescript
interface ActiveCodeEditorProps {
  state: ActiveCodeEditorState;
  event: EventBinding;
}

interface ActiveCodeEditorState {
  selectedTab: Tab;
  projectSubTab: string;
  indirectSubTab: string;
}

interface EventBinding {
  selectedEvent: any | null;
  updateEvent: (event: any) => void;
}
```

**Props説明**:
- `state`: エディターの状態
  - `selectedTab`: 選択中のタブ（プロジェクト/間接業務）
  - `projectSubTab`: プロジェクトサブタブ
  - `indirectSubTab`: 間接業務サブタブ
- `event`: イベント関連のデータとアクション
  - `selectedEvent`: 選択中のイベント
  - `updateEvent`: イベント更新関数

**使用例**:
```tsx
<SidebarActiveCodeEditor
  state={{
    selectedTab: activeTab,
    projectSubTab: selectedProjectSubTab,
    indirectSubTab: selectedIndirectSubTab
  }}
  event={{
    selectedEvent,
    updateEvent: handleUpdateEvent
  }}
/>
```

### ProjectSelect

**役割**: プロジェクト選択のドロップダウン機能を提供。

```typescript
interface ProjectSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  projects: Project[];
  label?: string;
  placeholder?: string;
}
```

**Props説明**:
- `value`: 選択中のプロジェクトコード
- `onLocalChange`: ローカル変更時のコールバック
- `onCommit`: 確定時のコールバック（オプション）
- `projects`: プロジェクト一覧
- `label`: ラベルテキスト（オプション）
- `placeholder`: プレースホルダーテキスト（オプション）

**使用例**:
```tsx
<ProjectSelect
  value={localValues.project}
  onLocalChange={(value) => handleSelectChange('project', value)}
  projects={projects}
  label="プロジェクト"
  placeholder="選択してください"
/>
```

### SidebarEmpty

**役割**: イベントが選択されていない場合の空状態表示。

```typescript
interface SidebarEmptyProps {
  message: string;
}
```

**Props説明**:
- `message`: 表示するメッセージ

**使用例**:
```tsx
<SidebarEmpty message="イベントを選択してください" />
```

## 🎨 UIコンポーネント

### TabSelector

**役割**: プロジェクト/間接業務のタブ選択UI。

```typescript
interface TabSelectorProps {
  eventId: string;
  activeTab: Tab;
  onTabChange: (eventId: string, newTab: Tab) => void;
}
```

**Props説明**:
- `eventId`: イベントID
- `activeTab`: 現在アクティブなタブ
- `onTabChange`: タブ変更時のコールバック

### TitleField

**役割**: タイトル入力フィールド。

```typescript
interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  label?: string;
  placeholder?: string;
}
```

### DescriptionField

**役割**: 説明入力フィールド。

```typescript
interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}
```

### DeleteButton

**役割**: イベント削除ボタン。

```typescript
interface DeleteButtonProps {
  onDelete: () => void;
  label?: string;
}
```

### TimeInputField

**役割**: 時間入力フィールド。

```typescript
interface TimeInputProps {
  state: TimeInputState;
  actions: TimeInputActions;
}

interface TimeInputState {
  selectedEvent: Record<string, unknown> | null;
  label?: string;
}

interface TimeInputActions {
  onEventUpdate: (eventId: string, updates: any) => void;
}
```

### DetailClassifications

**役割**: 詳細分類選択機能。

```typescript
interface DetailClassificationsProps {
  state: ClassificationState;
  actions: ClassificationActions;
}

interface ClassificationState {
  selectedTab: Tab;
  mainSubTab: string;
  detailSubTab: string;
  currentCode: string;
}

interface ClassificationActions {
  onSelect: (code: string, additionalData: any) => void;
  getProjectClassifications: () => any[] | null;
  getIndirectClassifications: () => Record<string, any[]> | null;
  generateProjectCode: (mainTab: string, detailTab: string, classification: any, subTabType: string) => string;
  generateIndirectCode: (mainTab: string, detailTab: string, classification: any) => string;
  getProjectData: (classification: any) => any;
  getIndirectData: (detailTab: string, classification: any) => any;
  getPurchaseClassifications: () => any[];
}
```

## 🔄 データフロー

### イベント境界の整理

1. **ローカル変更**: `onChange` → 即座にUI更新
2. **確定保存**: `onBlur` → 親コンポーネントに通知

### Propsまとまりのオブジェクト化

- **状態系**: `state` オブジェクトにまとめる
- **アクション系**: `actions` オブジェクトにまとめる
- **フォーム系**: `form` オブジェクトにまとめる

## 🎯 設計原則

### 1. 責任の分離
- **親**: 全体の状態管理とデータフロー
- **中間**: ビジネスロジックとローカル状態管理
- **子**: 純粋なUIとユーザーインタラクション

### 2. 型安全性
- タブ型の集中管理（`TAB`定数）
- Project型の厳密化
- イベント境界の明確化

### 3. 再利用性
- 汎用的なUIコンポーネント
- 型定義の共有
- Propsまとまりのオブジェクト化

## 📝 使用例

### 基本的な使用例

```tsx
import { ZissekiSidebar } from './components/sidebar';

function App() {
  const projects = [
    { code: 'P001', name: 'プロジェクトA' },
    { code: 'P002', name: 'プロジェクトB' }
  ];

  return (
    <div>
      <ZissekiSidebar projects={projects} />
    </div>
  );
}
```

### カスタマイズ例

```tsx
// カスタムプロジェクト選択
<ProjectSelect
  value={selectedProject}
  onLocalChange={handleProjectChange}
  onCommit={handleProjectCommit}
  projects={customProjects}
  label="カスタムプロジェクト"
  placeholder="プロジェクトを選択"
/>
```

## 🔧 拡張ポイント

### 新しいフィールドの追加

1. `FormState` インターフェースに新しいフィールドを追加
2. 対応するUIコンポーネントを作成
3. `SidebarBasic` で新しいフィールドを統合

### 新しいタブの追加

1. `TAB` 定数に新しいタブを追加
2. 対応するサブタブ設定を追加
3. `TabSelector` で新しいタブを表示

## 📚 関連ドキュメント

- [アクティビティコード仕様](./constants/activity-codes/README.md)
- [イベント型定義](../types/index.ts)
- [コンテキスト管理](../context/EventContext.tsx)
