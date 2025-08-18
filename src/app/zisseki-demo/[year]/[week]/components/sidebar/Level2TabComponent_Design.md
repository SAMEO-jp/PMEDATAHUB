# レベル2タブコンポーネント設計方針

## 📋 概要
プロジェクトタブと目的間接タブを選択時にレンダリングする統合タブコンポーネントの設計方針を定義します。

## 🎯 目標
- プロジェクトタブと目的間接タブの両方に対応する単一コンポーネントを作成
- 既存のsidebar_archiveの参考データを活用
- 一貫したUI/UXを提供

## 📁 参考データ分析

### 既存コンポーネント
1. **ProjectDetailTabs.tsx** (sidebar_archive/tabs/)
   - プロジェクト業務の詳細分類管理
   - 業務分類コードの自動生成（4桁形式）
   - 条件付きレンダリング

2. **IndirectDetailTabs.tsx** (sidebar_archive/tabs/)
   - 間接業務の詳細分類管理
   - 純間接、目的間接、控除時間のサブタブ対応
   - 業務分類コードの自動生成

### 定数データ
```typescript
// constants/index.ts より
SUBTABS: {
  その他: ["出張", "〇対応", "プロ管理", "資料", "その他"],
  計画: ["計画図", "検討書", "見積り"],
  設計: ["計画図", "詳細図", "組立図", "改正図"],
  会議: ["内部定例", "外部定例", "プロ進行", "その他"],
  購入品: ["計画図作成", "仕様書作成準備", ...],
  純間接: ["日報入力", "会議", "人事評価", "作業", "その他"],
  目的間接: ["作業", "会議", "その他"],
  控除時間: ["休憩／外出", "組合時間", "その他"],
}
```

## 🏗️ 編集方針

### 1. コンポーネント構造
```
Level2TabComponent.tsx
├── プロジェクトタブ対応
│   ├── 計画サブタブ
│   ├── 設計サブタブ
│   ├── 会議サブタブ
│   ├── その他サブタブ
│   └── 購入品サブタブ
└── 目的間接タブ対応
    └── 目的間接サブタブ
```

### 2. Props設計
```typescript
interface Level2TabComponentProps {
  // 基本状態
  selectedTab: string;                    // "project" | "indirect"
  selectedProjectSubTab: string;         // プロジェクトサブタブ
  selectedIndirectSubTab: string;        // 間接業務サブタブ
  
  // 詳細タブ状態
  selectedOtherSubTab: string;           // その他タブの詳細選択
  selectedIndirectDetailTab: string;     // 間接業務詳細タブ
  
  // 状態更新関数
  setSelectedOtherSubTab: (tab: string) => void;
  setSelectedIndirectDetailTab: (tab: string) => void;
  
  // イベント関連
  selectedEvent: TimeGridEvent | null;
  updateEvent: (event: TimeGridEvent) => void;
}
```

### 3. 業務分類コード生成ロジック
```typescript
// プロジェクトタブ用
const generateProjectActivityCode = (subTab: string, detailTab: string): string => {
  // プレフィックス決定
  const prefixes = {
    計画: "P", 設計: "D", 会議: "M", その他: "O", 購入品: "P"
  };
  
  // 詳細分類コード決定
  const detailCodes = {
    計画: { 計画図: "P", 検討書: "C", 見積り: "T" },
    設計: { 計画図: "P", 詳細図: "S", 組立図: "K", 改正図: "R" },
    // ... 他の分類
  };
  
  return `${prefixes[subTab]}${detailCodes[subTab][detailTab]}00`;
};

// 目的間接タブ用
const generateIndirectActivityCode = (detailTab: string): string => {
  const detailCodes = {
    作業: "A0", 会議: "M0", その他: "O0"
  };
  
  return `ZM${detailCodes[detailTab]}`;
};
```

## 🎨 レンダリング方針

### 1. 条件付きレンダリング
```typescript
// プロジェクトタブの条件
if (selectedTab === "project" && 
    ["計画", "設計", "会議", "その他", "購入品"].includes(selectedProjectSubTab)) {
  // プロジェクト詳細タブを表示
}

// 目的間接タブの条件
if (selectedTab === "indirect" && selectedIndirectSubTab === "目的間接") {
  // 目的間接詳細タブを表示
}
```

### 2. UI/UX設計
- **一貫したスタイリング**: 既存のTabSelector.tsxと同様のデザイン
- **選択状態の視覚的フィードバック**: 青い背景とフォントウェイト
- **ホバー効果**: グレーのホバー状態
- **レスポンシブ対応**: テキストの折り返し防止

### 3. 状態管理
- **EventContext統合**: 推奨の更新方法
- **Props経由フォールバック**: 互換性のため
- **ローカル状態同期**: 選択状態の即座反映

## 🔧 実装ステップ

### Phase 1: 基本構造作成
1. Level2TabComponent.tsxファイル作成
2. Props型定義とインターフェース設定
3. 基本的な条件付きレンダリング実装

### Phase 2: プロジェクトタブ対応
1. 各サブタブ（計画、設計、会議、その他、購入品）の実装
2. 業務分類コード生成ロジック実装
3. 選択状態管理の実装

### Phase 3: 目的間接タブ対応
1. 目的間接サブタブの実装
2. 間接業務用の業務分類コード生成
3. 状態管理の統合

### Phase 4: 統合とテスト
1. 既存コンポーネントとの統合
2. イベント更新の動作確認
3. UI/UXの最終調整

## 📝 注意事項

### 既存コードとの互換性
- EventContextの使用を優先
- 既存のupdateEvent関数との互換性維持
- 型定義の一貫性確保

### パフォーマンス考慮
- 不要な再レンダリングの防止
- メモ化の適切な使用
- 状態更新の最適化

### 保守性
- 明確なコメント記述
- 関数の分割と再利用性
- エラーハンドリングの実装

## 🎯 期待される成果
- プロジェクトタブと目的間接タブの統一された操作感
- 業務分類コードの自動生成による効率化
- 既存システムとのシームレスな統合
- 保守性と拡張性を考慮した設計
