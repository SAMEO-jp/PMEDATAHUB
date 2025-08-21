# Zisseki Demo アーキテクチャ図 - 簡略版

## 📊 コンポーネント階層図

```mermaid
graph TB
    %% メインページ
    ZissekiPage[ZissekiPage] --> EventProvider[EventProvider]
    EventProvider --> ZissekiPageContent[ZissekiPageContent]
    
    %% 状態管理
    ZissekiPageContent --> ZissekiStore[useZissekiStore]
    ZissekiPageContent --> EventContext[useEventContext]
    ZissekiPageContent --> WorkTimeReducer[useWorkTimeReducer]
    
    %% メインコンテンツ
    ZissekiPageContent --> TimeGrid[TimeGrid]
    ZissekiPageContent --> ZissekiSidebar[ZissekiSidebar]
    
    %% TimeGrid の子コンポーネント
    TimeGrid --> EventDisplay[EventDisplay]
    TimeGrid --> TimeSlot[TimeSlot]
    
    %% ZissekiSidebar の子コンポーネント
    ZissekiSidebar --> ConditionalContent[ConditionalContent]
    ZissekiSidebar --> ProjectSubTabs[ProjectSubTabs]
    ZissekiSidebar --> IndirectSubTabs[IndirectSubTabs]
    
    %% ConditionalContent の子コンポーネント
    ConditionalContent --> ProjectCodeDisplay[ProjectCodeDisplay]
    ConditionalContent --> ProjectDetailTabs[ProjectDetailTabs]
    ConditionalContent --> IndirectDetailTabs[IndirectDetailTabs]
    ConditionalContent --> EquipmentSelector[EquipmentSelector]
    ConditionalContent --> PurchaseItemSelector[PurchaseItemSelector]
    ConditionalContent --> EventDetailForm[EventDetailForm]
    
    %% タブコンテンツ
    ConditionalContent --> PlanningTabContent[PlanningTabContent]
    ConditionalContent --> DesignTabContent[DesignTabContent]
    ConditionalContent --> MeetingTabContent[MeetingTabContent]
    ConditionalContent --> OtherTabContent[OtherTabContent]
    
    %% セレクター
    ProjectCodeDisplay --> ProjectSelect[ProjectSelect]
    
    %% スタイル定義
    classDef page fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef context fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef store fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef component fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef selector fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef form fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    
    class ZissekiPage,ZissekiPageContent page
    class EventProvider,EventContext,WorkTimeReducer context
    class ZissekiStore store
    class TimeGrid,ZissekiSidebar,ConditionalContent,EventDisplay,TimeSlot component
    class ProjectSubTabs,IndirectSubTabs,ProjectSelect,EquipmentSelector,PurchaseItemSelector selector
    class EventDetailForm,PlanningTabContent,DesignTabContent,MeetingTabContent,OtherTabContent form
```

## 🔄 データフロー図

```mermaid
flowchart TD
    %% データソース
    ZissekiStore[ZissekiStore<br/>マスターデータ] --> EventContext[EventContext<br/>イベント状態管理]
    WorkTimeReducer[WorkTimeReducer<br/>勤務時間管理] --> EventContext
    
    %% イベント作成フロー
    TimeGrid[TimeGrid<br/>時間グリッド] -->|onTimeSlotClick| EventContext
    EventContext -->|createEvent| TimeGridEvent[TimeGridEvent<br/>イベントデータ]
    
    %% イベント選択フロー
    EventDisplay[EventDisplay<br/>イベント表示] -->|onClick| EventContext
    EventContext -->|setSelectedEvent| ZissekiSidebar[ZissekiSidebar<br/>サイドバー]
    
    %% タブ選択フロー
    ProjectSubTabs[ProjectSubTabs<br/>プロジェクトタブ] -->|handleProjectSubTabChange| EventContext
    EventContext -->|updateActivityCodePrefix| ProjectDetailTabs[ProjectDetailTabs<br/>詳細タブ]
    
    %% 詳細タブ選択フロー
    ProjectDetailTabs -->|onClick| EventContext
    EventContext -->|updateEvent| TimeGridEvent
    
    %% フォーム更新フロー
    EventDetailForm[EventDetailForm<br/>イベント詳細フォーム] -->|updateEvent| EventContext
    EventContext -->|handleUpdateEvent| TimeGridEvent
    
    %% 表示更新フロー
    TimeGridEvent --> EventDisplay
    TimeGridEvent --> ZissekiSidebar
    
    %% スタイル定義
    classDef store fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef context fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef component fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class ZissekiStore,WorkTimeReducer store
    class EventContext context
    class TimeGrid,EventDisplay,ProjectSubTabs,ProjectDetailTabs,EventDetailForm,ZissekiSidebar component
    class TimeGridEvent data
```

## 🏗️ 状態管理アーキテクチャ

```mermaid
graph TB
    %% 状態管理層
    subgraph "状態管理層"
        ZissekiStore[ZissekiStore<br/>Zustand<br/>マスターデータ]
        EventContext[EventContext<br/>React Context<br/>イベント状態]
        WorkTimeReducer[WorkTimeReducer<br/>useReducer<br/>勤務時間]
    end
    
    %% コンポーネント層
    subgraph "コンポーネント層"
        ZissekiPageContent[ZissekiPageContent<br/>メインページ]
        TimeGrid[TimeGrid<br/>時間グリッド]
        ZissekiSidebar[ZissekiSidebar<br/>サイドバー]
    end
    
    %% UI層
    subgraph "UI層"
        EventDisplay[EventDisplay<br/>イベント表示]
        ProjectDetailTabs[ProjectDetailTabs<br/>詳細タブ]
        EventDetailForm[EventDetailForm<br/>詳細フォーム]
    end
    
    %% データフロー
    ZissekiStore --> ZissekiPageContent
    EventContext --> ZissekiPageContent
    WorkTimeReducer --> ZissekiPageContent
    
    ZissekiPageContent --> TimeGrid
    ZissekiPageContent --> ZissekiSidebar
    
    TimeGrid --> EventDisplay
    ZissekiSidebar --> ProjectDetailTabs
    ZissekiSidebar --> EventDetailForm
    
    %% 双方向データフロー
    EventDisplay -.->|イベント選択| EventContext
    ProjectDetailTabs -.->|タブ変更| EventContext
    EventDetailForm -.->|フォーム更新| EventContext
    
    %% スタイル定義
    classDef store fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef context fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef component fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef ui fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    
    class ZissekiStore,EventContext,WorkTimeReducer store
    class ZissekiPageContent,TimeGrid,ZissekiSidebar component
    class EventDisplay,ProjectDetailTabs,EventDetailForm ui
```

## 🎯 コンポーネント責任分担

```mermaid
graph LR
    subgraph "ページレベル"
        ZissekiPage[ZissekiPage<br/>ページラッパー]
        ZissekiPageContent[ZissekiPageContent<br/>メインロジック]
    end
    
    subgraph "レイアウトレベル"
        TimeGrid[TimeGrid<br/>時間グリッド表示]
        ZissekiSidebar[ZissekiSidebar<br/>サイドバー表示]
    end
    
    subgraph "機能レベル"
        EventDisplay[EventDisplay<br/>イベント表示]
        ProjectDetailTabs[ProjectDetailTabs<br/>詳細タブ]
        EventDetailForm[EventDetailForm<br/>詳細フォーム]
    end
    
    subgraph "状態管理レベル"
        EventContext[EventContext<br/>イベント状態]
        ZissekiStore[ZissekiStore<br/>マスターデータ]
        WorkTimeReducer[WorkTimeReducer<br/>勤務時間]
    end
    
    %% 責任分担の関係
    ZissekiPage --> ZissekiPageContent
    ZissekiPageContent --> TimeGrid
    ZissekiPageContent --> ZissekiSidebar
    
    TimeGrid --> EventDisplay
    ZissekiSidebar --> ProjectDetailTabs
    ZissekiSidebar --> EventDetailForm
    
    EventContext --> ZissekiPageContent
    ZissekiStore --> ZissekiPageContent
    WorkTimeReducer --> ZissekiPageContent
    
    %% スタイル定義
    classDef page fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef layout fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef feature fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    classDef state fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    
    class ZissekiPage,ZissekiPageContent page
    class TimeGrid,ZissekiSidebar layout
    class EventDisplay,ProjectDetailTabs,EventDetailForm feature
    class EventContext,ZissekiStore,WorkTimeReducer state
```

## 🔧 技術スタック

```mermaid
graph TB
    subgraph "フレームワーク"
        NextJS[Next.js 14]
        React[React 18]
        TypeScript[TypeScript]
    end
    
    subgraph "状態管理"
        Zustand[Zustand<br/>マスターデータ]
        Context[React Context<br/>イベント状態]
        Reducer[useReducer<br/>勤務時間]
    end
    
    subgraph "UI/UX"
        TailwindCSS[Tailwind CSS]
        HeadlessUI[Headless UI]
    end
    
    subgraph "開発ツール"
        ESLint[ESLint]
        Prettier[Prettier]
        TypeScript[TypeScript]
    end
    
    %% 関係性
    NextJS --> React
    React --> TypeScript
    React --> Context
    React --> Reducer
    Context --> TailwindCSS
    Reducer --> TailwindCSS
    
    %% スタイル定義
    classDef framework fill:#e3f2fd,stroke:#0277bd,stroke-width:2px
    classDef state fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef ui fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef tools fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    
    class NextJS,React,TypeScript framework
    class Zustand,Context,Reducer state
    class TailwindCSS,HeadlessUI ui
    class ESLint,Prettier tools
```

## 📁 ファイル構造（簡略版）

```
zisseki-demo/[year]/[week]/
├── page.tsx                          # メインページ
├── components/
│   ├── sidebar/                      # サイドバー関連
│   │   ├── ZissekiSidebar.tsx       # メインサイドバー
│   │   ├── components/               # サイドバーコンポーネント
│   │   ├── selectors/                # セレクター
│   │   ├── tabs/                     # タブ関連
│   │   └── forms/                    # フォーム
│   ├── weekgrid/                     # 時間グリッド関連
│   │   ├── TimeGrid.tsx              # メイングリッド
│   │   └── components/               # グリッドコンポーネント
│   ├── ErrorDisplay.tsx              # エラー表示
│   └── loadingspinner.tsx            # ローディング
├── context/
│   └── EventContext.tsx              # イベント状態管理
├── store/
│   └── zissekiStore.ts               # Zustandストア
├── hooks/
│   └── reducer/
│       └── useWorkTimeReducer.ts     # 勤務時間管理
├── types/
│   └── index.ts                      # 型定義
└── constants/
    └── index.ts                      # 定数定義
```

## 🎯 主要な設計パターン

### 1. 状態管理の階層化
- **Zustand**: マスターデータ（プロジェクト、従業員、ユーザー）
- **React Context**: イベント状態（選択、作成、更新）
- **useReducer**: 勤務時間管理（開始・終了時間）

### 2. コンポーネントの責任分離
- **ページレベル**: 全体のレイアウトと状態管理の統合
- **レイアウトレベル**: 時間グリッドとサイドバーの表示
- **機能レベル**: 具体的なUI機能（タブ、フォーム、表示）

### 3. データフローの一方向性
- 状態管理 → コンポーネント → UI
- ユーザー操作 → イベントハンドラー → 状態更新

### 4. 条件付きレンダリング
- タブ選択に応じたコンポーネントの表示/非表示
- イベント選択状態に応じたUIの変化

## 🔮 将来の拡張ポイント

1. **新しいタブの追加**: 既存のタブ構造を拡張
2. **状態管理の最適化**: パフォーマンス向上のための状態分割
3. **リアルタイム同期**: WebSocket等によるリアルタイム更新
4. **オフライン対応**: Service Worker等によるオフライン機能
5. **国際化**: i18n対応による多言語化



