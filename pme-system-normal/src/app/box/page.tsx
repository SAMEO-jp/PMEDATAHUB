/**
 * @file BOXメニュー画面
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Button } from '@src/components/ui/button';
import Link from 'next/link';
import { 
  Database, 
  FileText, 
  MapPin,
  ArrowRight,
  Box,
  Settings
} from 'lucide-react';

export default function BoxMenuPage() {
  const menuItems = [
    {
      title: '全BOXITEMを表示',
      description: 'sync.dbのbox_itemテーブルの全データを表示・検索・管理します',
      icon: Database,
      href: '/box/boxall',
      color: 'bg-blue-500 hover:bg-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      title: '要素技術MAPデータ登録',
      description: '要素技術マップのデータを登録・編集します',
      icon: MapPin,
      href: '/box/tech-map',
      color: 'bg-green-500 hover:bg-green-600',
      iconColor: 'text-green-600'
    },
    {
      title: '要素技術ナレッジデータ表示',
      description: '要素技術ナレッジのデータを表示・検索します',
      icon: FileText,
      href: '/box/tech-knowledge',
      color: 'bg-purple-500 hover:bg-purple-600',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="container mx-auto p-6">
      {/* ページヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Box className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">BOX管理システム</h1>
            <p className="text-muted-foreground">
              データベース管理と要素技術情報の統合システム
            </p>
          </div>
        </div>
        <div className="h-px bg-border" />
      </div>

      {/* メニューグリッド */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                    <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                <CardDescription className="mb-4 text-sm leading-relaxed">
                  {item.description}
                </CardDescription>
                <Link href={item.href}>
                  <Button className={`w-full ${item.color} text-white`}>
                    アクセス
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* システム情報 */}
      <div className="mt-12">
        <Card className="bg-gray-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">システム情報</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-muted-foreground">データベース</div>
                <div>sync.db (SQLite3)</div>
              </div>
              <div>
                <div className="font-semibold text-muted-foreground">API</div>
                <div>tRPC v11</div>
              </div>
              <div>
                <div className="font-semibold text-muted-foreground">フレームワーク</div>
                <div>Next.js 14</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
