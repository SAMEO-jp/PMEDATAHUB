import React from 'react';
import Link from 'next/link';

export default function ZumenPage() {
  return (
    <div className="zumen-page p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← ナレッジ管理に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">図面管理</h1>
          <p className="text-lg text-gray-600">
            設計図面やレイアウト図などの技術図面を管理・閲覧できます。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">図面一覧</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">システム構成図</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-15</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                詳細を見る
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">データベース設計図</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-10</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm">
                詳細を見る
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">UI/UX設計図</h3>
              <p className="text-sm text-gray-600 mb-2">最終更新: 2024-01-08</p>
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