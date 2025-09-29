//本ページは、管理ページで、システム全体の管理機能を提供します。

'use client';

import React from 'react';
import { Card } from '../../components/cusutom_ui/Card';
import { CardGrid } from '../../components/cusutom_ui/CardGrid';
import { useAuthContext } from '@/contexts/AuthContext';
import { getYearAndWeek } from '@/utils/dateUtils';

export default function ManagePage() {
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
      title: "ユーザー管理",
      description: "全ユーザーの一覧表示と個別詳細情報の確認ができます。プロジェクト参加状況や担当業務も確認できます。",
      linkText: "ユーザー管理を開く",
      href: "/page/user",
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
      title: "実績入力",
      description: "週単位でのイベント管理と実績入力を行います。プロジェクトの進捗状況や作業内容を記録できます。",
      linkText: "実績入力を開く",
      href: getZissekiDemoUrl(),
      stylePattern: 'demo' as const
    },
    {
      title: "ページ管理",
      description: "各種ページの一覧と管理機能を提供します。ユーザー情報やシステム設定などにアクセスできます。",
      linkText: "ページ管理を開く",
      href: "/page",
      stylePattern: 'default' as const
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
