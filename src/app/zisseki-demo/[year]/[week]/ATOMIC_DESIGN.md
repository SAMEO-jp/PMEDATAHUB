# `src/app/zisseki-demo/[year]/[week]` Atomic Design分解メモ

実績デモの週ページをAtomic Designの粒度で整理した際の責務分担と主な構成要素をまとめたメモです。既存コンポーネントをどの階層に位置付けるかを示し、再構成時の指針とします。

## Page（ページ）
- `page.tsx`  
  年・週パラメータを受け取り、`DatabaseProvider` / `EventProvider` で状態を束ねたうえでテンプレートへコンテンツを引き渡す。ヘッダーのアクション（週移動・Outlook連携・保存）を組み立てるページレベルの調停者。

## Templates（テンプレート）
- `components/layout/ZissekiPageWrapper.tsx`  
  ZustandストアやContextの初期化、ローディング／エラー状態の分岐を担う外枠。ページ共通のレイアウト・ガードを提供。
- `components/layout/ZissekiMainContent.tsx`  
  タイムグリッドとサイドバーを2カラムで配置するメインテンプレート。保存ハンドラやContextのデータ同期など、下位のオーガニズムに渡すための橋渡しを行う。
- （補足）`components/layout/MainContent.tsx`  
  旧構成のテンプレート。現行では未使用だが、責務は `ZissekiMainContent` と同等。

## Organisms（オーガニズム）
### スケジュール領域
- `components/weekgrid/TimeGrid.tsx`  
  週次の時間割・イベントを描画する主要エリア。ヘッダー、勤務時間入力、タイムスロット、イベント表示の各モジュール（後述の分子）を組み合わせ、ドラッグ＆ドロップやスクロール制御まで包括。

### サイドバー領域
- `components/sidebar/ZissekiSidebar.tsx`  
  選択イベントの編集フォーム全体を統括。タブ切り替え、ローカル編集状態、Context更新を仲介し、下位分子（基本情報フォームやコードエディタ）を束ねる。
- `components/sidebar/components/SidebarActiveCodeEditor.tsx`  
  業務コードの階層選択UIをまとめた複合セクション。サブタブ群・詳細分類・時間入力など複数の分子を一括で管理するため、オーガニズムとして扱う。
- `components/sidebar/components/SidebarBasic.tsx` / `SidebarEmpty.tsx`  
  イベント有無に応じたフォーム表示の土台。`SidebarBasic` はタイトル・説明など基本情報の入力ブロック、`SidebarEmpty` は未選択時のプレースホルダー表示。

### サポート領域
- `components/ui/ErrorBoundary.tsx`  
  エラー／ローディング表示を切り替えるラッパー。テンプレートと組み合わせて全体のフェイルセーフを担うオーガニズム相当。

## Molecules（分子）
### タイムグリッド系
- `components/weekgrid/components/TimeGridHeader.tsx`  
  曜日と日付を横並びで表示するヘッダー行。
- `components/weekgrid/components/WorkTimeSection.tsx`  
  各日の勤務時間帯を示す行。将来的な入力フィールド拡張の土台。
- `components/weekgrid/components/TimeLabels.tsx`  
  左端の時間ラベル列。`timeSlots` を元に30分刻み表示。
- `components/weekgrid/components/TimeSlots.tsx`  
  日別の時間セル生成と勤務帯背景、ドロップ領域を描画。イベント描画の器として `EventDisplay` を内包。
- `components/weekgrid/components/EventDisplay.tsx`  
  個別イベントカードの表示・ドラッグ・リサイズ・複製・削除を扱う複合要素。

### サイドバー系
- `components/sidebar/components/SidebarHeader.tsx`  
  サイドバー上部のタイトルとタブ切り替えを表示。
- `components/sidebar/components/ProgressSelect.tsx`  
  進捗状況のセレクター。選択肢表示と値更新を担当。
- `components/sidebar/components/ColorPicker.tsx`  
  イベントカラーのプリセット／カスタム選択ポップアップ。
- `components/sidebar/components/ProjectSelect.tsx` / `ProjectSetsubiSelect.tsx` / `ProjectKounyuSelect.tsx` / `SetsubiSelect.tsx` / `KounyuSelect.tsx`  
  プロジェクトと装備・購入品の紐付けを行うセレクター群。`CustomDropdown` を土台に候補リストを組み立てる。
- `components/sidebar/components/CustomDropdown.tsx`  
  検索付きドロップダウンUI。複数のセレクター分子の共通土台。
- `components/sidebar/ui/MainSubTabs.tsx` / `DetailSubTabs.tsx` / `DetailClassifications.tsx`  
  業務コード編集の階層タブ群。`SubTabGroup` や `PurchaseDropdown` と組み合わせて多段の分類選択を提供。
- `components/sidebar/ui/SubTabGroup.tsx`  
  サブタブの集合を表示するグルーピングコンポーネント。
- `components/sidebar/ui/PurchaseDropdown.tsx`  
  購入品コードの専用プルダウン。
- `components/sidebar/ui/Instructions.tsx` / `components/sidebar/ui/DetailSubTabs.tsx` ほか  
  ガイドテキストやタブ表示など、Sidebar内部で繰り返し使う複合UI。

### 共通UI系
- `components/ui/ErrorDisplay.tsx`  
  トースト風のエラーメッセージ表示。クリア操作と装飾を含む。

## Atoms（原子）
- `components/sidebar/ui/TitleField.tsx` / `DescriptionField.tsx`  
  テキスト入力／テキストエリアのシンプルなフォーム要素。
- `components/sidebar/ui/ActivityCodeField.tsx`  
  業務コード値を表示するラベル＋ボックス。
- `components/sidebar/ui/SubTabButton.tsx`  
  サブタブ用のボタン。`SubTabGroup` などの分子の最小単位。
- `components/sidebar/ui/DeleteButton.tsx`  
  イベント削除トリガーのボタン。
- `components/sidebar/ui/TimeInputField.tsx`  
  時刻入力と検証、適用ボタンまで備えるが、単一機能（時間編集）に特化したため原子として管理し、他分子から再利用する想定。
- `components/sidebar/ui/TabSelector.tsx`  
  プロジェクト／間接業務を切り替える2択ボタン。Sidebarヘッダーの核となる選択子。
- `components/ui/LoadingSpinner.tsx`  
  ローディング時のスピナー表示。

## Foundation / Utility（土台・非視覚要素）
- Context: `context/EventContext`, `context/DatabaseContext`  
  イベント／DBデータの取得・更新を一元管理。
- Store: `store/zissekiStore.ts`  
  マスターデータやローカルキャッシュの管理。
- Hooks: `hooks/reducer/useWorkTimeReducer.ts`, `hooks/useProjectAssignments.ts`, `components/weekgrid/hooks/*`  
  状態遷移、日付計算、勤務時間ロジックなどを分離。
- Utils: `utils/weekUtils.ts`, `utils/eventUtils.ts`, `utils/eventOverlapUtils.ts`, `components/weekgrid/utils.ts`, `components/sidebar/utils/businessCodeUtils.ts`  
  週ナビゲーション、イベント生成、表示位置計算、業務コード辞書などのドメインロジック。
- スタイル: `styles.css`  
  サイドバーやグリッドに必要なユーティリティクラスを定義。

## 再構成時のヒント
- ページ > テンプレート > オーガニズム > 分子 > 原子の順に責務を整理することで、Outlook同期や自動保存などの副作用はページ／テンプレート層に閉じ込め、UI層は状態を受け取って表示・入力に専念させる。 
- Sidebar内の複雑な業務コード編集は `SidebarActiveCodeEditor` をオーガニズムとして切り出し、その内部でタブ群（分子）とボタン／フィールド（原子）を組み立てる構造にすることで拡張しやすくなる。
- タイムグリッドは `TimeGrid`（オーガニズム）を境界に、時間ラベルやスロット描画を分子、個々のセル／ボタンを原子として整理すると、仮想スクロールや表示改善を段階的に導入できる。
