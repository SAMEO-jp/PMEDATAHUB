# 高速スライド生成システム

## 概要

GEMINIで利用していたGoogle Apps Scriptのプレゼンテーション生成機能を、Next.jsプロジェクトで高速に利用できるようにするシステムです。

## システム構成

### フォルダ構造
```
src/app/slide/
├── README.md (このファイル)
├── page.tsx (メインリンクページ)
├── slidepage/ (スライドページ格納フォルダ)
│   ├── [任意のフォルダ名]/
│   │   ├── page.tsx (スライド表示ページ)
│   │   └── slideData.json (スライドデータ)
│   └── ...
└── components/ (スライド関連コンポーネント)
    ├── SlideGenerator.tsx
    ├── SlideViewer.tsx
    └── SlideEditor.tsx
```

## 機能要件

### 1. メインリンクページ (`page.tsx`)
- 作成済みのスライドページ一覧表示
- 新規スライド作成機能
- 各スライドページへのリンク

### 2. スライド生成機能
- テキスト入力からslideDataを自動生成
- Google Apps ScriptのテンプレートをReactコンポーネントに変換
- リアルタイムプレビュー機能

### 3. スライド表示機能
- Google Apps Scriptのレイアウトを忠実に再現
- 各スライドタイプに対応（title, content, compare, process, timeline, diagram, cards, table, progress, quote, kpi, faqなど）
- レスポンシブデザイン対応

### 4. ファイル管理機能
- slidepageフォルダ下に任意の名前でフォルダ作成
- 各フォルダにpage.tsxとslideData.jsonを配置
- フォルダの一覧・作成・削除機能

## 技術仕様

### 使用技術
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Components

### データ構造
slideDataの形式はGoogle Apps Scriptと同一：
```typescript
const slideData = [
  {
    type: 'title',
    title: 'プレゼンテーションタイトル',
    date: '2025.01.01',
    notes: '発表者ノート'
  },
  // ... その他のスライド
]
```

### 対応スライドタイプ
- `title`: 表紙
- `section`: 章扉
- `content`: 1カラム/2カラム本文 + 画像
- `compare`: 左右対比
- `process`: 手順・工程
- `timeline`: 時系列
- `diagram`: レーン図
- `cards`: シンプルカード
- `headerCards`: ヘッダー付きカード
- `table`: 表
- `progress`: 進捗バー
- `quote`: 引用
- `kpi`: KPIカード
- `bulletCards`: 箇条書きカード
- `faq`: よくある質問
- `statsCompare`: 数値比較
- `closing`: 結び

## 開発ステップ

1. **要件ドキュメント作成** ✅ (完了)
2. **プロジェクト構造設計** 🔄 (進行中)
3. **メインリンクページ作成**
4. **slideData生成機能実装**
5. **スライド表示機能実装**
6. **ファイル管理機能実装**

## 特徴

### 高速性
- ブラウザ上で直接生成・表示
- Google Apps Scriptの実行時間を待たない
- リアルタイムプレビュー

### 柔軟性
- 任意のフォルダ名でスライドページ作成可能
- 各スライドページが独立して動作
- 再利用可能なコンポーネント構造

### 忠実性
- Google Apps Scriptのテンプレートを完全再現
- 同じデザインシステムを使用
- 同じslideData形式に対応

## 使い方

### 1. メインリンクページにアクセス
```
/slide
```
- 作成済みのスライドページ一覧を表示
- 新規スライド作成機能を提供

### 2. スライドジェネレーターを使用
```
/slide/generator
```
- テキストを入力してslideDataを自動生成
- リアルタイムプレビュー機能
- 生成したスライドをJSONとしてエクスポート

### 3. 新規スライドページの作成
1. メインリンクページから「新規スライド作成」をクリック
2. フォルダ名、タイトル、説明を入力
3. 自動的にslidepage/[フォルダ名]/にページが作成される

### 4. サンプルプレゼンテーションの閲覧
```
/slide/slidepage/sample-presentation
```
- 完成したスライドページの例
- キーボード（← →）でスライド移動可能

### 5. 独自スライドページの作成
1. ジェネレーターでslideDataを生成
2. 保存先フォルダ名を指定
3. 自動的にページが作成され、公開される

## 今後の拡張予定

- スライドデータのインポート/エクスポート機能
- 複数スライドの一括編集
- テーマカスタマイズ機能
- プレゼンテーション形式での出力
- コラボレーション機能
