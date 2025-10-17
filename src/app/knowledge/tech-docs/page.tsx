import React from 'react';
import Link from 'next/link';

export default function TechDocsPage() {
  return (
    <div className="tech-docs-page p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← ナレッジ管理に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">技術書管理</h1>
          <p className="text-lg text-gray-600">
            技術仕様書やマニュアルなどの技術文書を管理・閲覧できます。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">技術書一覧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">API仕様書</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-22</p>
              <p className="text-xs text-gray-500 mb-2">バージョン: v2.1.0</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                詳細を見る
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">開発者マニュアル</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-19</p>
              <p className="text-xs text-gray-500 mb-2">バージョン: v1.5.2</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                詳細を見る
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">運用マニュアル</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-16</p>
              <p className="text-xs text-gray-500 mb-2">バージョン: v1.3.1</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                詳細を見る
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">データベース設計書</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-14</p>
              <p className="text-xs text-gray-500 mb-2">バージョン: v1.2.0</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 