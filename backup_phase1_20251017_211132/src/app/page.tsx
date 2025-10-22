//本ページは、ホームページで、最初に表示するページです。

'use client';

import React from 'react';
import { Card } from '../components/cusutom_ui/Card';
import { CardGrid } from '../components/cusutom_ui/CardGrid';
import { useAuthContext } from '@/contexts/AuthContext';
import { getYearAndWeek } from '@/utils/dateUtils';

export default function HomePage() {
  // 認証コンテキストを取得
  const { isAuthenticated } = useAuthContext();
  
  // 現在の年と月を取得
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth()は0ベースなので+1
  
  // 実績デモのURLを動的に生成
  const getZissekiDemoUrl = () => {
    if (isAuthenticated) {
      // ログイン済みの場合：現在の年・週
      const { year, week } = getYearAndWeek();
      return `/zisseki-demo/${year}/${week}`;
    } else {
      // 未ログインの場合：デフォルト
      return '/zisseki-demo/2024/1';
    }
  };

  const cardData = [
    {
      title: "実績入力",
      description: "週単位でのイベント管理と実績入力を行います。プロジェクトの進捗状況や作業内容を記録できます。",
      linkText: "実績入力を開く",
      href: getZissekiDemoUrl(),
      stylePattern: 'demo' as const
    },
    { 
      title: "データ表示", 
      description: "月別の実績データを表形式で表示・分析します。フィルタリング、ソート、CSVダウンロード機能を提供します。", 
      linkText: "データ表示を開く",
      href: `/data-display/${currentYear}/${currentMonth}`,
      stylePattern: 'data' as const
    },
    {
      title: "管理",
      description: "システム全体の管理機能を提供します。プロジェクト管理、ユーザー管理、データ管理などの統合管理画面です。",
      linkText: "管理画面を開く",
      href: "/manage",
      stylePattern: 'admin' as const
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