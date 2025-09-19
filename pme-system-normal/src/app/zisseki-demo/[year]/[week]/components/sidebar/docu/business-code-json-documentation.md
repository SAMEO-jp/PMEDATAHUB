# 業務コード設定ファイル（JSON）活用ドキュメント

## 📋 概要

このJSONファイルを使用することで、現在の400行以上のswitch文を数行のコードに置き換え、業務コードとUI状態の双方向変換を効率的に行うことができます。

## 🏗️ データ構造

### 4段階の階層構造
1. **mainTab**: `project` | `indirect`
2. **subTab**: `計画` | `設計` | `会議` | `購入品` | `その他` | `純間接` | `目的間接` | `控除`
3. **detailTab**: `計画図` | `検討書` | `見積り` | `詳細図` | `組立図` など
4. **classification**: `作図及び作図準備` | `作図指示` | `検図` など（最終的な業務分類）

### JSONの3つの主要セクション

```json
{
  "structure": {
    // タブ構造定義（UI表示用）
    "project": {
      "計画": ["計画図", "検討書", "見積り"]
    }
  },
  "codes": {
    // 3段階パス → 業務コード配列のマッピング
    "project.計画.計画図": [
      {"code": "PP01", "name": "作図及び作図準備"}
    ]
  },
  "reverseMap": {
    // 業務コード → 4段階パスのマッピング
    "PP01": "project.計画.計画図.作図及び作図準備"
  }
}
```

## 🔄 基本的な変換機能

### 1. 業務コード → UI状態（パース機能）

```typescript
// 現在の400行のswitch文を置き換え
function parseActivityCode(code: string) {
  const path = config.reverseMap[code];
  if (!path) return null;
  
  const [mainTab, subTab, detailTab, classification] = path.split('.');
  return { mainTab, subTab, detailTab, classification };
}

// 使用例
const result = parseActivityCode('PP01');
// → { mainTab: 'project', subTab: '計画', detailTab: '計画図', classification: '作図及び作図準備' }
```

### 2. UI状態 → 業務コード一覧（逆算機能）

```typescript
// 特定の階層での利用可能な業務コード一覧を取得
function getCodesForPath(mainTab: string, subTab: string, detailTab: string) {
  const path = `${mainTab}.${subTab}.${detailTab}`;
  return config.codes[path] || [];
}

// 使用例
const codes = getCodesForPath('project', '計画', '計画図');
// → [
//   {code: "PP01", name: "作図及び作図準備"},
//   {code: "PP02", name: "作図指示"},
//   {code: "PP03", name: "検図"}
// ]
```

### 3. デフォルトコード生成

```typescript
// UI状態からデフォルトの業務コードを生成
function getDefaultCode(mainTab: string, subTab: string, detailTab: string) {
  const codes = getCodesForPath(mainTab, subTab, detailTab);
  return codes.length > 0 ? codes[0].code : null;
}

// 使用例
const defaultCode = getDefaultCode('project', '計画', '計画図');
// → "PP01"
```

## 🎨 UI表示・レンダリング機能

### 1. タブ構造の動的生成

```typescript
// メインタブの一覧を取得
function getMainTabs() {
  return Object.keys(config.structure); // ['project', 'indirect']
}

// サブタブの一覧を取得
function getSubTabs(mainTab: string) {
  return Object.keys(config.structure[mainTab] || {}); // ['計画', '設計', '会議', ...]
}

// 詳細タブの一覧を取得
function getDetailTabs(mainTab: string, subTab: string) {
  return config.structure[mainTab]?.[subTab] || []; // ['計画図', '検討書', '見積り']
}
```

### 2. 業務分類ボタンの動的生成

```typescript
// 業務分類ボタンの情報を取得（現在のDetailClassificationsコンポーネントで使用）
function getClassificationButtons(mainTab: string, subTab: string, detailTab: string) {
  const codes = getCodesForPath(mainTab, subTab, detailTab);
  return codes.map(item => ({
    code: item.code,
    name: item.name,
    onClick: () => selectCode(item.code)
  }));
}

// 使用例（Reactコンポーネント内）
const buttons = getClassificationButtons('project', '計画', '計画図');
return (
  <div>
    {buttons.map(button => (
      <button key={button.code} onClick={button.onClick}>
        {button.name}
      </button>
    ))}
  </div>
);
```

### 3. 選択状態の管理

```typescript
// 現在選択されている業務コードかチェック
function isCodeSelected(currentCode: string, targetCode: string) {
  return currentCode === targetCode;
}

// 階層が一致しているかチェック
function isPathMatching(code1: string, code2: string, level: number) {
  const path1 = config.reverseMap[code1]?.split('.').slice(0, level);
  const path2 = config.reverseMap[code2]?.split('.').slice(0, level);
  return JSON.stringify(path1) === JSON.stringify(path2);
}
```

## 🔍 検索・フィルタリング機能

### 1. 業務コード検索

```typescript
// 業務コードの部分一致検索
function searchCodes(query: string) {
  return Object.entries(config.reverseMap)
    .filter(([code, path]) => 
      code.toLowerCase().includes(query.toLowerCase()) ||
      path.toLowerCase().includes(query.toLowerCase())
    )
    .map(([code, path]) => ({ code, path }));
}

// 使用例
const results = searchCodes('PP');
// → [
//   {code: "PP01", path: "project.計画.計画図.作図及び作図準備"},
//   {code: "PP02", path: "project.計画.計画図.作図指示"},
//   ...
// ]
```

### 2. 階層別フィルタリング

```typescript
// 特定の階層でフィルタリング
function filterCodesByLevel(mainTab?: string, subTab?: string, detailTab?: string) {
  return Object.entries(config.reverseMap).filter(([code, path]) => {
    const [pathMain, pathSub, pathDetail] = path.split('.');
    return (!mainTab || pathMain === mainTab) &&
           (!subTab || pathSub === subTab) &&
           (!detailTab || pathDetail === detailTab);
  });
}

// 使用例
const projectCodes = filterCodesByLevel('project');
const planningCodes = filterCodesByLevel('project', '計画');
```

## 📊 統計・分析機能

### 1. 業務コード統計

```typescript
// 各カテゴリの業務コード数を集計
function getCodeStatistics() {
  const stats = {
    total: 0,
    byMainTab: {},
    bySubTab: {},
    byDetailTab: {}
  };

  Object.values(config.reverseMap).forEach(path => {
    const [mainTab, subTab, detailTab] = path.split('.');
    stats.total++;
    stats.byMainTab[mainTab] = (stats.byMainTab[mainTab] || 0) + 1;
    stats.bySubTab[subTab] = (stats.bySubTab[subTab] || 0) + 1;
    stats.byDetailTab[detailTab] = (stats.byDetailTab[detailTab] || 0) + 1;
  });

  return stats;
}

// 使用例
const stats = getCodeStatistics();
// → {
//   total: 193,
//   byMainTab: { project: 164, indirect: 29 },
//   bySubTab: { 計画: 16, 設計: 44, 会議: 36, ... }
// }
```

### 2. 利用頻度分析（将来の拡張）

```typescript
// 業務コードの利用頻度を追跡（実際の使用データと組み合わせ）
function analyzeCodeUsage(usageData: Record<string, number>) {
  return Object.entries(config.reverseMap).map(([code, path]) => ({
    code,
    path,
    usage: usageData[code] || 0,
    category: path.split('.')[1] // サブタブ
  })).sort((a, b) => b.usage - a.usage);
}
```

## 🔧 バリデーション機能

### 1. データ整合性チェック

```typescript
// JSON設定ファイルの整合性をチェック
function validateConfig() {
  const errors = [];

  // reverseMapの全コードがcodesに存在するかチェック
  Object.entries(config.reverseMap).forEach(([code, path]) => {
    const [mainTab, subTab, detailTab] = path.split('.');
    const codesPath = `${mainTab}.${subTab}.${detailTab}`;
    const codes = config.codes[codesPath];
    
    if (!codes || !codes.find(item => item.code === code)) {
      errors.push(`Code ${code} in reverseMap not found in codes[${codesPath}]`);
    }
  });

  return errors;
}
```

### 2. 業務コード有効性チェック

```typescript
// 業務コードが有効かチェック
function isValidCode(code: string): boolean {
  return code in config.reverseMap;
}

// 階層パスが有効かチェック
function isValidPath(mainTab: string, subTab: string, detailTab: string): boolean {
  return `${mainTab}.${subTab}.${detailTab}` in config.codes;
}
```

## 🎯 実装例：SidebarActiveCodeEditorの簡素化

### Before（400行のswitch文）
```typescript
const parseActivityCode = (activityCode: string) => {
  if (!activityCode || activityCode.length < 3) {
    return { mainTab: 'project', subTab: '計画', ... };
  }
  const firstChar = activityCode.charAt(0);
  const secondChar = activityCode.charAt(1);
  // ... 400行のswitch文 ...
};
```

### After（JSON活用版）
```typescript
const parseActivityCode = (activityCode: string) => {
  const path = businessCodeConfig.reverseMap[activityCode];
  if (!path) return { mainTab: 'project', subTab: '計画', detailTab: '計画図', classification: '作図及び作図準備' };
  
  const [mainTab, subTab, detailTab, classification] = path.split('.');
  return { mainTab, subTab, detailTab, classification };
};
```

## 📈 期待される効果

### 1. 開発効率の向上
- **400行 → 数行**: 複雑なロジックの大幅な簡素化
- **保守性向上**: 新しい業務コード追加時はJSONファイルのみ編集
- **テスト容易性**: データ駆動のテストが可能

### 2. UI機能の拡張
- **動的タブ生成**: 設定変更でUIが自動更新
- **検索機能**: 業務コードの部分一致検索
- **統計表示**: カテゴリ別の業務コード数表示

### 3. 将来の拡張性
- **多言語対応**: 業務コード名の翻訳
- **権限制御**: ユーザーごとの利用可能コード制限
- **履歴分析**: 業務コードの利用頻度分析

## 🚀 導入手順

1. **JSONファイルの配置**: `constants/businessCodeConfig.json`
2. **ユーティリティ関数の作成**: `utils/businessCodeUtils.ts`
3. **既存コンポーネントの置き換え**: `SidebarActiveCodeEditor.tsx`
4. **動作確認とテスト**: 全ての業務コードで正常動作を確認

これらの機能により、現在の複雑なコードが劇的に簡潔になり、保守性と拡張性が大幅に向上します。