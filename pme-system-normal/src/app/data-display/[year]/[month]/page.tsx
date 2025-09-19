"use client"

import { useContext } from "react"
import { useParams } from "next/navigation"
import { useProjectAll } from '@src/hooks/useProjectData'
import { useZissekiMonthData } from '@src/hooks/useZissekiData'
import { useAuthState } from '@src/contexts/AuthContext'
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

  // 認証状態を取得
  const { user } = useAuthState()

  // プロジェクト一覧を取得（常に実行）
  const { data: projectData, isLoading: projectsLoading, error: projectsError } = useProjectAll({
    page: 1,
    limit: 100,
  });

  // 実績データを取得（常に実行）
  const { data: zissekiData, isLoading: zissekiLoading, error: zissekiError } = useZissekiMonthData(
    year, 
    month, 
    user?.user_id || ''
  );

  const projects = (projectData as any)?.data || [];
  const events = (zissekiData as any)?.data?.events || [];

  return (
    <div className="h-full">
      {viewMode === "table" ? (
        <ZissekiDataView year={year} month={month} events={events} />
      ) : viewMode === "chart" ? (
        <ZissekiChartView 
          year={year} 
          month={month} 
          projects={projects}
          events={events}
          projectsLoading={projectsLoading}
          projectsError={projectsError}
          zissekiLoading={zissekiLoading}
          zissekiError={zissekiError}
        />
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