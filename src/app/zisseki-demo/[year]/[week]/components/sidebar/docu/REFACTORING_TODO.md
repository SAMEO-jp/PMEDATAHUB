# 🚀 Business Code Configuration リファクタリング計画 TODO

## 📋 プロジェクト概要
既存の`business-code-config.json`（193個の業務コード、3段階階層構造）を使用して、複雑な業務コード管理システムを大幅に簡素化するリファクタリング計画

## 🎯 目標
- **コード削減**: 800行+ → 100行程度（87%削減）
- **保守性向上**: 新しい業務コード追加を数時間 → 数分に短縮
- **可読性向上**: 複雑なswitch文をJSONベースの動的処理に変更

---

## ✅ Phase 1: 基盤整備

### 1.1 既存JSONファイルの活用確認
- [x] `business-code-config.json`の構造確認（完了）
  - [x] 193個の業務コード確認
  - [x] 3段階階層構造（mainTab.subTab.detailTab）確認
  - [x] reverseMap（コード→パス）確認
  - [x] metadata情報確認
- [x] JSONスキーマの検証（完了）
- [x] TypeScript型定義の生成（完了）

### 1.2 ユーティリティ関数の作成
- [x] `components/sidebar/utils/businessCodeUtils.ts`の作成（完了）
  - [x] `parseActivityCode(code: string)`関数の実装
    ```typescript
    // 既存のreverseMapを使用してコードからパスを取得
    export function parseActivityCode(code: string): ParsedActivityCode | null {
      const path = config.reverseMap[code];
      if (!path) return null;
      
      const [mainTab, subTab, detailTab, classification] = path.split('.');
      return { mainTab, subTab, detailTab, classification };
    }
    ```
  - [x] `getCodesForPath(mainTab, subTab, detailTab)`関数の実装
    ```typescript
    // 既存のcodesオブジェクトから該当パスのコード一覧を取得
    export function getCodesForPath(mainTab: string, subTab: string, detailTab: string): BusinessCodeInfo[] {
      const pathKey = `${mainTab}.${subTab}.${detailTab}`;
      return config.codes[pathKey] || [];
    }
    ```
  - [x] `getDetailTabs(mainTab, subTab)`関数の実装
    ```typescript
    // 既存のstructureオブジェクトからdetailTab一覧を取得
    export function getDetailTabs(mainTab: string, subTab: string): string[] {
      return config.structure[mainTab]?.[subTab] || [];
    }
    ```
  - [x] エラーハンドリングの追加
  - [x] 型安全性の確保
  - [x] 追加機能の実装
    - [x] `getMainTabs()` - メインタブ一覧取得
    - [x] `getSubTabs()` - サブタブ一覧取得
    - [x] `isValidBusinessCode()` - コード存在確認
    - [x] `getClassificationName()` - 分類名取得
    - [x] `getCodeFromPath()` - パスからコード逆引き
    - [x] `getAllBusinessCodes()` - 全コード一覧
    - [x] `getBusinessCodeStats()` - 統計情報
    - [x] `validateBusinessCode()` - 検証機能

### 1.3 型定義の更新
- [x] `types/index.ts`の更新（完了）
  - [x] `Event`型の最適化（BusinessCode型の統合）
  - [x] 新しいユーティリティ関数用の型追加
  - [x] レガシープロパティの整理
- [x] `types/businessCode.ts`の作成（完了）
  - [x] 完全な型定義セット
  - [x] 型安全性の確保
  - [x] 既存システムとの統合

---

## 🔄 Phase 2: メインコンポーネントのリファクタリング

### 2.1 SidebarActiveCodeEditor.tsx の大幅簡素化
- [x] 現在の400行+の`parseActivityCode`関数を削除（完了）
- [x] 新しいユーティリティ関数のインポート（完了）
- [x] `useMemo`での状態管理を簡素化（完了）
- [x] エラーハンドリングの改善（完了）
- [x] パフォーマンス最適化（完了）
- [x] 型エラーの修正（完了）

**変更前後の比較:**
```typescript
// 変更前: 400行の複雑なswitch文
// 変更後: 10行程度のシンプルなコード
const currentState = useMemo(() => {
  const activityCode = selectedEvent?.activityCode || '';
  return parseActivityCode(activityCode) || {
    mainTab: 'project',
    subTab: '計画', 
    detailTab: '計画図',
    classification: '作図及び作図準備'
  };
}, [selectedEvent?.activityCode]);
```

### 2.2 UIコンポーネントの動的生成化
- [x] `DetailClassifications.tsx`の更新（完了）
  - [x] ハードコーディングされた条件分岐を削除
  - [x] JSONベースの動的ボタン生成に変更
  - [x] 新しいBusinessCodeInfo型の使用
  ```typescript
  // 既存のcodesオブジェクトを使用して動的にボタンを生成
  const classifications = getCodesForPath(mainTab, subTab, detailTab);
  ```
- [x] `MainSubTabs.tsx`の更新（完了）
  - [x] 静的タブ構造を動的生成に変更
  - [x] getSubTabs関数の使用
  ```typescript
  // 既存のstructureオブジェクトを使用してタブを生成
  const tabs = useMemo(() => {
    return getSubTabs(selectedTab);
  }, [selectedTab]);
  ```
- [x] `DetailSubTabs.tsx`の更新（完了）
  - [x] JSONベースのタブ生成に変更
  - [x] getDetailTabs関数の使用
- [x] `types.ts`の更新（完了）
  - [x] ClassificationItemからBusinessCodeInfoへの型変更
  - [x] 新しい型定義の適用

---

## 🗑️ Phase 3: 不要ファイルの削除

### 3.1 削除対象ファイルの確認
- [x] `constants/activity-codes/code-generators.ts`の削除（完了）
- [x] `constants/activity-codes/project-codes.ts`の削除（完了）
- [x] `constants/activity-codes/indirect-codes.ts`の削除（完了）
- [x] `constants/activity-codes/types.ts`の削除（完了）
- [x] `utils/activityCodeMapping.md`の削除（完了）
- [x] `utils/activityCodeUtils.md`の削除（完了）

### 3.2 インデックスファイルの更新
- [x] `constants/activity-codes/index.ts`の更新（完了）
  - [x] 非推奨警告の追加
  - [x] 新しい使用方法の案内
- [x] `constants/index.ts`の更新（完了）
  - [x] SUBTABS定数の削除
  - [x] 新しい使用方法の案内
- [x] 不要なエクスポートの削除（完了）

---

## 🧪 Phase 4: テスト・検証

### 4.1 単体テスト
- [ ] `businessCodeUtils.ts`の単体テスト作成
- [ ] 193個の業務コード全てでの変換テスト
- [ ] エラーケースのテスト
- [ ] パフォーマンステスト

### 4.2 統合テスト
- [ ] UI表示の正常性確認
- [ ] イベント作成・編集の動作確認
- [ ] サイドバーの動作確認
- [ ] タブ切り替えの動作確認

### 4.3 回帰テスト
- [ ] 既存機能の動作確認
- [ ] データ整合性の確認
- [ ] ユーザー体験の確認

---

## 📊 進捗管理

### 現在の状況
- [x] Phase 1.1: 100% 完了（JSONファイル確認済み）
- [x] Phase 1.2: 100% 完了（businessCodeUtils.ts作成・移動完了）
- [x] Phase 1.3: 100% 完了（型定義更新完了）
- [x] Phase 2.1: 100% 完了（SidebarActiveCodeEditor.tsx大幅簡素化完了）
- [x] Phase 2.2: 100% 完了（UIコンポーネント動的生成化完了）
- [x] Phase 3: 100% 完了（不要ファイル削除完了）
- [ ] Phase 4: 0% 完了

### 完了基準
- [ ] 193個の業務コード全てで正常に変換できる
- [ ] UI表示が正常に動作する
- [ ] イベント作成・編集が正常に動作する
- [ ] パフォーマンスが向上している
- [ ] コードの可読性が向上している

---

## 🚨 リスク管理

### 高リスク項目
- [ ] 既存データとの互換性
- [ ] パフォーマンスへの影響
- [ ] ユーザー体験の変化

### 対策
- [ ] 段階的な移行計画
- [ ] ロールバック手順の準備
- [ ] 十分なテストの実施

---

## 📝 メモ・注意事項

### 既存JSONファイルの活用ポイント
1. **structure**: 3段階階層構造の定義
2. **codes**: 各パスに対応する業務コード一覧
3. **reverseMap**: コードからパスへの逆引き
4. **metadata**: バージョン管理と統計情報

### 実装時の注意点
1. **段階的移行**: 一度に全てを変更せず、段階的に移行
2. **テスト優先**: 各段階で十分なテストを実施
3. **ドキュメント更新**: 変更内容を適切にドキュメント化
4. **チーム共有**: 変更内容をチームメンバーと共有

### 成功指標
- コード行数の87%削減
- 新しい業務コード追加時間の90%短縮
- バグ修正時間の80%短縮
- 開発者満足度の向上

---

## 🔄 次のアクション

1. **Phase 1.2** から開始: `utils/businessCodeUtils.ts`の作成
2. **Phase 1.3** の並行実施: 型定義の更新
3. **Phase 2** への段階的移行: メインコンポーネントのリファクタリング

**開始日**: [日付を記入]
**目標完了日**: [日付を記入]
**担当者**: [担当者名を記入]

---

## 📚 参考資料

- 既存の`business-code-config.json`: 193個の業務コード、3段階階層構造
- 元のリファクタリング計画ドキュメント: `新規 テキスト ドキュメント.md`
