import React from 'react';
import Link from 'next/link';

export default function TechMapPage() {
  return (
    <div className="tech-map-page p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← ナレッジ管理に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">要素技術MAP</h1>
          <p className="text-lg text-gray-600">
            要素技術の関連性や依存関係を可視化したマップを表示します。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">技術要素マップ</h2>
          
          {/* 技術要素の階層表示 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* フロントエンド技術 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-blue-600">フロントエンド技術</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">React</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">TypeScript</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Tailwind CSS</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Next.js</span>
                  <span className="text-xs text-yellow-600">検討中</span>
                </div>
              </div>
            </div>

            {/* バックエンド技術 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-green-600">バックエンド技術</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Node.js</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Express</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">tRPC</span>
                  <span className="text-xs text-yellow-600">検討中</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Prisma</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
              </div>
            </div>

            {/* インフラ・運用技術 */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-3 text-purple-600">インフラ・運用技術</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Docker</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">PostgreSQL</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">Redis</span>
                  <span className="text-xs text-yellow-600">検討中</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">AWS</span>
                  <span className="text-xs text-green-600">安定</span>
                </div>
              </div>
            </div>
          </div>

          {/* 技術依存関係図 */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">技術依存関係</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-center text-gray-600">
                <p>技術要素間の依存関係を可視化するマップがここに表示されます。</p>
                <p className="text-sm mt-2">（将来的にインタラクティブなマップを実装予定）</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 