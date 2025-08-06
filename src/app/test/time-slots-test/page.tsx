"use client"

import React, { useState } from 'react'
import { TimeSlots } from '@src/app/zisseki-demo/[year]/[week]/components/weekgrid/components/TimeSlots'
import { TimeGridEvent, WorkTimeData } from '@src/app/zisseki-demo/[year]/[week]/types'

export default function TimeSlotsTestPage() {
  // テスト用の週データ（現在の週）
  const [currentDate] = useState(new Date())
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentDate)
    date.setDate(currentDate.getDate() - currentDate.getDay() + i)
    return date
  })

  // テスト用の勤務時間データ
  const [workTimes] = useState<WorkTimeData[]>([
    {
      date: '2025-01-06',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      date: '2025-01-07',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      date: '2025-01-08',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      date: '2025-01-09',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      date: '2025-01-10',
      startTime: '09:00',
      endTime: '18:00'
    },
    {
      date: '2025-01-11',
      startTime: '09:00',
      endTime: '17:00'
    },
    {
      date: '2025-01-12',
      startTime: '10:00',
      endTime: '16:00'
    }
  ])

  // テスト用のイベントデータ
  const [events, setEvents] = useState<TimeGridEvent[]>([
    {
      id: '1',
      title: '設計会議',
      description: 'システム設計の検討',
      startDateTime: '2025-01-06T10:00:00',
      endDateTime: '2025-01-06T12:00:00',
      top: 80, // 10:00の位置
      height: 96, // 2時間分
      color: '#3B82F6',
      activityCode: 'DP01',
      businessCode: 'DP01',
      subTabType: '詳細図',
      selectedTab: 'project',
      selectedProjectSubTab: '設計',
      unsaved: false
    },
    {
      id: '2',
      title: 'プロジェクト計画',
      description: 'Q1の計画策定',
      startDateTime: '2025-01-07T14:00:00',
      endDateTime: '2025-01-07T16:00:00',
      top: 224, // 14:00の位置
      height: 96, // 2時間分
      color: '#10B981',
      activityCode: 'PP01',
      businessCode: 'PP01',
      subTabType: '計画図',
      selectedTab: 'project',
      selectedProjectSubTab: '計画',
      unsaved: false
    },
    {
      id: '3',
      title: '購入品検討',
      description: '設備仕様の検討',
      startDateTime: '2025-01-08T09:30:00',
      endDateTime: '2025-01-08T11:30:00',
      top: 56, // 9:30の位置
      height: 96, // 2時間分
      color: '#F59E0B',
      activityCode: 'P100',
      businessCode: 'P100',
      subTabType: '計画図作成',
      selectedTab: 'project',
      selectedProjectSubTab: '購入品',
      unsaved: false
    },
    {
      id: '4',
      title: '間接業務',
      description: '日報入力',
      startDateTime: '2025-01-09T13:00:00',
      endDateTime: '2025-01-09T14:00:00',
      top: 176, // 13:00の位置
      height: 48, // 1時間分
      color: '#8B5CF6',
      activityCode: 'ZJD0',
      businessCode: 'ZJD0',
      subTabType: '日報入力',
      selectedTab: 'indirect',
      selectedIndirectSubTab: '純間接',
      unsaved: false
    }
  ])

  // 時間スロット設定
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8) // 8:00-19:00
  const minuteSlots = [0, 30]

  // イベントクリックハンドラー
  const handleEventClick = (event: TimeGridEvent) => {
    console.log('イベントクリック:', event)
    alert(`イベントクリック: ${event.title}\n業務コード: ${event.activityCode}\nサブタブ: ${event.subTabType}`)
  }

  // タイムスロットクリックハンドラー
  const handleTimeSlotClick = (day: Date, hour: number, minute: number) => {
    console.log('タイムスロットクリック:', { day, hour, minute })
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    alert(`タイムスロットクリック: ${day.toLocaleDateString()} ${timeString}`)
  }

  // 新しいイベントを追加する関数
  const addTestEvent = () => {
    const newEvent: TimeGridEvent = {
      id: Date.now().toString(),
      title: `テストイベント${events.length + 1}`,
      description: 'テスト用のイベント',
      startDateTime: '2025-01-06T15:00:00',
      endDateTime: '2025-01-06T16:00:00',
      top: 248, // 15:00の位置
      height: 48, // 1時間分
      color: '#EF4444',
      activityCode: 'TEST',
      businessCode: 'TEST',
      subTabType: 'テスト',
      selectedTab: 'project',
      selectedProjectSubTab: 'その他',
      unsaved: true
    }
    setEvents([...events, newEvent])
  }

  // イベントを削除する関数
  const removeLastEvent = () => {
    if (events.length > 0) {
      setEvents(events.slice(0, -1))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            TimeSlots コンポーネント テストページ
          </h1>
          
          {/* コントロールパネル */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">テストコントロール</h2>
            <div className="flex gap-4">
              <button
                onClick={addTestEvent}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                テストイベント追加
              </button>
              <button
                onClick={removeLastEvent}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                最後のイベント削除
              </button>
            </div>
            <div className="mt-3 text-sm text-blue-700">
              <p>• イベントをクリックすると詳細が表示されます</p>
              <p>• タイムスロットをクリックすると時間が表示されます</p>
              <p>• 業務コードとサブタブ情報が各イベントに表示されます</p>
            </div>
          </div>

          {/* 現在の週情報 */}
          <div className="mb-4 p-3 bg-gray-100 rounded">
            <h3 className="font-semibold text-gray-700 mb-2">表示週: {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}</h3>
            <div className="text-sm text-gray-600">
              <p>イベント数: {events.length}</p>
              <p>勤務時間設定日数: {workTimes.length}</p>
            </div>
          </div>

          {/* TimeSlotsコンポーネント */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 border-b">
              <h3 className="font-semibold text-gray-700">TimeSlots コンポーネント</h3>
            </div>
            <div className="relative" style={{ height: '600px' }}>
              {/* 時間軸ヘッダー */}
              <div className="flex border-b bg-gray-50">
                <div className="w-20 border-r bg-gray-50"></div>
                {weekDays.map((day, index) => (
                  <div key={index} className="flex-1 text-center py-2 border-r last:border-r-0">
                    <div className="text-xs font-medium text-gray-600">
                      {day.toLocaleDateString('ja-JP', { weekday: 'short' })}
                    </div>
                    <div className="text-sm font-bold text-gray-900">
                      {day.getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* 時間軸ラベル */}
              <div className="absolute left-0 top-0 w-20 bg-gray-50 border-r" style={{ height: '600px' }}>
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-16 border-b flex items-center justify-center">
                    <span className="text-xs text-gray-600">{hour}:00</span>
                  </div>
                ))}
              </div>

              {/* TimeSlotsコンポーネント */}
              <div className="ml-20 relative" style={{ height: '600px' }}>
                <TimeSlots
                  weekDays={weekDays}
                  timeSlots={timeSlots}
                  minuteSlots={minuteSlots}
                  workTimes={workTimes}
                  events={events}
                  onTimeSlotClick={handleTimeSlotClick}
                  onEventClick={handleEventClick}
                />
              </div>
            </div>
          </div>

          {/* イベント一覧 */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">現在のイベント一覧</h3>
            <div className="grid gap-2">
              {events.map((event) => (
                <div key={event.id} className="p-3 border rounded bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-sm text-gray-600">{event.description}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.startDateTime).toLocaleString()} - {new Date(event.endDateTime).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        📊 {event.activityCode}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        🏷️ {event.subTabType}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 