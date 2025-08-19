# ProjectDetailTabs コンポーネント解説

## 📋 概要

`ProjectDetailTabs`は、実績管理システムにおけるプロジェクト業務の詳細分類を管理するコンポーネントです。このコンポーネントは、選択されたプロジェクトのサブタブ（計画、設計、会議、その他、購入品）に応じて、さらに詳細な分類タブを表示し、業務分類コード（activityCode）の自動生成を行います。

## 🏗️ アーキテクチャと関係性

### 親コンポーネントとの関係

```
ZissekiSidebar
├── ConditionalContent
│   └── ProjectDetailTabs ← このコンポーネント
└── ProjectTabContent
    └── ProjectDetailTabs ← 別の実装
```

### データフロー

```
EventContext (状態管理)
    ↓
ProjectDetailTabs (UI表示・操作)
    ↓
activityCode (業務分類コード)
    ↓
イベントデータ更新
```

## 🎯 主要機能

### 1. 条件付きレンダリング
- **表示条件**: `selectedTab === "project"` かつ特定のサブタブが選択されている場合のみ表示
- **対象サブタブ**: 計画、設計、会議、その他、購入品

### 2. 業務分類コード（activityCode）の自動生成
4桁のコード形式: `[業務種別][詳細分類][00]`

#### コード体系
| 業務種別 | プレフィックス | 詳細分類 | サブタブ |
|---------|-------------|---------|---------|
| 計画 | P | P=計画図, C=検討書, T=見積り | 計画図, 検討書, 見積り |
| 設計 | D | P=計画図, S=詳細図, K=組立図, R=改正図 | 計画図, 詳細図, 組立図, 改正図 |
| 会議 | M | N=内部定例, G=外部定例, J=プロ進行, O=その他 | 内部定例, 外部定例, プロ進行, その他 |
| その他 | O | T=出張, C=〇対応, M=プロ管理, D=資料, O=その他 | 出張, 〇対応, プロ管理, 資料, その他 |
| 購入品 | P | インデックスベース | 17種類の購入品分類 |

### 3. 状態管理との連携

#### EventContext との統合
```typescript
const { updateEvent: contextUpdateEvent } = useEventContext();
```

#### 状態更新の優先順位
1. **EventContext**: 推奨（イベントIDベース）
2. **Props**: フォールバック（直接更新）

### 4. 選択状態の管理

#### 選択判定ロジック
```typescript
// その他タブの場合
if (selectedProjectSubTab === "その他") {
  isSelected = currentOtherSubTab === subTab;
} else {
  // イベント選択時: activityCodeから判定
  if (selectedEvent?.activityCode) {
    const expectedSubTab = getSubTabFromActivityCode(selectedEvent.activityCode, selectedProjectSubTab);
    isSelected = expectedSubTab === subTab;
  } else {
    // デフォルト選択状態
    const defaults = {
      計画: '計画図',
      設計: '計画図', 
      会議: '内部定例',
      その他: '出張',
      購入品: '設備'
    };
    isSelected = defaults[selectedProjectSubTab] === subTab;
  }
}
```

## 🔧 技術的詳細

### Props インターフェース
```typescript
interface ProjectDetailTabsProps {
  selectedTab: string                    // 現在選択中のメインタブ
  selectedProjectSubTab: string         // 現在選択中のプロジェクトサブタブ
  selectedOtherSubTab: string           // その他タブの詳細選択
  setSelectedOtherSubTab: (tab: string) => void  // その他タブ更新関数
  selectedEvent: TimeGridEvent | null   // 選択中のイベント
  updateEvent: (event: TimeGridEvent) => void    // イベント更新関数
}
```

### 主要な関数

#### getSubTabFromActivityCode()
```typescript
const getSubTabFromActivityCode = (activityCode: string, selectedProjectSubTab: string): string => {
  if (!activityCode || activityCode.length < 3) return "";
  
  const thirdChar = activityCode.charAt(2);
  
  // 各サブタブに応じた判定ロジック
  if (selectedProjectSubTab === "計画") {
    if (thirdChar === "P") return "計画図";
    if (thirdChar === "C") return "検討書";
    if (thirdChar === "T") return "見積り";
  }
  // ... 他のサブタブの判定
}
```

### 副作用（useEffect）
```typescript
useEffect(() => {
  if (selectedEvent?.activityCode && selectedEvent?.selectedProjectSubTab) {
    const expectedSubTab = getSubTabFromActivityCode(selectedEvent.activityCode, selectedEvent.selectedProjectSubTab);
    console.log('activityCode変更による選択状態更新:', {
      activityCode: selectedEvent.activityCode,
      expectedSubTab,
      currentSubTabType: selectedEvent.subTabType
    });
  }
}, [selectedEvent?.activityCode, selectedEvent?.selectedProjectSubTab]);
```

## 📊 データ構造

### SUBTABS 定数
```typescript
export const SUBTABS: Record<string, string[]> = {
  その他: ["出張", "〇対応", "プロ管理", "資料", "その他"],
  計画: ["計画図", "検討書", "見積り"],
  設計: ["計画図", "詳細図", "組立図", "改正図"],
  会議: ["内部定例", "外部定例", "プロ進行", "その他"],
  購入品: ["計画図作成", "仕様書作成準備", "仕様書作成・発行", ...],
  // 間接業務用
  純間接: ["日報入力", "会議", "人事評価", "作業", "その他"],
  目的間接: ["作業", "会議", "その他"],
  控除時間: ["休憩／外出", "組合時間", "その他"],
};
```

### TimeGridEvent 型
```typescript
export type TimeGridEvent = Event & {
  top: number;
  height: number;
  color: string;
  unsaved?: boolean;
  category?: string;
  employeeNumber?: string;
  // タブ状態を保存するプロパティ
  selectedTab?: string;
  selectedProjectSubTab?: string;
  selectedIndirectSubTab?: string;
  selectedIndirectDetailTab?: string;
  selectedOtherSubTab?: string;
}
```

## 🎨 UI/UX 設計

### スタイリング
- **コンテナ**: `flex text-sm border-b px-4 py-2 bg-gray-50`
- **選択状態**: `bg-blue-100 text-blue-800 font-medium rounded`
- **非選択状態**: `text-gray-500 hover:text-gray-700`

### レスポンシブ対応
- `whitespace-nowrap`: タブテキストの折り返し防止
- `mr-2`: タブ間の適切な間隔

## 🔄 イベントハンドリング

### タブクリック時の処理フロー
1. **サブタブ判定**: クリックされたタブに基づいて3桁目の文字を決定
2. **コード生成**: 4桁の業務分類コードを生成
3. **フィールドリセット**: 関連フィールドをクリア
4. **イベント更新**: EventContextまたはProps経由でイベントを更新
5. **状態同期**: その他タブの場合はselectedOtherSubTabも更新

## 🐛 デバッグ機能

### ログ出力
```typescript
console.log('ProjectDetailTabs - 選択状態デバッグ:', {
  subTab,
  selectedProjectSubTab,
  selectedEventId: selectedEvent?.id,
  selectedEventActivityCode: selectedEvent?.activityCode,
  isSelected
});
```

## 🔗 依存関係

### 内部依存
- `../../../types`: TimeGridEvent型定義
- `../../../constants`: SUBTABS定数
- `../../../context/EventContext`: 状態管理

### 外部依存
- React Hooks (useEffect)
- TypeScript型システム

## 🚀 使用例

### 基本的な使用
```typescript
<ProjectDetailTabs
  selectedTab="project"
  selectedProjectSubTab="計画"
  selectedOtherSubTab="出張"
  setSelectedOtherSubTab={setSelectedOtherSubTab}
  selectedEvent={selectedEvent}
  updateEvent={updateEvent}
/>
```

### 条件付きレンダリング
```typescript
{selectedTab === "project" && 
 (selectedProjectSubTab === "計画" || selectedProjectSubTab === "設計" || 
  selectedProjectSubTab === "会議" || selectedProjectSubTab === "その他" || 
  selectedProjectSubTab === "購入品") && (
  <ProjectDetailTabs
    // ... props
  />
)}
```

## 📝 注意事項

1. **EventContext優先**: 可能な限りEventContextのupdateEventを使用
2. **activityCode整合性**: コード生成時は既存のactivityCodeとの整合性を確認
3. **状態同期**: イベント選択時は選択状態を適切に同期
4. **エラーハンドリング**: activityCodeの形式チェックを実装済み

## 🔮 将来の拡張

- 新しい業務分類の追加
- より詳細なコード体系の実装
- 国際化対応
- アクセシビリティの向上
