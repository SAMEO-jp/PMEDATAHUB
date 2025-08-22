"use client"

import { useContext } from "react"
import { useParams } from "next/navigation"
import ZissekiDataView from "./components/ZissekiDataView"
import ZissekiChartView from "./components/ZissekiChartView"
import { ViewModeContext } from "../../ViewModeContext"

export default function DataDisplayPage() {
  // useParamsフックを使用してパラメータを取得
  const params = useParams()

  // URLパラメータから年と月を取得
  const year = Number.parseInt(params.year as string) || new Date().getFullYear()
  const month = Number.parseInt(params.month as string) || new Date().getMonth() + 1

  // ViewModeContextからビューモードを取得
  const { viewMode } = useContext(ViewModeContext)

  return (
    <div className="h-full">
      {viewMode === "table" ? (
        <ZissekiDataView year={year} month={month} />
      ) : viewMode === "chart" ? (
        <ZissekiChartView year={year} month={month} />
      ) : viewMode === "calendar" ? (
        <div className="text-center py-8 text-gray-500">
          出退勤表表示は現在開発中です
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">不明な表示モードです</div>
      )}
    </div>
  )
}