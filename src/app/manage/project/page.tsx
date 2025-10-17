'use client';

import React from 'react';

export default function ProjectManagePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">プロジェクト管理</h1>

        {/* メニュー */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            { label: '表示', icon: '👁️' },
            { label: '新規作成', icon: '➕' },
            { label: 'メンバー登録', icon: '👥' },
            { label: '管理', icon: '⚙️' }
          ].map((item, index) => (
            <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
              <div className="text-3xl mb-3">{item.icon}</div>
              <div className="text-sm font-medium text-gray-700">{item.label}</div>
            </div>
          ))}
        </div>

        {/* 検索バー */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 mb-6">
          <input
            type="text"
            placeholder="プロジェクト名・クライアント名で検索..."
            className="w-full border-0 outline-none"
          />
        </div>

        {/* プロジェクト一覧 */}
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">プロジェクト一覧</h2>
          </div>

          <div className="p-8 text-center text-gray-500">
            プロジェクトデータを読み込み中...
          </div>
        </div>
      </div>
    </div>
  );
}
