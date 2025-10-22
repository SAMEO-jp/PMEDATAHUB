# ヘッダー設定システム 説明書

## 概要

このシステムは、ルートパスに基づいてヘッダーの表示内容を自動的に切り替える機能を提供します。ページごとに異なるヘッダー設定（タイトル、アクションボタン、検索機能など）を簡単に管理できます。

## システムの特徴

- **自動切り替え**: ページ遷移時に自動的にヘッダー設定が適用される
- **チラチラしない**: ページ遷移時に一度だけヘッダーが更新される
- **深い階層対応**: 動的ルート（`[project_id]`など）にも対応
- **保存ボタン対応**: ページ固有の保存関数を注入可能
- **型安全**: TypeScriptによる型安全性を確保

## ファイル構成

```
src/components/layout/header/
├── config/
│   └── headerConfigs.ts          # ヘッダー設定マップ
├── store/
│   └── headerStore.ts            # Zustandストア
├── components/                   # ヘッダーコンポーネント
├── types.ts                      # 型定義
└── README.md                     # このファイル
```

## 基本的な使い方

### 1. 新しいページのヘッダー設定を追加

`src/components/layout/header/config/headerConfigs.ts` の `HEADER_CONFIGS` オブジェクトに新しい設定を追加します。

```typescript
export const HEADER_CONFIGS: HeaderConfigMap = {
  // 新しいページの設定を追加
  '/your-new-page': {
    title: '新しいページ',
    subtitle: 'ページの説明',
    actions: [
      {
        id: 'save',
        label: '保存',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: true,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  },
  
  // 動的ルートの例
  '/your-page/[id]': {
    title: '詳細ページ',
    subtitle: '', // 動的に設定される
    actions: [
      {
        id: 'edit',
        label: '編集',
        onClick: () => {},
        variant: 'primary'
      }
    ],
    showActions: true,
    showSearch: false,
    showBreadcrumb: true,
    showUserInfo: true,
    showNotifications: false
  }
};
```

### 2. 動的パラメータの処理

URLパラメータを抽出してヘッダーに反映したい場合は、`customizeHeaderConfig` 関数を拡張します。

```typescript
// headerConfigs.ts の customizeHeaderConfig 関数に追加
export function customizeHeaderConfig(pathname: string, baseConfig: HeaderConfig): HeaderConfig {
  // 既存の処理...
  
  // 新しいページの動的パラメータ処理
  const yourPageMatch = pathname.match(/\/your-page\/(\d+)/);
  if (yourPageMatch) {
    const [, id] = yourPageMatch;
    return {
      ...baseConfig,
      subtitle: `ID: ${id} の詳細`
    };
  }
  
  return baseConfig;
}
```

### 3. ページ固有の保存関数を注入

ページで保存ボタンなどの特別な処理が必要な場合は、`HeaderContent` コンポーネントに `onSave` プロパティを渡します。

```typescript
// ページコンポーネント内
import { HeaderContent } from '@/components/layout/HeaderContent';

export default function YourPage() {
  const handleSave = async () => {
    // 保存処理
    console.log('保存しました');
  };

  return (
    <div>
      {/* ページ内容 */}
      <HeaderContent onSave={handleSave} />
    </div>
  );
}
```

## 設定項目の詳細

### HeaderConfig のプロパティ

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `title` | `string` | ヘッダーのタイトル |
| `subtitle` | `string` | ヘッダーのサブタイトル |
| `actions` | `HeaderAction[]` | アクションボタンの配列 |
| `showActions` | `boolean` | アクションボタンの表示/非表示 |
| `showSearch` | `boolean` | 検索機能の表示/非表示 |
| `showBreadcrumb` | `boolean` | パンくずリストの表示/非表示 |
| `showUserInfo` | `boolean` | ユーザー情報の表示/非表示 |
| `showNotifications` | `boolean` | 通知機能の表示/非表示 |

### HeaderAction のプロパティ

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | アクションの一意ID |
| `label` | `string` | ボタンのラベル |
| `onClick` | `() => void` | クリック時の処理 |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | ボタンの見た目 |

## パスマッチングの優先順位

1. **完全一致**: `/exact/path` が `/exact/path` と完全に一致
2. **動的ルート**: `/path/[id]` が `/path/123` とマッチ
3. **部分一致**: `/path/sub` が `/path/sub/deep` の親としてマッチ
4. **デフォルト**: 上記に該当しない場合は `default` 設定を使用

## 実装例

### 実績デモページの例

```typescript
'/zisseki-demo/[year]/[week]': {
  title: '実績管理',
  subtitle: '', // 動的に設定される
  actions: [
    {
      id: 'prev-week',
      label: '← 前週',
      onClick: () => {},
      variant: 'outline'
    },
    {
      id: 'next-week',
      label: '次週 →',
      onClick: () => {},
      variant: 'outline'
    },
    {
      id: 'current-week',
      label: '今週',
      onClick: () => {},
      variant: 'primary'
    },
    {
      id: 'save',
      label: '保存',
      onClick: () => {},
      variant: 'primary'
    }
  ],
  showActions: true,
  showSearch: false,
  showBreadcrumb: false,
  showUserInfo: true,
  showNotifications: false
}
```

### プロジェクト管理ページの例

```typescript
'/app_project/[project_id]/manage/member': {
  title: 'メンバー管理',
  subtitle: 'プロジェクトメンバーの管理',
  actions: [
    {
      id: 'add-member',
      label: 'メンバー追加',
      onClick: () => {},
      variant: 'primary'
    },
    {
      id: 'export-members',
      label: 'エクスポート',
      onClick: () => {},
      variant: 'outline'
    }
  ],
  showActions: true,
  showSearch: true,
  showBreadcrumb: true,
  showUserInfo: true,
  showNotifications: false
}
```

## トラブルシューティング

### Q: ヘッダーが更新されない

A: 以下を確認してください：
1. `HEADER_CONFIGS` に正しいパスが設定されているか
2. パスの優先順位が正しいか（より具体的なパスが先に定義されているか）
3. 動的ルートのパターンが正しいか

### Q: 保存ボタンが動作しない

A: 以下を確認してください：
1. アクションの `id` が `'save'` になっているか
2. ページコンポーネントで `onSave` プロパティを渡しているか
3. `handleSave` 関数が正しく実装されているか

### Q: 動的パラメータが反映されない

A: 以下を確認してください：
1. `customizeHeaderConfig` 関数にパターンマッチングを追加しているか
2. 正規表現のパターンが正しいか
3. パラメータの抽出が正しく行われているか

## 拡張方法

### 新しいアクションタイプを追加

```typescript
// カスタムアクションの処理
const handleActionClick = async (action: HeaderAction) => {
  if (action.id === 'custom-action' && onCustomAction) {
    onCustomAction(action.id);
    return;
  }
  // 通常の処理...
};
```

### 新しい表示オプションを追加

```typescript
// HeaderConfig に新しいプロパティを追加
interface HeaderConfig {
  // 既存のプロパティ...
  showCustomComponent?: boolean;
  customComponent?: React.ReactNode;
}
```

## 注意事項

1. **パスの順序**: より具体的なパスを先に定義してください
2. **動的ルート**: `[param]` の形式で定義してください
3. **型安全性**: TypeScriptの型定義を必ず更新してください
4. **パフォーマンス**: 大量の設定がある場合は、パスマッチングの最適化を検討してください

## 更新履歴

- 2024-12-19: 初版作成
- ルートベースのヘッダー設定システムを実装
- 実績デモページの設定を統合
- プロジェクト管理ページの設定を追加
