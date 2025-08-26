'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Spacer } from '../../../../../components/cusutom_ui/Spacer';
import { Busho } from '../../../../../types/busho';

export default function BushoDetailPage() {
  const params = useParams();
  const bushoId = params.busho_id as string;

  // 部署データ（実際の実装ではAPIから取得）
  const bushoData: Record<string, Busho> = {
    'seisen-1': {
      id: 'seisen-1',
      name: '製銑・精錬第１課',
      description: '製銑・精錬に関する技術開発、設備管理、品質管理を担当します。',
      category: 'seisen',
      order: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'seisen-2': {
      id: 'seisen-2',
      name: '製銑・精錬第２課',
      description: '製銑・精錬の生産技術向上、新技術導入、効率化を担当します。',
      category: 'seisen',
      order: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'seisen-3': {
      id: 'seisen-3',
      name: '製銑・精錬第３課',
      description: '製銑・精錬の設備保守、安全管理、環境対策を担当します。',
      category: 'seisen',
      order: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'renchu-1': {
      id: 'renchu-1',
      name: '連鋳・圧延プラント設計第１課',
      description: '連鋳・圧延プラントの基本設計、技術仕様策定を担当します。',
      category: 'renchu',
      order: 4,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'renchu-2': {
      id: 'renchu-2',
      name: '連鋳・圧延プラント設計第２課',
      description: '連鋳・圧延プラントの詳細設計、製造図面作成を担当します。',
      category: 'renchu',
      order: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    'renchu-3': {
      id: 'renchu-3',
      name: '連鋳・圧延プラント設計第３課',
      description: '連鋳・圧延プラントの施工管理、品質保証を担当します。',
      category: 'renchu',
      order: 6,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  };

  const busho = bushoData[bushoId];

  if (!busho) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">部署が見つかりません</h1>
          <p className="text-gray-600 mb-6">指定された部署IDが存在しません。</p>
          <a 
            href="/knowledge/kento/busho" 
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            部署一覧に戻る
          </a>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    return category === 'seisen' ? '製銑・精錬部署' : '連鋳・圧延プラント設計部署';
  };

  const getCategoryColor = (category: string) => {
    return category === 'seisen' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="busho-detail-page">
      <Spacer height={80} />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* 戻るボタン */}
        <div className="mb-6">
          <a 
            href="/knowledge/kento/busho" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            部署一覧に戻る
          </a>
        </div>

        {/* 部署詳細情報 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(busho.category)}`}>
              {getCategoryLabel(busho.category)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">{busho.name}</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-8">{busho.description}</p>
          </div>

          {/* 部署情報テーブル */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">部署情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">部署ID</dt>
                <dd className="text-sm text-gray-900">{busho.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">部署名</dt>
                <dd className="text-sm text-gray-900">{busho.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
                <dd className="text-sm text-gray-900">{getCategoryLabel(busho.category)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">表示順序</dt>
                <dd className="text-sm text-gray-900">{busho.order}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">作成日</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(busho.createdAt).toLocaleDateString('ja-JP')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">更新日</dt>
                <dd className="text-sm text-gray-900">
                  {new Date(busho.updatedAt).toLocaleDateString('ja-JP')}
                </dd>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              部署情報を編集
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              部署メンバー管理
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
