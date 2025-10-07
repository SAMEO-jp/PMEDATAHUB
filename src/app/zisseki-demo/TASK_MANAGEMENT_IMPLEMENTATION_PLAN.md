# zisseki-demo タスク管理機能実装計画書

## 📋 プロジェクト概要

**プロジェクト名**: zisseki-demo専用タスク管理システム  
**実装方針**: 案4（タスクテンプレート型）+ プロジェクト情報動的追加  
**目標**: Notion風のタスクドラッグ&ドロップ機能の実現

---

## 🎯 実装方針の決定

### 選択したアプローチ: **案4（タスクテンプレート型）+ プロジェクト情報動的追加**

#### 📊 理由
1. **シンプルな設計**: タスクテンプレートは再利用可能
2. **プロジェクト情報の柔軟性**: ドロップ時に動的にプロジェクト情報を追加
3. **既存システム活用**: イベント作成処理をそのまま使用
4. **拡張性**: 将来的にプロジェクト情報をテンプレートに追加可能

---

## 🏗️ システム設計

### データベース設計

```sql
-- タスクテンプレートテーブル
CREATE TABLE task_templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  priority TEXT CHECK(priority IN ('high', 'medium', 'low')),
  estimated_time INTEGER, -- 分単位
  default_activity_code TEXT NOT NULL,
  user_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

-- テンプレート使用履歴テーブル（オプション）
CREATE TABLE template_usage_history (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  project_id TEXT, -- ドロップ時に追加されたプロジェクト情報
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (template_id) REFERENCES task_templates(id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (project_id) REFERENCES PROJECT(PROJECT_ID)
);
```

### 型定義

```typescript
// タスクテンプレート型
interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number; // 分単位
  defaultActivityCode: string;
  userId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// テンプレート使用履歴型
interface TemplateUsageHistory {
  id: string;
  templateId: string;
  eventId: string;
  projectId?: string;
  usedAt: string;
}
```

---

## 🚀 実装フェーズ

### Phase 1: 基盤構築（1-2週間）

#### 1.1 データベース構築
- [ ] `task_templates`テーブル作成
- [ ] `template_usage_history`テーブル作成（オプション）
- [ ] インデックス設定
- [ ] 初期データ投入（サンプルテンプレート）

#### 1.2 レイアウト構築
- [ ] `src/app/zisseki-demo/layout.tsx`作成
- [ ] TaskSidebarコンポーネント作成
- [ ] 3カラムレイアウト実装
- [ ] レスポンシブ対応

#### 1.3 ドラッグ&ドロップ基盤
- [ ] TimeSlotsにドロップハンドラー追加
- [ ] TaskSidebarにドラッグ機能追加
- [ ] 基本的なドラッグ&ドロップ動作確認

### Phase 2: タスクテンプレート機能（2-3週間）

#### 2.1 CRUD操作実装
- [ ] タスクテンプレート作成API
- [ ] タスクテンプレート取得API
- [ ] タスクテンプレート更新API
- [ ] タスクテンプレート削除API

#### 2.2 UI実装
- [ ] タスクテンプレート一覧表示
- [ ] タスクテンプレート作成フォーム
- [ ] タスクテンプレート編集フォーム
- [ ] カテゴリフィルター機能

#### 2.3 ドラッグ&ドロップ統合
- [ ] テンプレート→イベント変換処理
- [ ] プロジェクト情報動的追加
- [ ] 使用履歴記録（オプション）

### Phase 3: 高度な機能（3-4週間）

#### 3.1 プロジェクト連携
- [ ] プロジェクト別テンプレート表示
- [ ] プロジェクト情報の自動設定
- [ ] プロジェクト進捗統計

#### 3.2 ユーザビリティ向上
- [ ] テンプレート検索機能
- [ ] よく使用するテンプレート表示
- [ ] テンプレート使用統計

#### 3.3 管理機能
- [ ] テンプレートの有効/無効切り替え
- [ ] テンプレートの複製機能
- [ ] テンプレートのインポート/エクスポート

---

## 🎨 UI/UX設計

### レイアウト構成

```
[3カラムレイアウト]
┌─────────────┬───────────────────────┬─────────────┐
│ Task        │      TimeGrid          │ Event       │
│ Sidebar     │      (メイン)           │ Detail      │
│ (テンプレート) │      (ドロップ先)       │ Sidebar     │
│ ドラッグ元   │                       │ (詳細編集)  │
└─────────────┴───────────────────────┴─────────────┘
```

### TaskSidebar設計

```typescript
<TaskSidebar>
  {/* ヘッダー */}
  <TaskSidebarHeader>
    <h2>タスクテンプレート</h2>
    <AddTemplateButton />
  </TaskSidebarHeader>

  {/* フィルター */}
  <TaskFilter>
    <CategoryFilter />
    <PriorityFilter />
    <SearchBox />
  </TaskFilter>

  {/* テンプレート一覧 */}
  <TaskTemplateList>
    {templates.map(template => (
      <TaskTemplateItem
        key={template.id}
        template={template}
        draggable={true}
        onDragStart={handleDragStart}
      />
    ))}
  </TaskTemplateList>
</TaskSidebar>
```

---

## 🔧 技術実装詳細

### ドラッグ&ドロップ処理

```typescript
// ドラッグ開始処理
const handleDragStart = (e: React.DragEvent, template: TaskTemplate) => {
  e.dataTransfer.setData('application/json', JSON.stringify({
    type: 'task-template',
    template: template
  }));
  e.dataTransfer.effectAllowed = 'copy';
};

// ドロップ処理
const handleDrop = (e: React.DragEvent, day: Date, hour: number, minute: number) => {
  e.preventDefault();
  
  try {
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.type === 'task-template') {
      const template = data.template as TaskTemplate;
      
      // プロジェクト情報を動的に追加（現在のプロジェクトコンテキストから取得）
      const currentProjectId = getCurrentProjectId();
      
      // テンプレートからイベントを作成
      const newEvent = createEventFromTemplate(template, day, hour, currentProjectId);
      
      // イベントを作成
      createEvent(newEvent);
      
      // 使用履歴を記録（オプション）
      recordTemplateUsage(template.id, newEvent.id, currentProjectId);
    }
  } catch (error) {
    console.error('テンプレートドロップ処理エラー:', error);
  }
};
```

### テンプレート→イベント変換

```typescript
const createEventFromTemplate = (
  template: TaskTemplate,
  day: Date,
  hour: number,
  projectId?: string
): TimeGridEvent => {
  // 既存のcreateNewEventを活用
  const baseEvent = createNewEvent(day, hour, 0, template.userId);
  
  // テンプレート情報を適用
  const newEvent: TimeGridEvent = {
    ...baseEvent,
    title: template.title,
    description: template.description || '',
    project: projectId || '',
    activityCode: template.defaultActivityCode,
    // 見積時間を終了時間に反映
    endDateTime: calculateEndTime(day, hour, template.estimatedTime)
  };
  
  return newEvent;
};

const calculateEndTime = (day: Date, hour: number, estimatedMinutes: number): string => {
  const totalMinutes = hour * 60 + estimatedMinutes;
  const endHour = Math.floor(totalMinutes / 60);
  const endMinute = totalMinutes % 60;
  
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), endHour, endMinute).toISOString();
};
```

---

## 📊 サンプルデータ

### 初期テンプレートデータ

```typescript
const initialTemplates: TaskTemplate[] = [
  {
    id: 'template-001',
    title: 'プロジェクト企画書作成',
    description: '新規プロジェクトの企画書を作成する',
    category: '企画',
    priority: 'high',
    estimatedTime: 120, // 2時間
    defaultActivityCode: 'PP01',
    userId: 'user123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-002',
    title: '顧客ミーティング',
    description: '月次進捗報告のための顧客ミーティング',
    category: '会議',
    priority: 'high',
    estimatedTime: 60, // 1時間
    defaultActivityCode: 'MN01',
    userId: 'user123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-003',
    title: '資料作成',
    description: 'プレゼン資料の作成',
    category: '作成',
    priority: 'medium',
    estimatedTime: 90, // 1.5時間
    defaultActivityCode: 'DP01',
    userId: 'user123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-004',
    title: 'システムテスト',
    description: '新機能のテスト実行',
    category: '開発',
    priority: 'medium',
    estimatedTime: 180, // 3時間
    defaultActivityCode: 'DV01',
    userId: 'user123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'template-005',
    title: 'メール返信',
    description: '各種メールへの返信',
    category: '事務',
    priority: 'low',
    estimatedTime: 30, // 30分
    defaultActivityCode: 'OT01',
    userId: 'user123',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
```

---

## 🎯 成功指標

### 機能指標
- [ ] タスクテンプレートの作成・編集・削除が可能
- [ ] ドラッグ&ドロップでテンプレートからイベント作成が可能
- [ ] プロジェクト情報が動的に追加される
- [ ] カテゴリフィルターが正常に動作する

### パフォーマンス指標
- [ ] テンプレート一覧の読み込み時間 < 500ms
- [ ] ドラッグ&ドロップ応答時間 < 100ms
- [ ] イベント作成時間 < 200ms

### ユーザビリティ指標
- [ ] テンプレート作成フォームの入力時間 < 2分
- [ ] ドラッグ&ドロップ操作の成功率 > 95%
- [ ] ユーザーフィードバックスコア > 4.0/5.0

---

## 🔄 将来の拡張計画

### Phase 4: 高度な機能（4-6週間）
- [ ] テンプレートのバージョン管理
- [ ] テンプレートの共有機能
- [ ] テンプレートの自動生成（AI連携）
- [ ] テンプレート使用パターン分析

### Phase 5: 統合機能（6-8週間）
- [ ] プロジェクト管理システムとの完全統合
- [ ] チーム協業機能
- [ ] 進捗レポート機能
- [ ] モバイルアプリ対応

---

## 📝 実装メモ

### 技術的な考慮事項
1. **既存システムとの整合性**: イベント作成処理をそのまま活用
2. **パフォーマンス**: テンプレート一覧の仮想化を検討
3. **セキュリティ**: ユーザー別テンプレートアクセス制御
4. **データ整合性**: テンプレート削除時の使用履歴管理

### 開発環境
- **フロントエンド**: React + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: SQLite
- **状態管理**: Zustand（既存）

---

## 📅 実装スケジュール

| 週 | フェーズ | 主要タスク | 完了目標 |
|----|----------|------------|----------|
| 1-2 | Phase 1 | 基盤構築 | レイアウト・ドラッグ&ドロップ基盤 |
| 3-4 | Phase 2 | テンプレート機能 | CRUD・UI・統合 |
| 5-6 | Phase 3 | 高度な機能 | プロジェクト連携・統計 |
| 7-8 | Phase 4 | 拡張機能 | バージョン管理・共有 |

---

**作成日**: 2025-01-27  
**作成者**: AI Assistant  
**バージョン**: 1.0  
**ステータス**: 計画段階
