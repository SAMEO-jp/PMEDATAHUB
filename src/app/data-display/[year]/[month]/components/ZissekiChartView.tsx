"use client"

import React from 'react'
import { useZissekiMonthData } from '@src/hooks/useZissekiData'
import type { TimeGridEvent } from '@src/app/zisseki-demo/[year]/[week]/types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

// Chart.jsのコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface ZissekiChartViewProps {
  year: number
  month: number
}

export default function ZissekiChartView({ year, month }: ZissekiChartViewProps) {
  const { data, isLoading, error } = useZissekiMonthData(year, month)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        エラーが発生しました: {error.message}
      </div>
    )
  }

  const events = data?.data?.events || []

  // プロジェクト別の集計
  const projectStats = events.reduce((acc, event) => {
    const project = event.project || '未分類'
    if (!acc[project]) {
      acc[project] = { count: 0, totalHours: 0 }
    }
    acc[project].count++
    
    // 時間計算
    const start = new Date(event.startDateTime)
    const end = new Date(event.endDateTime)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    acc[project].totalHours += hours
    
    return acc
  }, {} as Record<string, { count: number; totalHours: number }>)

  // 業務コード別の集計
  const activityCodeStats = events.reduce((acc, event) => {
    const code = event.activityCode || '未分類'
    if (!acc[code]) {
      acc[code] = { count: 0, totalHours: 0 }
    }
    acc[code].count++
    
    const start = new Date(event.startDateTime)
    const end = new Date(event.endDateTime)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    acc[code].totalHours += hours
    
    return acc
  }, {} as Record<string, { count: number; totalHours: number }>)

  // 日別の集計
  const dailyStats = events.reduce((acc, event) => {
    const date = new Date(event.startDateTime).toLocaleDateString('ja-JP')
    if (!acc[date]) {
      acc[date] = { count: 0, totalHours: 0 }
    }
    acc[date].count++
    
    const start = new Date(event.startDateTime)
    const end = new Date(event.endDateTime)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    acc[date].totalHours += hours
    
    return acc
  }, {} as Record<string, { count: number; totalHours: number }>)

  // プロジェクト別時間のグラフデータ
  const projectChartData = {
    labels: Object.keys(projectStats),
    datasets: [
      {
        label: '作業時間（時間）',
        data: Object.values(projectStats).map(stats => stats.totalHours),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  // 業務コード別時間のグラフデータ
  const activityChartData = {
    labels: Object.keys(activityCodeStats),
    datasets: [
      {
        label: '作業時間（時間）',
        data: Object.values(activityCodeStats).map(stats => stats.totalHours),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  // 日別時間のグラフデータ
  const dailyChartData = {
    labels: Object.keys(dailyStats).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    datasets: [
      {
        label: '作業時間（時間）',
        data: Object.keys(dailyStats)
          .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
          .map(date => dailyStats[date].totalHours),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  }

  // プロジェクト別の円グラフデータ
  const projectPieData = {
    labels: Object.keys(projectStats),
    datasets: [
      {
        data: Object.values(projectStats).map(stats => stats.totalHours),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold">実績データ分析 ({year}年{month}月)</h2>
      </div>

      {/* 基本統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">総イベント数</h3>
          <p className="text-3xl font-bold text-blue-600">{events.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">総作業時間</h3>
          <p className="text-3xl font-bold text-green-600">
            {events.reduce((total, event) => {
              const start = new Date(event.startDateTime)
              const end = new Date(event.endDateTime)
              return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
            }, 0).toFixed(1)}時間
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-purple-800">プロジェクト数</h3>
          <p className="text-3xl font-bold text-purple-600">
            {Object.keys(projectStats).length}
          </p>
        </div>
      </div>

      {/* グラフセクション */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* プロジェクト別時間（棒グラフ） */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">プロジェクト別作業時間</h3>
          <div className="h-64">
            <Bar data={projectChartData} options={chartOptions} />
          </div>
        </div>

        {/* プロジェクト別時間（円グラフ） */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">プロジェクト別時間比率</h3>
          <div className="h-64">
            <Pie data={projectPieData} options={chartOptions} />
          </div>
        </div>

        {/* 業務コード別時間 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">業務コード別作業時間</h3>
          <div className="h-64">
            <Bar data={activityChartData} options={chartOptions} />
          </div>
        </div>

        {/* 日別時間推移 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">日別作業時間推移</h3>
          <div className="h-64">
            <Line data={dailyChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* 詳細統計テーブル */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* プロジェクト別集計 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">プロジェクト別集計</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">プロジェクト</th>
                  <th className="text-right py-2">イベント数</th>
                  <th className="text-right py-2">総時間（時間）</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(projectStats)
                  .sort(([, a], [, b]) => b.totalHours - a.totalHours)
                  .map(([project, stats]) => (
                    <tr key={project} className="border-b">
                      <td className="py-2">{project}</td>
                      <td className="text-right py-2">{stats.count}</td>
                      <td className="text-right py-2">{stats.totalHours.toFixed(1)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 業務コード別集計 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">業務コード別集計</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">業務コード</th>
                  <th className="text-right py-2">イベント数</th>
                  <th className="text-right py-2">総時間（時間）</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(activityCodeStats)
                  .sort(([, a], [, b]) => b.totalHours - a.totalHours)
                  .map(([code, stats]) => (
                    <tr key={code} className="border-b">
                      <td className="py-2">{code}</td>
                      <td className="text-right py-2">{stats.count}</td>
                      <td className="text-right py-2">{stats.totalHours.toFixed(1)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 日別集計 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">日別集計</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">日付</th>
                <th className="text-right py-2">イベント数</th>
                <th className="text-right py-2">総時間（時間）</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(dailyStats)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, stats]) => (
                  <tr key={date} className="border-b">
                    <td className="py-2">{date}</td>
                    <td className="text-right py-2">{stats.count}</td>
                    <td className="text-right py-2">{stats.totalHours.toFixed(1)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
