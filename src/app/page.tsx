//本ページは、ホームページで、最初に表示するページです。


'use client';

import React from 'react';
import Link from 'next/link';

// カードコンポーネント
const Card = ({ title, description, linkText, href }: { 
  title: string; 
  description: string; 
  linkText: string;
  href: string;
}) => {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <Link href={href} className="card-link">
        <span>{linkText}</span>
        <span className="material-symbols-outlined">arrow_forward</span>
      </Link>
    </div>
  );
};

export default function HomePage() {
  const cardData = [
/*    { 
      title: "BOM管理", 
      description: "BOMの作成、編集、管理を行います。", 
      linkText: "BOM管理を開く",
      href: "/app_project"
    },
*/

{ 
  title: "プロジェクト管理", 
  description: "プロジェクトの作成、編集、管理、BOM管理を行います。", 
  linkText: "プロジェクト管理を開く",
  href: "/app_project"
},

    { 
      title: "テーブル管理", 
      description: "テーブルの作成、編集、管理を行います。", 
      linkText: "テーブル管理を開く",
      href: "/test"
    },
    
    { 
      title: "テストページ", 
      description: "各機能のテストページです。", 
      linkText: "テストページを開く",
      href: "/test"
    }
  ];

  return (
    <div className="min-h-screen flex items-start justify-center pt-28 p-4">
      <div className="card-container max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((card, index) => (
          <Card 
            key={index}
            title={card.title}
            description={card.description}
            linkText={card.linkText}
            href={card.href}
          />
        ))}
      </div>
    </div>
  );
}