'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@src/components/cusutom_ui/Card';
import { CardGrid } from '@src/components/cusutom_ui/CardGrid';

export default function KentoPage() {
  const cardData = [
    { 
      title: "設備製番1100 (本体)", 
      description: "高炉本体の検討書を管理します。炉体構造、耐火物、冷却システムなどの技術検討内容を確認できます。", 
      linkText: "本体検討書を開く",
      href: `./1100`,
      stylePattern: 'project' as const
    },
    { 
      title: "設備製番1B00 (炉頂)", 
      description: "高炉炉頂設備の検討書を管理します。装入設備、ガス処理、計装システムなどの技術検討内容を確認できます。", 
      linkText: "炉頂検討書を開く",
      href: `./1B00`,
      stylePattern: 'project' as const
    }
  ];

  return (
    <div className="kento-page">
      <div className="page-header mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">検討書管理</h1>
            <p className="text-gray-600">プロジェクトの技術検討書を設備別に管理します</p>
          </div>
          <Link 
            href="./create"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>新規検討書作成</span>
          </Link>
        </div>
      </div>
      
      <CardGrid gridPattern="default">
        {cardData.map((card, index) => (
          <Card 
            key={index}
            title={card.title}
            description={card.description}
            linkText={card.linkText}
            href={card.href}
            stylePattern={card.stylePattern}
          />
        ))}
      </CardGrid>
    </div>
  );
}
