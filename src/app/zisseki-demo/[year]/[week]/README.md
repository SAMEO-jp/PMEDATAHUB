# デモデータ永続化機能

このディレクトリでは、localStorageを使用してデモデータを永続化する機能を実装しています。

## 機能概要

### 1. データの永続化
- **イベントデータ**: スケジュールイベントの情報
- **勤務時間データ**: 日別の勤務開始・終了時間
- **従業員データ**: 従業員の基本情報
- **プロジェクトデータ**: プロジェクトの基本情報
- **ユーザーデータ**: 現在のユーザー情報
- **UI状態**: 選択されたタブやイベントなどのUI状態

### 2. データ管理機能
- **自動保存**: データの変更時に自動的にlocalStorageに保存
- **自動読み込み**: ページ読み込み時にlocalStorageからデータを復元
- **データリセット**: デモデータを初期状態に戻す
- **エクスポート/インポート**: データのバックアップと復元

## ファイル構成

```
hooks/
├── useDemoData.ts      # デモデータの管理（localStorage対応）
└── useDemoUI.ts        # UI状態の管理（localStorage対応）

utils/
└── demoStorage.ts      # localStorage操作のユーティリティ

components/
└── DemoDataManager.tsx # データ管理UIコンポーネント

types/
└── index.ts           # 型定義（既存の型を拡張）
```

## 使用方法

### 基本的な使用例

```typescript
import { useDemoData } from './hooks/useDemoData';
import { useDemoUI } from './hooks/useDemoUI';

const MyComponent = () => {
  const { 
    events, 
    workTimes, 
    employees, 
    projects, 
    currentUser,
    updateEvents,
    resetDemoData 
  } = useDemoData(2024, 1);

  const { 
    selectedTab, 
    setSelectedTab,
    selectedEvent,
    setSelectedEvent 
  } = useDemoUI();

  // データの更新（自動的にlocalStorageに保存される）
  const handleAddEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    updateEvents(updatedEvents);
  };

  return (
    <div>
      {/* コンポーネントの内容 */}
    </div>
  );
};
```

### データ管理UIの使用例

```typescript
import { DemoDataManager } from './components/DemoDataManager';
import { demoStorage } from './utils/demoStorage';

const DataManagementPage = () => {
  const handleReset = () => {
    // データリセット後の処理
    window.location.reload();
  };

  return (
    <div>
      <DemoDataManager 
        onReset={handleReset}
        lastUpdated={demoStorage.getLastUpdated()}
      />
    </div>
  );
};
```

## localStorageのキー

以下のキーでデータが保存されます：

- `zisseki_demo_events`: イベントデータ
- `zisseki_demo_work_times`: 勤務時間データ
- `zisseki_demo_employees`: 従業員データ
- `zisseki_demo_projects`: プロジェクトデータ
- `zisseki_demo_current_user`: 現在のユーザー
- `zisseki_demo_ui_state`: UI状態
- `zisseki_demo_last_updated`: 最終更新日時

## エラーハンドリング

- localStorageの容量制限や権限エラーに対して適切なエラーハンドリングを実装
- データの読み込みに失敗した場合は、デフォルトのデモデータを生成
- エラーはコンソールにログ出力され、ユーザーには適切なメッセージを表示

## 注意事項

1. **ブラウザ依存**: localStorageはブラウザ固有のため、異なるブラウザ間ではデータが共有されません
2. **容量制限**: localStorageには容量制限があるため、大量のデータを保存する場合は注意が必要です
3. **プライベートモード**: プライベートブラウジングモードでは、セッション終了時にデータが削除されます
4. **データ形式**: 保存されるデータはJSON形式で、型安全性を保つために適切な型定義を使用しています

## 今後の拡張予定

- IndexedDBへの移行（大量データ対応）
- データの暗号化
- クラウド同期機能
- データのバージョン管理 