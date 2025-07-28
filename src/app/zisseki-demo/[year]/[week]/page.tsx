"use client"

import { TimeGrid, ZissekiSidebar, LoadingSpinner } from "./components"
import { useTimeGridProps, useSidebarProps, useUrlParams, useZissekiStore } from "./hooks"

/**
 * 実績管理デモページコンポーネント
 * 
 * 機能:
 * - 週単位の実績データ表示
 * - イベントの作成・編集・削除
 * - 勤務時間の記録
 * - 従業員・プロジェクト管理
 * 
 * データフロー:
 * 1. URLパラメータから年・週を取得
 * 2. Zustandストアからデータを取得
 * 3. 各コンポーネントにpropsを生成
 * 4. ローディング状態に応じて表示
 */
export default function ZissekiPage() {
  const { year, week } = useUrlParams();  // URLパラメータから年と週を取得
  const { loading } = useZissekiStore(); // Zustandストアからローディング状態を取得
  const timeGridProps = useTimeGridProps(year, week);  // TimeGrid用のpropsを生成
  const sidebarProps = useSidebarProps(year, week);  // ZissekiSidebar用のpropsを生成

  // ローディング中はスピナーを表示
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <ZissekiSidebar {...sidebarProps} />
      
      {/* メインコンテンツ */}
      <div className="flex-1 overflow-hidden">
        <TimeGrid {...timeGridProps} />
      </div>
    </div>
  );
}