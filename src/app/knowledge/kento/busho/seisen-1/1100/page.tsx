'use client';

import React from 'react';
import { Spacer } from '../../../../../../components/cusutom_ui/Spacer';
import { Seiban } from '../../../../../../types/seiban';

export default function Seiban1100Page() {
  // 1100の詳細データ
  const seiban1100: Seiban = {
    id: 'seiban-1100',
    code: '1100',
    name: '製銑・精錬第１課 - 1100',
    description: '製銑・精錬に関する技術開発、設備管理、品質管理を担当します。',
    category: 'seisen-1',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  return (
    <div className="seiban-1100-page">
      <Spacer height={80} />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* 戻るボタン */}
        <div className="mb-6">
          <a 
            href="/knowledge/kento/busho/seisen-1" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            製銑・精錬第１課に戻る
          </a>
        </div>

        {/* 製番詳細情報 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              製銑・精錬第１課
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{seiban1100.name}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-8">{seiban1100.description}</p>
          </div>

          {/* 製番情報テーブル */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">製番情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">製番ID</dt>
                <dd className="text-sm text-gray-900">{seiban1100.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">製番コード</dt>
                <dd className="text-sm text-gray-900">{seiban1100.code}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">製番名</dt>
                <dd className="text-sm text-gray-900">{seiban1100.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
                <dd className="text-sm text-gray-900">製銑・精錬第１課</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">表示順序</dt>
                <dd className="text-sm text-gray-900">{seiban1100.order}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">作成日</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(seiban1100.createdAt).toLocaleDateString('ja-JP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">更新日</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(seiban1100.updatedAt).toLocaleDateString('ja-JP')}
                </dd>
              </div>
            </div>
          </div>

          {/* 技術開発セクション */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">技術開発</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">新技術開発</h3>
                <p className="text-gray-700">製銑・精錬プロセスの効率化、品質向上のための新技術の研究開発を行います。</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">設備改良</h3>
                <p className="text-gray-700">既存設備の性能向上、新設備の導入検討、設備の最適化を実施します。</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">品質管理技術</h3>
                <p className="text-gray-700">品質管理手法の改善、検査技術の向上、品質保証システムの構築を行います。</p>
              </div>
            </div>
          </div>

          {/* 設備管理セクション */}
          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">設備管理</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">設備監視</h3>
                <p className="text-gray-700">製銑・精錬設備の運転状況監視、異常検知、予防保全を実施します。</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">メンテナンス計画</h3>
                <p className="text-gray-700">定期点検、予防保全、修理計画の策定と実行を行います。</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">設備更新</h3>
                <p className="text-gray-700">老朽化設備の更新、新技術導入による設備の刷新を計画します。</p>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              製番情報を編集
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              技術資料管理
            </button>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              プロジェクト一覧
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
