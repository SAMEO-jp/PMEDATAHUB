'use client';

import React from 'react';
import { Card } from '../../../../../components/cusutom_ui/Card';
import { CardGrid } from '../../../../../components/cusutom_ui/CardGrid';
import { Spacer } from '../../../../../components/cusutom_ui/Spacer';
import { Seiban } from '../../../../../types/seiban';

export default function Seisen1Page() {
  // 製番体系データ
  const seibanData: Seiban[] = [
    {
      id: 'seiban-1100',
      code: '1100',
      name: '製銑・精錬第１課 - 1100',
      description: '製銑・精錬に関する技術開発、設備管理、品質管理を担当します。',
      category: 'seisen-1',
      order: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1b00',
      code: '1B00',
      name: '製銑・精錬第１課 - 1B00',
      description: '製銑・精錬の生産技術向上、新技術導入、効率化を担当します。',
      category: 'seisen-1',
      order: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1300',
      code: '1300',
      name: '製銑・精錬第１課 - 1300',
      description: '製銑・精錬の設備保守、安全管理、環境対策を担当します。',
      category: 'seisen-1',
      order: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1400',
      code: '1400',
      name: '製銑・精錬第１課 - 1400',
      description: '製銑・精錬の品質管理、検査、保証を担当します。',
      category: 'seisen-1',
      order: 4,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1500',
      code: '1500',
      name: '製銑・精錬第１課 - 1500',
      description: '製銑・精錬の材料管理、在庫管理を担当します。',
      category: 'seisen-1',
      order: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1600',
      code: '1600',
      name: '製銑・精錬第１課 - 1600',
      description: '製銑・精錬の物流管理、配送管理を担当します。',
      category: 'seisen-1',
      order: 6,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1700',
      code: '1700',
      name: '製銑・精錬第１課 - 1700',
      description: '製銑・精錬の情報管理、システム管理を担当します。',
      category: 'seisen-1',
      order: 7,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1800',
      code: '1800',
      name: '製銑・精錬第１課 - 1800',
      description: '製銑・精錬の人事管理、教育訓練を担当します。',
      category: 'seisen-1',
      order: 8,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-1900',
      code: '1900',
      name: '製銑・精錬第１課 - 1900',
      description: '製銑・精錬の財務管理、予算管理を担当します。',
      category: 'seisen-1',
      order: 9,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seiban-2000',
      code: '2000',
      name: '製銑・精錬第１課 - 2000',
      description: '製銑・精錬の総合管理、戦略策定を担当します。',
      category: 'seisen-1',
      order: 10,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  return (
    <div className="seisen-1-page">
      <Spacer height={80} />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">製銑・精錬第１課</h1>
        <p className="text-lg text-gray-600">
          製銑・精錬に関する技術開発、設備管理、品質管理を担当する部署です。
        </p>
      </div>

      {/* 戻るボタン */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
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

      {/* 製番体系カード */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          製番体系
        </h2>
        <CardGrid 
          gridPattern="default"
          maxWidth="6xl"
          columns={{ default: 1, sm: 2, lg: 3, xl: 4 }}
          gap={6}
          padding={0}
          paddingTop={0}
        >
          {seibanData.map((seiban) => (
            <Card
              key={seiban.id}
              title={`${seiban.code} - ${seiban.name.split(' - ')[1]}`}
              description={seiban.description}
              linkText={seiban.code === '1100' ? "詳細を見る" : "準備中"}
              href={seiban.code === '1100' ? `/knowledge/kento/busho/seisen-1/${seiban.code}` : '#'}
              stylePattern={seiban.code === '1100' ? "project" : "default"}
              className="h-full"
            />
          ))}
        </CardGrid>
      </div>
    </div>
  );
}
