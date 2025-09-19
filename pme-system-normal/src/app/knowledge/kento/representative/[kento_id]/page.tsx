import React from 'react';
import Link from 'next/link';

export default function RepresentativeKentoPage() {
  // 最新の代表検討書データ
  const latestKento = {
    id: 'm2r3-2024',
    title: '1B31 上部流調ゲート弁 軸強度検討（標準）',
    description: '高炉グループの炉頂設備の上部流調ゲート弁における軸強度について検討した文書です。',
    status: 'approved' as const,
    team: '高炉グループ',
    lastUpdated: '2024-01-25',
    createdBy: '田中太郎',
    version: 'v5.0.0',
    tags: ['軸強度', 'ゲート弁', '炉頂設備', '標準']
  };

  // 実績検討書データ
  const historicalKentos = [
    {
      id: 'm2r3-2019',
      abbreviation: 'M2R3',
      year: '2019',
      date: '2019/7/13',
      isStandard: true,
      createdBy: '田中太郎',
      status: 'approved' as const
    },
    {
      id: 'c2r4-2016',
      abbreviation: 'C2R4',
      year: '2016',
      date: '2016/12/1',
      isStandard: true,
      createdBy: '佐藤花子',
      status: 'approved' as const
    },
    {
      id: 'n1r5-2010',
      abbreviation: 'N1R5',
      year: '2010',
      date: '2010/8/30',
      isStandard: false,
      createdBy: '山田次郎',
      status: 'approved' as const
    }
  ];

  // ステータスの色
  const statusColor = {
    approved: 'text-green-600 bg-green-100',
    review: 'text-yellow-600 bg-yellow-100',
    draft: 'text-gray-600 bg-gray-100'
  } as const;

  return (
    <div className="representative-kento-page p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge/kento/representative" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← 代表検討書一覧に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">代表検討書</h1>
          <p className="text-lg text-gray-600">
            プロジェクト全体の代表的な検討書を管理・閲覧できます。
          </p>
        </div>
        
        {/* 最新の代表検討書（カード表示） */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">最新の代表検討書</h2>
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start gap-6 mb-4">
              <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200">
                <span className="text-blue-600 text-lg">🏭</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{latestKento.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{latestKento.description}</p>
                
                {/* メタ情報 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">検討書ID:</span>
                    <span className="ml-2 font-medium">{latestKento.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">ステータス:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${statusColor[latestKento.status]}`}>
                      承認済み
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">担当:</span>
                    <span className="ml-2 font-medium">{latestKento.team}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">最終更新:</span>
                    <span className="ml-2 font-medium">{latestKento.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mb-4">
              {latestKento.tags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>

            {/* アクションボタン */}
            <div className="flex gap-3">
              <Link href={`/knowledge/kento/individual/${latestKento.id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
                詳細を見る
              </Link>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                印刷
              </button>
              <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded text-sm font-medium transition-colors">
                エクスポート
              </button>
            </div>
          </div>
        </div>

        {/* 実績検討書一覧（リスト表示） */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">実績検討書一覧</h2>
          <div className="space-y-4">
            {historicalKentos.map((kento, index) => (
              <Link 
                key={kento.id} 
                href={`/knowledge/kento/individual/${kento.id}`}
                className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                      <span className="text-gray-500 text-sm">📄</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {kento.abbreviation} - {kento.year}年実施
                      </h3>
                      <p className="text-sm text-gray-600">
                        実施日: {kento.date} | 作成者: {kento.createdBy}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusColor[kento.status]}`}>
                      承認済み
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      kento.isStandard 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {kento.isStandard ? '標準' : '特例'}
                    </span>
                    <span className="text-gray-400">
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