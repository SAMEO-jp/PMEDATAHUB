# 📋 パレット管理システム テーブル仕様書

## 🎯 概要

このドキュメントは、`src/app/app_project/[project_id]/konpo/make_palet`ディレクトリ内の3つのテーブルコンポーネントの詳細仕様を説明します。

## 📊 テーブル構成

### 1. **PartsTableWithFilter.tsx** - 部品表テーブル
### 2. **PaletteTable.tsx** - パレット詳細テーブル  
### 3. **PaletteList.tsx** - パレット一覧テーブル

---

## 🏗️ データベース構造

### 📋 テーブル関係図

```
BOM_ZUMEN (図面マスタ)
    ↓ ZUMEN_ID
BOM_BUHIN (部品マスタ)
    ↓ BUHIN_ID
KONPO_PALET (パレット部品)
    ↓ KONPO_PALET_ID
KONPO_PALET_MASTER (パレットマスター)
```

### 🔗 外部キー関係

- `KONPO_PALET.BUHIN_ID` → `BOM_BUHIN.BUHIN_ID`
- `BOM_BUHIN.ZUMEN_ID` → `BOM_ZUMEN.ZUMEN_ID`
- `KONPO_PALET.KONPO_PALET_ID` → `KONPO_PALET_MASTER.KONPO_PALET_ID`

---

## 📋 1. PartsTableWithFilter.tsx - 部品表テーブル

### 🎯 機能概要
- プロジェクト内の部品一覧を表示
- フィルタリング機能（図面番号、部品名、製造元）
- パレット登録対象の部品選択
- 検索・ソート機能

### 📊 テーブル構造

| カラム名 | データ型 | どこのデータ | 説明 | 表示形式 |
|:---------|:---------|:-------------|:-----|:---------|
| **選択** | `boolean` | UI生成 | チェックボックス | `チェックボックス` |
| **図面番号** | `string` | `BOM_BUHIN.ZUMEN_ID` | 部品の図面番号 | `モノスペース` |
| **部品番号** | `string` | `BOM_BUHIN.BUHIN_ID` | 部品の識別番号 | `モノスペース` |
| **品名** | `string` | `BOM_BUHIN.BUHIN_NAME` | 部品の名称 | テキスト |
| **製造元** | `string` | `BOM_BUHIN.BUHIN_MANUFACTURER` | 部品の製造元 | テキスト |
| **数量** | `number` | `BOM_BUHIN.BUHIN_QUANTITY` | 部品の数量 | `中央揃え` |
| **重量(kg)** | `number` | `BOM_BUHIN.BUHIN_PART_TANNI_WEIGHT` | 部品重量 | `右揃え` |
| **備考** | `string` | `BOM_BUHIN.BUHIN_REMARKS` | 部品の備考 | テキスト |
| **登録状況** | `string` | 計算値 | パレット登録状況 | `バッジ` |

### 🔧 主要機能

```typescript
// フィルタリング機能
interface FilterState {
  zumenId: string;
  buhinName: string;
  manufacturer: string;
  registrationStatus: 'all' | 'registered' | 'unregistered';
}

// 検索機能
const handleSearch = (query: string) => {
  // 図面番号、部品名、製造元で検索
}

// パレット登録
const handleRegisterToPalette = (selectedParts: Part[]) => {
  // 選択された部品をパレットに登録
}
```

### 🎨 表示色分け

- **未登録部品**: 白色背景
- **登録済み部品**: 薄い緑色背景 (`bg-green-50`)
- **選択中**: 青色背景 (`bg-blue-100`)

---

## 📋 2. PaletteTable.tsx - パレット詳細テーブル

### 🎯 機能概要
- 選択されたパレットの詳細情報を表示
- パレット内の部品一覧と数量管理
- 部品の追加・削除・数量変更
- パレット情報の編集

### 📊 テーブル構造

| カラム名 | データ型 | どこのデータ | 説明 | 表示形式 |
|:---------|:---------|:-------------|:-----|:---------|
| **図面番号** | `string` | `BOM_BUHIN.ZUMEN_ID` | 部品の図面番号 | `モノスペース` |
| **部品番号** | `string` | `KONPO_PALET.BUHIN_ID` | 部品の識別番号 | `モノスペース` |
| **品名** | `string` | `BOM_BUHIN.BUHIN_NAME` | 部品の名称 | テキスト |
| **製造元** | `string` | `BOM_BUHIN.BUHIN_MANUFACTURER` | 部品の製造元 | テキスト |
| **パレット内数量** | `number` | `KONPO_PALET.PALET_BUHIN_QUANTITY` | パレット内の部品数量 | `数値入力` |
| **重量(kg)** | `number` | `BOM_BUHIN.BUHIN_PART_TANNI_WEIGHT` | 部品重量 | `右揃え` |
| **小計重量** | `number` | 計算値 | 数量×重量 | `右揃え` |
| **-** | `-` | UI生成 | 削除ボタン | 🗑️ アイコンボタン |

### 🔧 主要機能

```typescript
// 数量変更
const handleQuantityChange = (buhinId: string, quantity: number) => {
  // パレット内の部品数量を更新
}

// 部品削除
const handleRemovePart = (buhinId: string) => {
  // パレットから部品を削除
}

// 重量計算
const calculateTotalWeight = () => {
  // パレット内の全重量を計算
}
```

### 🎨 表示色分け

- **通常行**: 白色背景
- **編集行**: 黄色背景 (`bg-yellow-50`)
- **削除予定**: 赤色背景 (`bg-red-50`)

---

## 📋 3. PaletteList.tsx - パレット一覧テーブル

### 🎯 機能概要
- プロジェクト内の全パレット一覧を表示
- パレットの集約情報（部品種類数、合計数量）
- パレットの編集・削除
- 詳細表示の展開・折りたたみ

### 📊 テーブル構造

#### 📋 テーブル構造（集約行）

| カラム名 | データ型 | どこのデータ | 説明 | 表示形式 |
|:---------|:---------|:-------------|:-----|:---------|
| **展開/折りたたみ** | `boolean` | UI生成 | 展開状態 | `矢印アイコン` |
| **パレット名** | `string` | `KONPO_PALET_MASTER.PALET_DISPLAY_NAME` | パレットの表示名 | **太字テキスト** |
| **パレットID** | `string` | `KONPO_PALET.KONPO_PALET_ID` | パレットの識別ID | `モノスペース` |
| **部品種類** | `number` | 集約計算 | 含まれる部品の種類数 | `バッジ` |
| **合計数量** | `number` | 集約計算 | 全部品の合計数量 | `バッジ` |
| **パレット個数** | `number` | `KONPO_PALET_MASTER.PALET_QUANTITY` | 作成したパレットの個数 | `バッジ` |
| **作成日時** | `string` | `KONPO_PALET.created_at` | パレット作成日時 | `フォーマット済み日時` |
| **更新日時** | `string` | `KONPO_PALET.updated_at` | パレット更新日時 | `フォーマット済み日時` |
| **-** | `-` | UI生成 | 編集・削除ボタン | ✏️/🗑️ アイコンボタン |

#### 📋 テーブル構造（詳細行）

| カラム名 | データ型 | どこのデータ | 説明 | 表示形式 |
|:---------|:---------|:-------------|:-----|:---------|
| **-** | `-` | UI生成 | インデント | `空白` |
| **図面番号** | `string` | `BOM_BUHIN.ZUMEN_ID` | 部品の図面番号 | テキスト |
| **部品番号** | `string` | `KONPO_PALET.BUHIN_ID` | 部品の識別番号 | テキスト |
| **品名** | `string` | `BOM_BUHIN.BUHIN_NAME` | 部品の名称 | テキスト |
| **製造元** | `string` | `BOM_BUHIN.BUHIN_MANUFACTURER` | 部品の製造元 | テキスト |
| **数量** | `number` | `KONPO_PALET.PALET_BUHIN_QUANTITY` | パレット内の部品数量 | `中央揃え` |
| **重量(kg)** | `number` | `BOM_BUHIN.BUHIN_PART_TANNI_WEIGHT` | 部品重量 | `右揃え` |

### 🔧 主要機能

```typescript
// データ集約処理
const aggregatePaletteData = (paletteItems: PaletListItem[]) => {
  return {
    totalParts: paletteItems.length,
    totalQuantity: paletteItems.reduce((sum, item) => sum + item.bom_part_ko, 0),
    totalWeight: paletteItems.reduce((sum, item) => {
      return sum + (item.BUHIN_PART_TANNI_WEIGHT || 0) * item.bom_part_ko;
    }, 0)
  };
};

// 展開/折りたたみ
const handleToggleExpand = (paletteId: string) => {
  // パレット詳細の表示/非表示を切り替え
};

// パレット削除
const handleDeletePalette = async (paletteId: string) => {
  // パレットと関連データを削除
};
```

### 🎨 表示色分け

- **集約行**: 薄いグレー背景 (`bg-gray-50`)
- **詳細行**: 白色背景
- **展開中**: 青色背景 (`bg-blue-50`)

---

## 🔄 テーブル間の連携

### 📊 データフロー

```
PartsTableWithFilter → PaletteTable → PaletteList
     ↓                      ↓              ↓
  部品選択             パレット編集      パレット一覧
     ↓                      ↓              ↓
  API呼び出し         データ更新       集約表示
```

### 🔗 状態管理

```typescript
// Zustandストア
interface PaletTableState {
  paletData: KonpoPalet[];
  paletDataLoading: boolean;
  paletDataError: string | null;
  paletList: PaletListItem[];
  paletListLoading: boolean;
  paletListError: string | null;
  registrationLoading: boolean;
  registrationError: string | null;
}
```

---

## 🛠️ 技術仕様

### 📦 使用技術

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **状態管理**: Zustand
- **UIライブラリ**: shadcn/ui
- **データベース**: SQLite
- **API**: Next.js API Routes

### 🔧 主要コンポーネント

```typescript
// テーブルコンポーネント
- PartsTableWithFilter: 部品選択テーブル
- PaletteTable: パレット詳細テーブル
- PaletteList: パレット一覧テーブル

// 共通コンポーネント
- ResizableTable: リサイズ可能テーブル
- TableSettings: テーブル設定
- LayoutChips: レイアウト切り替え
```

### 📊 データベースクエリ

```sql
-- パレットリスト取得
SELECT 
  kp.ROWID,
  kp.KONPO_PALET_ID as KONPO_PALT_ID,
  kp.BUHIN_ID as bom_buhin_id,
  kp.PALET_BUHIN_QUANTITY as bom_part_ko,
  kp.created_at,
  kp.updated_at,
  bb.ZUMEN_ID as zumen_id,
  bb.BUHIN_NAME,
  bb.BUHIN_MANUFACTURER,
  bb.BUHIN_PART_TANNI_WEIGHT,
  bb.BUHIN_QUANTITY,
  bb.BUHIN_REMARKS,
  bz.Zumen_Name as ZUMEN_NAME,
  bz.Zumen_Kind as ZUMEN_KIND,
  bz.project_ID as PROJECT_ID,
  kpl.PALET_DISPLAY_NAME as palet_display_name
FROM KONPO_PALET kp 
LEFT JOIN BOM_BUHIN bb ON kp.BUHIN_ID = bb.BUHIN_ID
LEFT JOIN BOM_ZUMEN bz ON bb.ZUMEN_ID = bz.Zumen_ID
LEFT JOIN KONPO_PALET_MASTER kpl ON kp.KONPO_PALET_ID = kpl.KONPO_PALET_ID
WHERE bz.project_ID = ?
ORDER BY kp.created_at DESC
```

---

## 📝 注意事項

### ⚠️ 重要な修正点

1. **図面IDの取得方法**：
   - ❌ 誤：`KONPO_PALET_MASTER.zumen_id`（存在しない）
   - ✅ 正：`KONPO_PALET.BUHIN_ID` → `BOM_BUHIN.ZUMEN_ID` → `BOM_ZUMEN.Zumen_ID`

2. **データベース構造**：
   - `KONPO_PALET`テーブル：部品単位のパレット情報
   - `KONPO_PALET_MASTER`テーブル：パレットマスター情報
   - 図面IDは`BOM_BUHIN`テーブル経由で取得

3. **型定義の統一**：
   - 重複型定義を削除
   - `src/types/konpo_palet.ts`に統一
   - 後方互換性のための別名フィールドを維持

### 🔄 今後の改善点

- [ ] パフォーマンス最適化（大量データ対応）
- [ ] リアルタイム更新機能
- [ ] エクスポート機能（CSV、Excel）
- [ ] バッチ処理機能
- [ ] アクセス権限管理 