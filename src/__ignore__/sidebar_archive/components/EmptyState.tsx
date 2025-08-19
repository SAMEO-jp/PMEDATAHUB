"use client"

interface EmptyStateProps {
  selectedTab: string
}

export const EmptyState = ({ selectedTab }: EmptyStateProps) => {
  return (
    <div className="p-4">
      <div className="text-center py-4">
        <p className="text-gray-500 mb-4">左側のカレンダーから日付を選択、または</p>
        <p className="text-gray-500 mb-4">タイムグリッドの枠をクリックして新しい業務を登録してください</p>
        <h4 className="text-sm font-medium mb-2">週別表示の使い方</h4>
        <p className="text-xs text-gray-600 mb-2">この画面では、週単位で業務予定を管理できます。</p>
      </div>
      
      {/* タブに応じた説明を追加 */}
      {selectedTab === "project" && (
        <div className="border-t pt-4 mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">プロジェクト業務について</h3>
          <p className="text-xs text-gray-600">
            プロジェクト業務では「計画」「設計」「会議」「購入品」「その他」などの業務を管理できます。
            タイムグリッドをクリックして新しい業務を追加してください。
          </p>
        </div>
      )}

      {selectedTab === "indirect" && (
        <div className="border-t pt-4 mt-2">
          <h3 className="text-sm font-medium text-gray-700 mb-2">間接業務について</h3>
          <p className="text-xs text-gray-600">
            間接業務では会議、研修、勉強会、資料作成などのプロジェクトに直接関連しない業務を管理できます。
            タイムグリッドをクリックして新しい業務を追加してください。
          </p>
        </div>
      )}
    </div>
  )
} 