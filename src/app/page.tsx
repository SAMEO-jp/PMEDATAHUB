//本ページは、ホームページで、最初に表示するページです。

'use client';

import React from 'react';
import { Card } from '../components/cusutom_ui/Card';
import { CardGrid } from '../components/cusutom_ui/CardGrid';

export default function HomePage() {
  // 現在の年と月を取得
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()は0ベースなので+1

  const cardData = [
    { 
      title: "プロジェクト管理", 
      description: "プロジェクトの作成、編集、管理、BOM管理を行います。", 
      linkText: "プロジェクト管理を開く",
      href: "/app_project",
      stylePattern: 'project' as const
    },
    { 
      title: "プロジェクト管理アプリ仕様書", 
      description: "プロジェクト管理アプリの仕様書とデモページです。設計内容と機能を確認できます。", 
      linkText: "仕様書・デモを見る",
      href: "/specifications/doc1-project-management/project",
      stylePattern: 'project' as const
    },
    { 
      title: "検討書管理システム仕様書", 
      description: "検討書管理システムの仕様書です。プロジェクト実績としての検討書管理の設計と実装仕様を確認できます。", 
      linkText: "仕様書を見る",
      href: "/specifications/doc2-kentosho-management",
      stylePattern: 'project' as const
    },
    { 
      title: "ナレッジ管理", 
      description: "技術文書、図面、検討書、要素技術MAPなどを一元管理し、効率的にナレッジを活用できます。", 
      linkText: "ナレッジ管理を開く",
      href: "/knowledge",
      stylePattern: 'default' as const
    },
    { 
      title: "部署管理", 
      description: "製銑・精錬部署と連鋳・圧延プラント設計部署の情報を管理し、組織構造を把握できます。", 
      linkText: "部署管理を開く",
      href: "/busho",
      stylePattern: 'data' as const
    },
    { 
      title: "データ表示", 
      description: "月別の実績データを表形式で表示・分析します。フィルタリング、ソート、CSVダウンロード機能を提供します。", 
      linkText: "データ表示を開く",
      href: `/data-display/${currentYear}/${currentMonth}`,
      stylePattern: 'data' as const
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