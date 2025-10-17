import React from 'react';
import Link from 'next/link';

export default function Kimitsu2BPHydrogenProjectPage() {
  // 担当者情報
  const assignee = {
    name: '担当者 太郎',
    department: '高炉グループ',
    position: '主任技師',
    contact: 'tanaka.taro@company.com'
  };

  // 作成した検討書一覧
  const createdKentos = [
    {
      id: 'm2r3-2024',
      title: '1B31 上部流調ゲート弁 軸強度検討（標準）',
      description: '高炉グループの炉頂設備の上部流調ゲート弁における軸強度について検討した文書です。',
      status: 'approved' as const,
      lastUpdated: '2024-01-25',
      version: 'v5.0.0',
      tags: ['軸強度', 'ゲート弁', '炉頂設備', '標準'],
      icon: '🏭',
      color: 'blue'
    },
    {
      id: 'pump-2024',
      title: '2A15 循環ポンプ 軸受検討（標準）',
      description: '製鉄所の循環水システムにおけるポンプ軸受の設計と耐久性について検討した文書です。',
      status: 'review' as const,
      lastUpdated: '2024-01-20',
      version: 'v3.2.0',
      tags: ['軸受', 'ポンプ', '循環水', '標準'],
      icon: '⚙️',
      color: 'green'
    },
    {
      id: 'compressor-2024',
      title: '3C22 圧縮機 振動解析検討（特例）',
      description: 'ガス圧縮機の振動特性と対策について検討した文書です。',
      status: 'approved' as const,
      lastUpdated: '2024-01-15',
      version: 'v2.1.0',
      tags: ['振動解析', '圧縮機', '特例'],
      icon: '🔧',
      color: 'purple'
    },
    {
      id: 'heater-2024',
      title: '4D18 加熱炉 熱応力検討（標準）',
      description: '加熱炉の熱応力解析と寿命予測について検討した文書です。',
      status: 'draft' as const,
      lastUpdated: '2024-01-10',
      version: 'v1.5.0',
      tags: ['熱応力', '加熱炉', '寿命予測', '標準'],
      icon: '🔥',
      color: 'orange'
    }
  ];

  // ステータスの色
  const statusColor = {
    approved: 'text-green-600 bg-green-100',
    review: 'text-yellow-600 bg-yellow-100',
    draft: 'text-gray-600 bg-gray-100'
  } as const;

  // カラー設定
  const colorClasses = {
    blue: 'bg-blue-100 border-blue-200 text-blue-600',
    green: 'bg-green-100 border-green-200 text-green-600',
    purple: 'bg-purple-100 border-purple-200 text-purple-600',
    orange: 'bg-orange-100 border-orange-200 text-orange-600',
    indigo: 'bg-indigo-100 border-indigo-200 text-indigo-600',
    red: 'bg-red-100 border-red-200 text-red-600'
  };

  return (
    <div className="project-page p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* プロジェクトヘッダー */}
        <div className="mb-8">
          <Link href="/app_project" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← プロジェクト一覧に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">君津２高炉BP水素吹き込み対応</h1>
          <p className="text-lg text-gray-600 mb-6">
            君津製鉄所第2高炉における水素吹き込み設備の導入プロジェクトです。
          </p>
        </div>

        {/* 担当者情報 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">担当者情報</h2>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200">
              <span className="text-blue-600 text-xl font-bold">
                {assignee.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{assignee.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">部署:</span>
                  <span className="ml-2 font-medium">{assignee.department}</span>
                </div>
                <div>
                  <span className="text-gray-500">役職:</span>
                  <span className="ml-2 font-medium">{assignee.position}</span>
                </div>
                <div>
                  <span className="text-gray-500">連絡先:</span>
                  <span className="ml-2 font-medium">{assignee.contact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 検討書作成一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">検討書作成一覧</h2>
          <div className="space-y-4">
            {createdKentos.map((kento, index) => (
              <Link 
                key={kento.id} 
                href={`/knowledge/kento/individual/${kento.id}`}
                className="block border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border ${colorClasses[kento.color as keyof typeof colorClasses]}`}>
                    <span className="text-lg">{kento.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{kento.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{kento.description}</p>
                    
                    {/* メタ情報 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">検討書ID:</span>
                        <span className="ml-2 font-medium">{kento.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">ステータス:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${statusColor[kento.status]}`}>
                          {kento.status === 'approved' ? '承認済み' : 
                           kento.status === 'review' ? 'レビュー中' : '作成中'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">最終更新:</span>
                        <span className="ml-2 font-medium">{kento.lastUpdated}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">バージョン:</span>
                        <span className="ml-2 font-medium">{kento.version}</span>
                      </div>
                    </div>

                    {/* タグ */}
                    <div className="flex flex-wrap gap-2">
                      {kento.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-lg">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* プロジェクト概要 */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">プロジェクト概要</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">プロジェクト目的</h3>
              <p className="text-gray-600 leading-relaxed">
                君津製鉄所第2高炉において、水素吹き込み設備を導入し、CO2排出量の削減を図ります。
                高炉への水素吹き込みにより、還元剤としてのコークス使用量を削減し、
                環境負荷の低減を実現します。
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-900">主要設備</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• 水素供給設備</li>
                <li>• 吹き込みノズル</li>
                <li>• 流量制御システム</li>
                <li>• 安全監視システム</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 