import React from 'react';
import CardGrid from '@src/components/cusutom_ui/CardGrid';
import Card from '@src/components/cusutom_ui/Card';
import Spacer from '@src/components/cusutom_ui/Spacer';

export default function KnowledgePage() {
  const knowledgeItems = [
    {
      title: '図面',
      description: '設計図面やレイアウト図などの技術図面を管理・閲覧できます。',
      linkText: '図面を見る',
      href: '/knowledge/zumen',
      stylePattern: 'project' as const
    },
    {
      title: '検討書',
      description: '技術検討書や設計検討書などの文書を管理・閲覧できます。',
      linkText: '検討書を見る',
      href: '/knowledge/kento',
      stylePattern: 'table' as const
    },
    {
      title: '技術書',
      description: '技術仕様書やマニュアルなどの技術文書を管理・閲覧できます。',
      linkText: '技術書を見る',
      href: '/knowledge/tech-docs',
      stylePattern: 'default' as const
    },
    {
      title: '要素技術MAP',
      description: '要素技術の関連性や依存関係を可視化したマップを表示します。',
      linkText: 'MAPを見る',
      href: '/knowledge/tech-map',
      stylePattern: 'test' as const
    }
  ];

  return (
    <div className="knowledge-page">
      <Spacer height={80} />
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ナレッジ管理</h1>
        <p className="text-lg text-gray-600">
          技術文書、図面、検討書などを一元管理し、効率的にナレッジを活用できます。
        </p>
      </div>
      
      <CardGrid 
        gridPattern="default"
        maxWidth="6xl"
        columns={{ default: 1, sm: 2, lg: 2, xl: 4 }}
        gap={8}
        padding={0}
        paddingTop={0}
      >
        {knowledgeItems.map((item, index) => (
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
  );
} 