'use client';

import React from 'react';
import { Card } from '../../../../components/cusutom_ui/Card';
import { CardGrid } from '../../../../components/cusutom_ui/CardGrid';
import { Spacer } from '../../../../components/cusutom_ui/Spacer';
import { Busho } from '../../../../types/busho';

export default function BushoPage() {
  // 部署データ
  const bushoData: Busho[] = [
    {
      id: 'seisen-1',
      name: '製銑・精錬第１課',
      description: '製銑・精錬に関する技術開発、設備管理、品質管理を担当します。',
      category: 'seisen',
      order: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seisen-2',
      name: '製銑・精錬第２課',
      description: '製銑・精錬の生産技術向上、新技術導入、効率化を担当します。',
      category: 'seisen',
      order: 2,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'seisen-3',
      name: '製銑・精錬第３課',
      description: '製銑・精錬の設備保守、安全管理、環境対策を担当します。',
      category: 'seisen',
      order: 3,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'renchu-1',
      name: '連鋳・圧延プラント設計第１課',
      description: '連鋳・圧延プラントの基本設計、技術仕様策定を担当します。',
      category: 'renchu',
      order: 4,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'renchu-2',
      name: '連鋳・圧延プラント設計第２課',
      description: '連鋳・圧延プラントの詳細設計、製造図面作成を担当します。',
      category: 'renchu',
      order: 5,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'renchu-3',
      name: '連鋳・圧延プラント設計第３課',
      description: '連鋳・圧延プラントの施工管理、品質保証を担当します。',
      category: 'renchu',
      order: 6,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  // 部署をカテゴリ別にグループ化
  const seisenBusho = bushoData.filter(b => b.category === 'seisen');
  const renchuBusho = bushoData.filter(b => b.category === 'renchu');

  return (
    <div className="busho-page">
      <Spacer height={80} />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">部署管理</h1>
        <p className="text-lg text-gray-600">
          各部署の情報を管理し、組織構造を把握できます。
        </p>
      </div>

      {/* 製銑・精錬部署 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          製銑・精錬部署
        </h2>
        <CardGrid 
          gridPattern="default"
          maxWidth="6xl"
          columns={{ default: 1, sm: 2, lg: 3 }}
          gap={6}
          padding={0}
          paddingTop={0}
        >
          {seisenBusho.map((busho) => (
            <Card
              key={busho.id}
              title={busho.name}
              description={busho.description}
              linkText="詳細を見る"
              href={`/busho/${busho.id}`}
              stylePattern="project"
              className="h-full"
            />
          ))}
        </CardGrid>
      </div>

      {/* 連鋳・圧延プラント設計部署 */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          連鋳・圧延プラント設計部署
        </h2>
        <CardGrid 
          gridPattern="default"
          maxWidth="6xl"
          columns={{ default: 1, sm: 2, lg: 3 }}
          gap={6}
          padding={0}
          paddingTop={0}
        >
          {renchuBusho.map((busho) => (
            <Card
              key={busho.id}
              title={busho.name}
              description={busho.description}
              linkText="詳細を見る"
              href={`/busho/${busho.id}`}
              stylePattern="table"
              className="h-full"
            />
          ))}
        </CardGrid>
      </div>
    </div>
  );
}
