'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Calendar, Eye } from 'lucide-react';

interface SlidePage {
  name: string;
  path: string;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function SlideMainPage() {
  const [slidePages, setSlidePages] = useState<SlidePage[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newSlideName, setNewSlideName] = useState('');
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideDescription, setNewSlideDescription] = useState('');

  // サンプルプレゼンテーションのデータを取得
  useEffect(() => {
    const sampleSlides: SlidePage[] = [
      {
        name: 'sample-presentation',
        path: '/slide/slidepage/sample-presentation',
        title: 'サンプルプレゼンテーション',
        description: '高速スライド生成システムのデモンストレーション',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      }
    ];
    setSlidePages(sampleSlides);
  }, []);

  const handleCreateSlide = () => {
    if (!newSlideName.trim()) return;

    // 新しいスライドページの作成ロジック
    const newSlide: SlidePage = {
      name: newSlideName,
      path: `/slide/slidepage/${newSlideName}`,
      title: newSlideTitle || newSlideName,
      description: newSlideDescription,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setSlidePages(prev => [...prev, newSlide]);
    setNewSlideName('');
    setNewSlideTitle('');
    setNewSlideDescription('');
    setIsCreateDialogOpen(false);

    // 実際のファイル作成（開発環境では手動作成が必要）
    alert(`スライドページ「${newSlideName}」が作成されました。\n\n実際のファイル作成には以下の手順が必要です：\n1. src/app/slide/slidepage/${newSlideName}/ フォルダを作成\n2. page.tsx と slideData.json ファイルを配置\n\nまたは、ジェネレーターから直接作成してください。`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 高速スライド生成システム
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            GEMINIのシステムプロンプトをNext.jsで高速利用
          </p>
          <div className="flex justify-center gap-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-5 h-5 mr-2" />
                  新規スライド作成
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>新規スライド作成</DialogTitle>
                  <DialogDescription>
                    新しいスライドページを作成します。フォルダ名と基本情報を入力してください。
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="slide-name" className="text-right">
                      フォルダ名
                    </Label>
                    <Input
                      id="slide-name"
                      value={newSlideName}
                      onChange={(e) => setNewSlideName(e.target.value)}
                      className="col-span-3"
                      placeholder="例: my-presentation"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="slide-title" className="text-right">
                      タイトル
                    </Label>
                    <Input
                      id="slide-title"
                      value={newSlideTitle}
                      onChange={(e) => setNewSlideTitle(e.target.value)}
                      className="col-span-3"
                      placeholder="プレゼンテーションのタイトル"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="slide-description" className="text-right">
                      説明
                    </Label>
                    <Textarea
                      id="slide-description"
                      value={newSlideDescription}
                      onChange={(e) => setNewSlideDescription(e.target.value)}
                      className="col-span-3"
                      placeholder="プレゼンテーションの説明"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleCreateSlide}>
                    作成
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Link href="/slide/generator">
              <Button variant="outline" size="lg">
                <FileText className="w-5 h-5 mr-2" />
                スライドジェネレーター
              </Button>
            </Link>
          </div>
        </div>

        {/* スライドページ一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slidePages.map((slide) => (
            <Card key={slide.name} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  {slide.title || slide.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4" />
                  作成日: {slide.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {slide.description || '説明なし'}
                </p>
                <div className="flex gap-2">
                  <Link href={slide.path}>
                    <Button size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      表示
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    編集
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 機能説明 */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">高速生成</h3>
            <p className="text-gray-600">
              Google Apps Scriptの実行時間を待たずに、ブラウザ上で直接スライドを生成・表示
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">リアルタイムプレビュー</h3>
            <p className="text-gray-600">
              テキスト入力から即座にスライドを生成し、リアルタイムでプレビュー可能
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">柔軟な管理</h3>
            <p className="text-gray-600">
              任意のフォルダ名でスライドページを作成し、独立して管理可能
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Google Apps Scriptのプレゼンテーション生成機能をNext.jsで再現
          </p>
        </div>
      </div>
    </div>
  );
}
