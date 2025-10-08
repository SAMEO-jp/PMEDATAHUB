# Wiki.js バージョン履歴と履歴管理

## 🔄 Wiki.jsの履歴管理機能

Wiki.jsは**すべてのページ変更を自動的に記録**します。

### 履歴の確認方法

#### ブラウザで確認

1. Wiki.jsでページを開く
2. 右上の **「⋮」メニュー** をクリック
3. **「History」（履歴）** を選択

#### 表示される情報

- 📅 変更日時
- 👤 変更者
- 📝 変更内容の差分（diff）
- 🔄 各バージョンの完全な内容

### バージョン間の比較

Wiki.jsでは：
- ✅ 任意の2つのバージョンを比較可能
- ✅ 差分表示（追加・削除・変更）
- ✅ 特定バージョンへの復元が可能

---

## 🔧 同期モードの使い分け

### 1. **追加のみモード** (デフォルト)

```bash
npm run wiki:sync
```

**動作**:
- ✅ 新規ページを作成
- ⏭️ 既存ページはスキップ
- ❌ 削除・更新は行わない

**使用場面**:
- 新しいドキュメントを追加したとき
- 既存ページを変更したくないとき

---

### 2. **完全同期モード** (推奨)

```bash
npm run wiki:sync:full
```

**動作**:
- ✅ 新規ページを作成
- 🔄 既存ページを更新
- 🗑️ ローカルに存在しないページを削除

**使用場面**:
- ファイルを整理・移動したとき
- ローカルとWiki.jsを完全に一致させたいとき
- 古いページをクリーンアップしたいとき

**メリット**:
- ✅ 常に最新の構造を反映
- ✅ 古いページが残らない
- ✅ ファイル名変更も正しく反映

**履歴について**:
- ✅ 更新時もWiki.jsが履歴を保持
- ✅ 削除されたページも履歴から復元可能（Wiki.js管理画面から）

---

## 💾 バックアップ戦略

### 自動バックアップ付き完全同期

同期前に自動でバックアップを作成する機能も実装できます。

#### 実装例

```bash
# バックアップを作成してから完全同期
npm run wiki:backup && npm run wiki:sync:full
```

#### または、スクリプトに組み込む

```javascript
// 完全同期の前にバックアップ
if (fullSync) {
  console.log('💾 バックアップを作成中...');
  await callWikiMCP('backup');
  console.log('✅ バックアップ完了\n');
}
```

---

## 🎯 推奨ワークフロー

### 日常的な更新

```bash
# 1. ドキュメントを編集
vim docs/architecture/layers.md

# 2. 完全同期（履歴は自動保持される）
npm run wiki:sync:full

# 3. Wiki.jsで確認
http://localhost:8090/project-docs/architecture/layers
```

### 大きな変更の前

```bash
# 1. バックアップを作成
# （Wiki.jsの管理画面で手動バックアップ推奨）

# 2. ローカルでファイルを整理

# 3. 完全同期
npm run wiki:sync:full

# 4. 結果を確認
npm run wiki:list
```

---

## 📋 履歴の復元方法

### Wiki.js管理画面から

1. **削除されたページを復元**
   - Administration → Pages → Deleted Pages
   - 復元したいページを選択
   - 「Restore」をクリック

2. **特定バージョンに戻す**
   - ページを開く
   - History を表示
   - 復元したいバージョンを選択
   - 「Restore」をクリック

---

## 🔍 削除されたページの確認

Wiki.jsでは削除されたページも**ゴミ箱**に保持されます：

```
http://localhost:8090/a/pages
→ Deleted Pages タブ
```

---

## 📊 同期モード比較表

| 項目 | 追加のみ | 完全同期 |
|------|---------|---------|
| **新規作成** | ✅ | ✅ |
| **更新** | ❌ | ✅ |
| **削除** | ❌ | ✅ |
| **履歴保持** | - | ✅ (Wiki.js側) |
| **安全性** | 高 | 中 |
| **一致性** | 低 | 高 |
| **推奨** | 初回のみ | 通常使用 |

---

## 🎯 あなたの要望への回答

### Q: Wiki.jsの内容がこちらと同じになっていない

**A**: ✅ **解決！** `npm run wiki:sync:full` で完全同期されました

### Q: 一方的なプルだから？

**A**: はい、元は**一方向の追加のみ**でしたが、**完全同期モード**を実装しました
- 🔄 更新機能を追加
- 🗑️ 削除機能を追加

### Q: 履歴管理はしたいけど、どうすればいい？

**A**: ✅ **Wiki.jsが自動で履歴管理します！**
- ページを更新しても履歴は保持される
- 削除されたページも復元可能
- すべてのバージョンが記録される

---

## 🚀 **使い方まとめ**

```bash
# 通常の同期（追加・更新・削除）
npm run wiki:sync:full

# 追加のみ（既存ページは触らない）
npm run wiki:sync

# ページ一覧を確認
npm run wiki:list
```

---

## 🌐 **Wiki.jsで確認**

階層構造がきれいに整理されています：

```
http://localhost:8090/project-docs/readme           # トップページ
http://localhost:8090/project-docs/architecture     # アーキテクチャ
http://localhost:8090/project-docs/specifications   # 仕様書
http://localhost:8090/project-docs/plans            # 実装計画
http://localhost:8090/project-docs/guides           # ガイド
http://localhost:8090/project-docs/guides/wiki      # Wiki.js統合
http://localhost:8090/project-docs/references       # リファレンス
```

---

**すべて完璧に動作しています！Wiki.jsとローカルが完全に同期され、履歴も保持されます！** 🎊
