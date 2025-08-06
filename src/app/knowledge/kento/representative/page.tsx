import React from 'react';
import Link from 'next/link';

export default function RepresentativeKentoPage() {
  // 代表検討書一覧データ
  const representativeKentos = [
    {
      id: 'm2r3-2024',
      title: '1B31 上部流調ゲート弁 軸強度検討（標準）',
      description: '高炉グループの炉頂設備の上部流調ゲート弁における軸強度について検討した文書です。',
      status: 'approved' as const,
      team: '高炉グループ',
      lastUpdated: '2024-01-25',
      createdBy: '田中太郎',
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
      team: '設備グループ',
      lastUpdated: '2024-01-20',
      createdBy: '佐藤花子',
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
      team: '機械グループ',
      lastUpdated: '2024-01-15',
      createdBy: '山田次郎',
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
      team: '熱処理グループ',
      lastUpdated: '2024-01-10',
      createdBy: '鈴木一郎',
      version: 'v1.5.0',
      tags: ['熱応力', '加熱炉', '寿命予測', '標準'],
      icon: '🔥',
      color: 'orange'
    },
    {
      id: 'conveyor-2024',
      title: '5E25 コンベヤ 駆動部検討（標準）',
      description: '原料搬送コンベヤの駆動部設計と保守性について検討した文書です。',
      status: 'approved' as const,
      team: '搬送グループ',
      lastUpdated: '2024-01-05',
      createdBy: '高橋美咲',
      version: 'v4.0.0',
      tags: ['駆動部', 'コンベヤ', '搬送', '標準'],
      icon: '📦',
      color: 'indigo'
    },
    {
      id: 'tank-2024',
      title: '6F12 貯槽 腐食対策検討（特例）',
      description: '化学薬品貯槽の腐食対策と材料選定について検討した文書です。',
      status: 'review' as const,
      team: '化学グループ',
      lastUpdated: '2024-01-01',
      createdBy: '伊藤健太',
      version: 'v2.8.0',
      tags: ['腐食対策', '貯槽', '化学薬品', '特例'],
      icon: '🧪',
      color: 'red'
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
    <div className="representative-kento-page p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge/kento" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 検討書管理に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">代表検討書</h1>
          <p className="text-lg text-gray-600">
            プロジェクト全体の代表的な検討書を管理・閲覧できます。
          </p>
        </div>
        
        {/* 代表検討書一覧 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">代表検討書一覧</h2>
          <div className="space-y-4">
            {representativeKentos.map((kento, index) => (
              <Link 
                key={kento.id} 
                href={`/knowledge/kento/representative/${kento.id}`}
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
                        <span className="text-gray-500">担当:</span>
                        <span className="ml-2 font-medium">{kento.team}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">最終更新:</span>
                        <span className="ml-2 font-medium">{kento.lastUpdated}</span>
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
      </div>
    </div>
  );
} 