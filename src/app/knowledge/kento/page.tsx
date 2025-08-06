import React from 'react';
import Link from 'next/link';
import CardGrid from '@src/components/cusutom_ui/CardGrid';
import Card from '@src/components/cusutom_ui/Card';
import Spacer from '@src/components/cusutom_ui/Spacer';

export default function KentoPage() {
  const kentoMenuItems = [
    {
      title: '代表検討書',
      description: 'プロジェクト全体の代表的な検討書を管理・閲覧できます。',
      linkText: '代表検討書を見る',
      href: '/knowledge/kento/representative',
      stylePattern: 'project' as const
    },
    {
      title: '個別検討書',
      description: '各機能やモジュールの個別検討書を管理・閲覧できます。',
      linkText: '個別検討書を見る',
      href: '/knowledge/kento/individual',
      stylePattern: 'table' as const
    }
  ];

  return (
    <div className="kento-page p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/knowledge" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← ナレッジ管理に戻る
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">検討書管理</h1>
          <p className="text-lg text-gray-600">
            技術検討書や設計検討書などの文書を管理・閲覧できます。
          </p>
        </div>
        
        <Spacer height={40} />
        
        <CardGrid 
          gridPattern="default"
          maxWidth="4xl"
          columns={{ default: 1, sm: 2, lg: 2 }}
          gap={8}
          padding={0}
          paddingTop={0}
        >
          {kentoMenuItems.map((item, index) => (
            <Card
              key={index}
              title={item.title}
              description={item.description}
              linkText={item.linkText}
              href={item.href}
              stylePattern={item.stylePattern}
              className="h-full"
            />
          ))}
        </CardGrid>
      </div>
    </div>
  );
} 