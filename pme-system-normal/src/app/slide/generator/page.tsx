'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TextArea } from '@/components/ui/TextArea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SlideViewer, SlideData } from '../components/SlideViewer';

export default function SlideGeneratorPage() {
  const [inputText, setInputText] = useState('');
  const [presentationTitle, setPresentationTitle] = useState('');
  const [presentationDate, setPresentationDate] = useState('');
  const [generatedSlides, setGeneratedSlides] = useState<SlideData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewSlide, setPreviewSlide] = useState(0);

  // サンプルテキスト
  const sampleText = `会議議事録

日時: 2025年1月1日
場所: 会議室A
参加者: 山田太郎、鈴木花子、佐藤次郎

議題1: 新プロジェクトの開始について
- プロジェクトの目的と目標を明確化した
- チームメンバーの役割分担を決定した
- スケジュールの策定を開始した

議題2: 予算配分の見直し
- 前年度比10%の増額を承認
- 優先順位の高い施策に重点配分
- コスト削減策の検討を開始

今後のアクション
1. 詳細計画書の作成（担当: 山田）
2. 関係者への周知（担当: 鈴木）
3. 進捗確認ミーティングの設定（担当: 佐藤）

結論
- 新プロジェクトを承認し、2月1日より開始
- 予算配分を決定し、実行に移す`;

  // slideData生成関数（簡易版）
  const generateSlideData = (text: string, title: string, date: string): SlideData[] => {
    const slides: SlideData[] = [];

    // タイトルスライド
    slides.push({
      type: 'title',
      title: title || 'プレゼンテーション',
      date: date || new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      notes: '本プレゼンテーションの概要をご説明します。'
    });

    // テキストを解析してコンテンツスライドを生成
    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = '';
    let currentPoints: string[] = [];

    for (const line of lines) {
      if (line.includes('議題') || line.includes(':')) {
        // 新しいセクションを開始
        if (currentPoints.length > 0) {
          slides.push({
            type: 'content',
            title: currentSection || '内容',
            points: currentPoints,
            notes: `${currentSection}について説明します。`
          });
          currentPoints = [];
        }
        currentSection = line.replace(/^.*[:：]/, '').trim();
      } else if (line.startsWith('-') || line.startsWith('•')) {
        // 箇条書きを追加
        currentPoints.push(line.replace(/^[-•]\s*/, ''));
      } else if (line.trim()) {
        // その他の行
        if (currentPoints.length === 0) {
          currentSection = line;
        }
      }
    }

    // 最後のセクションを追加
    if (currentPoints.length > 0) {
      slides.push({
        type: 'content',
        title: currentSection || '内容',
        points: currentPoints,
        notes: `${currentSection}について説明します。`
      });
    }

    // 章スライドを追加
    if (slides.length > 2) {
      slides.splice(1, 0, {
        type: 'section',
        title: '詳細内容',
        sectionNo: 1,
        notes: '詳細な内容について説明していきます。'
      });
    }

    // クロージングスライド
    slides.push({
      type: 'closing',
      notes: '本プレゼンテーションは以上です。ご清聴ありがとうございました。'
    });

    return slides;
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);

    // 実際のAI生成をシミュレート
    setTimeout(() => {
      const slides = generateSlideData(inputText, presentationTitle, presentationDate);
      setGeneratedSlides(slides);
      setIsGenerating(false);
    }, 2000);
  };

  const handleLoadSample = () => {
    setInputText(sampleText);
    setPresentationTitle('会議議事録プレゼンテーション');
    setPresentationDate('2025.01.01');
  };

  const exportSlideData = () => {
    const dataStr = JSON.stringify(generatedSlides, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'generated_slideData.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/slide">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              スライド一覧に戻る
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 高速スライドジェネレーター
          </h1>
          <p className="text-gray-600">
            テキストを入力するだけで、Google Apps Script互換のslideDataを生成します
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 入力エリア */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  プレゼンテーション情報
                </CardTitle>
                <CardDescription>
                  基本情報を入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">プレゼンテーションタイトル</Label>
                  <Input
                    id="title"
                    value={presentationTitle}
                    onChange={(e) => setPresentationTitle(e.target.value)}
                    placeholder="例: 会議議事録プレゼンテーション"
                  />
                </div>
                <div>
                  <Label htmlFor="date">日付</Label>
                  <Input
                    id="date"
                    type="date"
                    value={presentationDate}
                    onChange={(e) => setPresentationDate(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>テキスト入力</CardTitle>
                <CardDescription>
                  議事録、記事、企画書などのテキストを入力してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="ここにテキストを入力してください..."
                  className="w-full min-h-64 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleLoadSample}>
                    サンプル読み込み
                  </Button>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !inputText.trim()}
                    className="flex-1"
                  >
                    {isGenerating ? '生成中...' : 'スライド生成'}
                  </Button>
                </div>

                {generatedSlides.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label>保存先フォルダ名</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="例: my-presentation"
                        value={presentationTitle.toLowerCase().replace(/\s+/g, '-')}
                      />
                      <Button variant="outline">
                        保存して公開
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      保存すると /slide/slidepage/[フォルダ名]/ でアクセス可能になります
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 結果エリア */}
          <div className="space-y-6">
            {generatedSlides.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      生成結果
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportSlideData}>
                          <Download className="w-4 h-4 mr-1" />
                          エクスポート
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {generatedSlides.length}枚のスライドが生成されました
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={`slide-${previewSlide}`} className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        {generatedSlides.slice(0, 4).map((_, index) => (
                          <TabsTrigger
                            key={index}
                            value={`slide-${index}`}
                            onClick={() => setPreviewSlide(index)}
                          >
                            スライド{index + 1}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <TabsContent value={`slide-${previewSlide}`} className="mt-4">
                        <div className="bg-white rounded-lg border overflow-hidden">
                          <div className="h-96">
                            <SlideViewer
                              slideData={generatedSlides[previewSlide]}
                              slideNumber={previewSlide + 1}
                              totalSlides={generatedSlides.length}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>生成されたJSONデータ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-64">
                      {JSON.stringify(generatedSlides, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </>
            )}

            {generatedSlides.length === 0 && !isGenerating && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Eye className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    スライドが生成されていません
                  </h3>
                  <p className="text-gray-600 text-center">
                    左側のフォームにテキストを入力して、スライドを生成してください。
                  </p>
                </CardContent>
              </Card>
            )}

            {isGenerating && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    スライドを生成中...
                  </h3>
                  <p className="text-gray-600">
                    AIが最適なプレゼンテーション構造を分析しています
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
