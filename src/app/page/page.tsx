'use client';

import React from 'react';
import { Card } from '../../components/cusutom_ui/Card';
import { CardGrid } from '../../components/cusutom_ui/CardGrid';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function PageIndex() {
  const router = useRouter();

  const cardData = [
    {
      title: "ユーザー管理",
      description: "全ユーザーの一覧表示と個別詳細情報の確認ができます。プロジェクト参加状況や担当業務も確認できます。",
      linkText: "ユーザー管理を開く",
      href: "/page/user",
      stylePattern: 'project' as const
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 戻るボタン */}
      <div className="mb-6">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ホームに戻る
        </Button>
      </div>

      {/* ページタイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ページ管理</h1>
        <p className="text-gray-600">各種ページの一覧と管理機能を提供します</p>
      </div>

      {/* カードグリッド */}
      <CardGrid gridPattern="simple">
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
