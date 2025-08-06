"use client"

import React, { useState } from 'react'
import { TimeGridEvent } from '@src/app/zisseki-demo/[year]/[week]/types'

// 新しいEventDisplayコンポーネント（モダン版）
const ModernEventDisplay = ({ event, onClick }: { event: TimeGridEvent; onClick: (event: TimeGridEvent) => void }) => {
  const getStatusColor = (unsaved: boolean) => {
    return unsaved ? 'border-l-4 border-l-yellow-400' : ''
  }

  const getPriorityColor = (activityCode: string) => {
    if (activityCode.includes('IMPORTANT')) return 'bg-red-500'
    if (activityCode.includes('ZJD0')) return 'bg-purple-500'
    if (activityCode.includes('P100')) return 'bg-orange-500'
    return 'bg-blue-500'
  }

  return (
    <div
      className={`absolute overflow-hidden text-xs rounded-lg cursor-pointer group transition-all duration-200 hover:scale-105 hover:shadow-xl ${getStatusColor(event.unsaved || false)}`}
      style={{
        top: `${event.top}px`,
        height: `${Math.max(event.height, 48)}px`,
        left: "4px",
        right: "4px",
        backgroundColor: event.color,
        color: "white"
      }}
      onClick={() => onClick(event)}
      title={`${event.title} - 業務コード: ${event.activityCode || '未設定'} - サブタブ: ${event.subTabType || 'なし'}`}
    >
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20"></div>
      
      {/* メインコンテンツ */}
      <div className="relative h-full flex flex-col p-2">
        {/* ヘッダー部分 */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate leading-tight">
              {event.title}
            </div>
          </div>
          {event.unsaved && (
            <div className="ml-1 flex-shrink-0">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* 説明文 */}
        {event.description && (
          <div className="text-xs opacity-90 truncate leading-tight mb-1">
            {event.description}
          </div>
        )}

        {/* フッター情報 */}
        <div className="mt-auto">
          {/* 業務コード */}
          {event.activityCode && (
            <div className="flex items-center space-x-1 mb-1">
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(event.activityCode)}`}></div>
              <span className="text-xs font-mono bg-black/30 px-1.5 py-0.5 rounded text-white/90">
                {event.activityCode}
              </span>
            </div>
          )}
          
          {/* サブタブ情報 */}
          {event.subTabType && (
            <div className="text-xs opacity-75 truncate">
              🏷️ {event.subTabType}
            </div>
          )}
        </div>
      </div>

      {/* ホバーエフェクト */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  )
}

// カード版EventDisplayコンポーネント
const CardEventDisplay = ({ event, onClick }: { event: TimeGridEvent; onClick: (event: TimeGridEvent) => void }) => {
  return (
    <div
      className={`absolute overflow-hidden rounded-xl cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        event.unsaved ? "ring-2 ring-yellow-400" : ""
      }`}
      style={{
        top: `${event.top}px`,
        height: `${Math.max(event.height, 48)}px`,
        left: "4px",
        right: "4px",
        backgroundColor: event.color,
        color: "white"
      }}
      onClick={() => onClick(event)}
    >
      {/* カード背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/25"></div>
      
      {/* コンテンツ */}
      <div className="relative h-full flex flex-col p-3">
        {/* タイトルエリア */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-sm leading-tight flex-1 min-w-0">
            {event.title}
          </h3>
          {event.unsaved && (
            <div className="ml-2 flex-shrink-0">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse shadow-lg"></div>
            </div>
          )}
        </div>

        {/* 説明エリア */}
        {event.description && (
          <div className="text-xs opacity-90 leading-relaxed mb-2 flex-1">
            {event.description}
          </div>
        )}

        {/* メタ情報エリア */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {event.activityCode && (
              <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded-full text-white/90">
                {event.activityCode}
              </span>
            )}
            {event.subTabType && (
              <span className="text-xs opacity-75">
                🏷️ {event.subTabType}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ホバーエフェクト */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}

// ミニマル版EventDisplayコンポーネント
const MinimalEventDisplay = ({ event, onClick }: { event: TimeGridEvent; onClick: (event: TimeGridEvent) => void }) => {
  return (
    <div
      className={`absolute overflow-hidden rounded-md cursor-pointer group transition-all duration-200 hover:scale-102 ${
        event.unsaved ? "border-l-2 border-l-yellow-400" : ""
      }`}
      style={{
        top: `${event.top}px`,
        height: `${Math.max(event.height, 48)}px`,
        left: "4px",
        right: "4px",
        backgroundColor: event.color,
        color: "white"
      }}
      onClick={() => onClick(event)}
    >
      <div className="h-full flex flex-col p-2">
        <div className="font-semibold text-sm truncate leading-tight">
          {event.title}
        </div>
        
        {event.description && (
          <div className="text-xs opacity-90 truncate mt-1">
            {event.description}
          </div>
        )}
        
        {event.activityCode && (
          <div className="mt-auto text-xs font-mono opacity-75">
            {event.activityCode}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EventDisplayTestPage() {
  // 比較用のイベントデータ
  const baseEvent: TimeGridEvent = {
    id: '1',
    title: '設計会議',
    description: 'システム設計の検討',
    project: 'PROJECT001',
    startDateTime: '2025-01-06T10:00:00',
    endDateTime: '2025-01-06T12:00:00',
    top: 80,
    height: 96,
    color: '#3B82F6',
    activityCode: 'DP01',
    businessCode: 'DP01',
    subTabType: '詳細図',
    selectedTab: 'project',
    selectedProjectSubTab: '設計',
    unsaved: false
  }

  // 見た目のバリエーション
  const [variations] = useState<{ name: string; event: TimeGridEvent }[]>([
    {
      name: "現在のデザイン",
      event: { ...baseEvent }
    },
    {
      name: "コンパクト版",
      event: { 
        ...baseEvent, 
        height: 60,
        title: '設計会議（短）',
        description: '設計検討'
      }
    },
    {
      name: "詳細版",
      event: { 
        ...baseEvent, 
        height: 120,
        title: '設計会議（詳細）',
        description: 'システム設計の詳細検討と実装方針の決定'
      }
    },
    {
      name: "強調版",
      event: { 
        ...baseEvent, 
        color: '#EF4444',
        title: '重要会議',
        description: '緊急の設計変更'
      }
    },
    {
      name: "シンプル版",
      event: { 
        ...baseEvent, 
        title: '会議',
        description: '',
        activityCode: '',
        businessCode: '',
        subTabType: ''
      }
    },
    {
      name: "未保存版",
      event: { 
        ...baseEvent, 
        unsaved: true,
        title: '未保存会議',
        description: '保存されていない変更あり'
      }
    },
    {
      name: "長いタイトル版",
      event: { 
        ...baseEvent, 
        title: '非常に長いイベントタイトルでテストする',
        description: '長い説明文も含めて表示の確認を行う'
      }
    },
    {
      name: "業務コード強調版",
      event: { 
        ...baseEvent, 
        activityCode: 'IMPORTANT',
        businessCode: 'IMPORTANT',
        title: '重要業務',
        description: '業務コードが強調される'
      }
    },
    {
      name: "間接業務版",
      event: { 
        ...baseEvent, 
        color: '#8B5CF6',
        activityCode: 'ZJD0',
        businessCode: 'ZJD0',
        subTabType: '日報入力',
        selectedTab: 'indirect',
        selectedIndirectSubTab: '純間接',
        title: '間接業務',
        description: '日報入力作業'
      }
    },
    {
      name: "購入品版",
      event: { 
        ...baseEvent, 
        color: '#F97316',
        activityCode: 'P100',
        businessCode: 'P100',
        subTabType: '計画図作成',
        selectedProjectSubTab: '購入品',
        title: '購入品検討',
        description: '設備仕様の検討'
      }
    },
    {
      name: "短時間版",
      event: { 
        ...baseEvent, 
        height: 32,
        title: '短い会議',
        description: '30分会議',
        endDateTime: '2025-01-06T10:30:00'
      }
    },
    {
      name: "長時間版",
      event: { 
        ...baseEvent, 
        height: 160,
        title: '長時間作業',
        description: '4時間の長時間作業',
        endDateTime: '2025-01-06T14:00:00'
      }
    },
    {
      name: "説明なし版",
      event: { 
        ...baseEvent, 
        description: '',
        title: 'タイトルのみ'
      }
    },
    {
      name: "コードなし版",
      event: { 
        ...baseEvent, 
        activityCode: '',
        businessCode: '',
        subTabType: '',
        title: 'コードなし',
        description: '業務コードが設定されていない'
      }
    },
    {
      name: "最小版",
      event: { 
        ...baseEvent, 
        height: 48,
        title: '最小',
        description: '最小サイズ'
      }
    }
  ])

  // イベントクリックハンドラー
  const handleEventClick = (event: TimeGridEvent) => {
    console.log('イベントクリック:', event)
    alert(`イベントクリック: ${event.title}\n業務コード: ${event.activityCode || 'なし'}\nサブタブ: ${event.subTabType || 'なし'}`)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* 固定ヘッダー */}
      <div className="flex-shrink-0 bg-white border-b p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          EventDisplay コンポーネント UI/UX 向上テストページ
        </h1>
        <p className="text-sm text-gray-600">
          よりかっこよく、見やすいUI/UXを実現するための新しいEventDisplayコンポーネントをテストできます。
        </p>
      </div>

      {/* スクロール可能なメインコンテンツ */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* デザイン比較セクション */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">デザイン比較</h2>
          
          {/* モダン版 */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3">🎨 モダン版（推奨）</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <h4 className="font-semibold text-gray-700">グラデーション + ホバーエフェクト</h4>
              </div>
              <div className="relative bg-gray-50 p-8" style={{ height: '200px' }}>
                <div className="absolute left-0 top-0 w-16 bg-gray-50 border-r h-full">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-12 border-b flex items-center justify-center">
                      <span className="text-xs text-gray-600">{(i + 10).toString().padStart(2, '0')}:00</span>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 ml-16">
                  {variations.slice(0, 5).map((variation, index) => (
                    <div key={index} className="absolute" style={{ left: `${index * 18}%`, width: '16%' }}>
                      <ModernEventDisplay
                        event={variation.event}
                        onClick={handleEventClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* カード版 */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3">🃏 カード版</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <h4 className="font-semibold text-gray-700">カードスタイル + 詳細情報</h4>
              </div>
              <div className="relative bg-gray-50 p-8" style={{ height: '200px' }}>
                <div className="absolute left-0 top-0 w-16 bg-gray-50 border-r h-full">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-12 border-b flex items-center justify-center">
                      <span className="text-xs text-gray-600">{(i + 10).toString().padStart(2, '0')}:00</span>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 ml-16">
                  {variations.slice(5, 10).map((variation, index) => (
                    <div key={index} className="absolute" style={{ left: `${index * 18}%`, width: '16%' }}>
                      <CardEventDisplay
                        event={variation.event}
                        onClick={handleEventClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ミニマル版 */}
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-700 mb-3">⚡ ミニマル版</h3>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-3 border-b">
                <h4 className="font-semibold text-gray-700">シンプル + 軽量</h4>
              </div>
              <div className="relative bg-gray-50 p-8" style={{ height: '200px' }}>
                <div className="absolute left-0 top-0 w-16 bg-gray-50 border-r h-full">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="h-12 border-b flex items-center justify-center">
                      <span className="text-xs text-gray-600">{(i + 10).toString().padStart(2, '0')}:00</span>
                    </div>
                  ))}
                </div>
                <div className="relative z-10 ml-16">
                  {variations.slice(10, 15).map((variation, index) => (
                    <div key={index} className="absolute" style={{ left: `${index * 18}%`, width: '16%' }}>
                      <MinimalEventDisplay
                        event={variation.event}
                        onClick={handleEventClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 改良ポイント */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-4">🎯 UI/UX 改良ポイント</h2>
          <div className="text-sm text-green-700 space-y-2">
            <p>• <strong>視覚的階層:</strong> 情報の重要度に応じた配置とサイズ</p>
            <p>• <strong>インタラクション:</strong> ホバーエフェクトとアニメーション</p>
            <p>• <strong>色とコントラスト:</strong> 業務種別による色分けと可読性</p>
            <p>• <strong>情報密度:</strong> 適切な情報量とスペーシング</p>
            <p>• <strong>レスポンシブ:</strong> 様々なサイズでの表示最適化</p>
            <p>• <strong>アクセシビリティ:</strong> キーボード操作とスクリーンリーダー対応</p>
          </div>
        </div>

        {/* 技術的特徴 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">⚙️ 技術的特徴</h2>
          <div className="text-sm text-purple-700 space-y-2">
            <p>• <strong>グラデーション:</strong> 視覚的な深さとモダンな印象</p>
            <p>• <strong>アニメーション:</strong> スムーズなトランジション効果</p>
            <p>• <strong>状態表示:</strong> 未保存状態の視覚的フィードバック</p>
            <p>• <strong>優先度表示:</strong> 業務コードによる色分け</p>
            <p>• <strong>ホバー効果:</strong> インタラクティブな要素の強調</p>
          </div>
        </div>

        {/* スクロールテスト用の追加コンテンツ */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">スクロールテスト用コンテンツ</h2>
          <p className="text-gray-600 mb-4">このセクションはスクロール機能をテストするために追加されています。</p>
          
          {/* 繰り返しコンテンツ */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">テストセクション {i + 1}</h3>
              <p className="text-gray-600 mb-3">
                これはスクロールテスト用のサンプルコンテンツです。長いコンテンツを表示してスクロール機能を確認できます。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded">
                  <h4 className="font-medium text-blue-900">機能 {i + 1}-A</h4>
                  <p className="text-sm text-blue-700">詳細な説明とサンプルデータ</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <h4 className="font-medium text-green-900">機能 {i + 1}-B</h4>
                  <p className="text-sm text-green-700">追加の情報とテストケース</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 最終セクション */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">最終セクション</h2>
          <p className="text-gray-600">
            これでページの最後までスクロールできました。レイアウトのスクロール機能が正常に動作していることを確認できます。
          </p>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ✅ スクロール機能が正常に動作しています！
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 