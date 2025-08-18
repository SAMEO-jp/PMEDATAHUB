//本ページは、ホームページで、最初に表示するページです。

'use client';

import React from 'react';
import { Card } from '../components/cusutom_ui/Card';
import { CardGrid } from '../components/cusutom_ui/CardGrid';

export default function HomePage() {
  const cardData = [
    { 
      title: "プロジェクト管理", 
      description: "プロジェクトの作成、編集、管理、BOM管理を行います。", 
      linkText: "プロジェクト管理を開く",
      href: "/app_project",
      stylePattern: 'project' as const
    },
    { 
      title: "テーブル管理", 
      description: "テーブルの作成、編集、管理を行います。", 
      linkText: "テーブル管理を開く",
      href: "/test",
      stylePattern: 'table' as const
    },
    { 
      title: "実績デモ", 
      description: "実績入力システムのデモページです。週単位でのイベント管理機能を提供します。", 
      linkText: "実績デモを開く",
      href: "/zisseki-demo/2024/1",
      stylePattern: 'demo' as const
    },
    { 
      title: "テストページ", 
      description: "各機能のテストページです。", 
      linkText: "テストページを開く",
      href: "/test",
      stylePattern: 'test' as const
    }
  ];

  return (
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
  );
}