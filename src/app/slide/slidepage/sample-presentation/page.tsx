'use client';

import { useState, useEffect } from 'react';
import { SlideViewer, SlideData } from '../../components/SlideViewer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, Download } from 'lucide-react';
import Link from 'next/link';

// サンプルスライドデータ（実際にはslideData.jsonから読み込む）
const sampleSlideData: SlideData[] = [
  {
    type: 'title',
    title: '高速スライド生成システム',
    date: '2025.01.01',
    notes: 'Google Apps Scriptのプレゼンテーション機能をNext.jsで再現したデモンストレーションです。'
  },
  {
    type: 'content',
    title: 'システム概要',
    subhead: 'GEMINIのプロンプトをWebアプリケーション化',
    points: [
      'Google Apps ScriptのslideData生成機能をブラウザで直接実行',
      'リアルタイムプレビューで高速なスライド作成が可能',
      'Next.js + TypeScriptで堅牢な実装',
      'Googleのデザイン原則に準拠した美しいUI'
    ],
    notes: 'このシステムは、GEMINIで使用していたプレゼンテーション生成機能を、Webブラウザ上で直接利用できるようにしたものです。'
  },
  {
    type: 'section',
    title: '主な機能',
    sectionNo: 1,
    notes: 'この章では、システムの主な機能を紹介します。'
  },
  {
    type: 'bulletCards',
    title: '3つの特徴',
    subhead: '高速・柔軟・忠実なスライド生成',
    items: [
      {
        title: '🚀 高速生成',
        desc: 'Google Apps Scriptの実行時間を待たずに、ブラウザ上で直接スライドを生成・表示します。'
      },
      {
        title: '🔧 柔軟な管理',
        desc: '任意のフォルダ名でスライドページを作成し、独立して管理することができます。'
      },
      {
        title: '🎨 忠実な再現',
        desc: 'Google Apps Scriptのテンプレートを完全再現し、同じ品質のスライドを生成します。'
      }
    ],
    notes: 'このシステムの3つの主要な特徴をご紹介します。それぞれが異なるニーズに対応しています。'
  },
  {
    type: 'compare',
    title: '比較: GAS vs Web版',
    subhead: '実行速度と使い勝手の違い',
    leftTitle: 'Google Apps Script',
    rightTitle: '高速Web版',
    leftItems: [
      'スプレッドシートからの実行が必要',
      'API実行時間が6分以内に制限',
      'オフライン作業が難しい',
      '同時編集が制限される'
    ],
    rightItems: [
      'ブラウザから直接実行可能',
      '即時プレビューが可能',
      'オフラインでも基本機能が利用可能',
      '複数プレゼンテーションの同時作成が可能'
    ],
    notes: '従来のGAS版と比較して、Web版は大幅に使い勝手が向上しています。特に実行速度の面で大きな改善が見られます。'
  },
  {
    type: 'process',
    title: '作成手順',
    subhead: 'スライド作成の流れ',
    steps: [
      'テキスト入力または既存データを読み込み',
      'slideData形式に自動変換',
      'リアルタイムプレビューで確認',
      '必要に応じて編集・調整',
      '任意のフォルダに保存して公開'
    ],
    notes: 'スライド作成は5つの簡単なステップで完了します。従来のGAS版に比べて格段に使いやすくなっています。'
  },
  {
    type: 'faq',
    title: 'よくある質問',
    subhead: '利用に関するQ&A',
    items: [
      {
        q: '既存のGASスクリプトとの互換性はありますか？',
        a: 'はい、slideDataのJSON形式はGAS版と完全に互換性があります。既存のデータをそのまま利用できます。'
      },
      {
        q: 'オフラインでも利用できますか？',
        a: '基本的なスライド作成・編集機能はオフラインでも利用可能です。ただし、一部の高度な機能はオンライン接続が必要です。'
      },
      {
        q: '作成したスライドをGASで利用できますか？',
        a: 'はい、生成したslideDataをGASスクリプトにコピーして利用することができます。逆方向の互換性も保証されています。'
      }
    ],
    notes: 'ご利用にあたってよくいただく質問をまとめました。ご不明な点がございましたら、お気軽にお問い合わせください。'
  },
  {
    type: 'closing',
    notes: '本デモンストレーションは以上です。このシステムにより、プレゼンテーション作成がより効率的で快適になることを願っています。'
  }
];

export default function SamplePresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideData, setSlideData] = useState<SlideData[]>(sampleSlideData);

  // JSONファイルからデータを読み込む（実際の使用時は有効化）
  useEffect(() => {
    // const loadSlideData = async () => {
    //   try {
    //     const response = await fetch('/slide/slidepage/sample-presentation/slideData.json');
    //     const data = await response.json();
    //     setSlideData(data);
    //   } catch (error) {
    //     console.error('Failed to load slide data:', error);
    //   }
    // };
    // loadSlideData();
  }, []);

  const nextSlide = () => {
    if (currentSlide < slideData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < slideData.length) {
      setCurrentSlide(index);
    }
  };

  const exportSlideData = () => {
    const dataStr = JSON.stringify(slideData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = 'slideData.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!slideData || slideData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">スライドデータを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ヘッダーコントロール */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/slide">
              <Button variant="outline" size="sm">
                <Home className="w-4 h-4 mr-2" />
                スライド一覧に戻る
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">
              サンプルプレゼンテーション
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportSlideData}
            >
              <Download className="w-4 h-4 mr-2" />
              JSONエクスポート
            </Button>
            <span className="text-sm text-gray-600">
              {currentSlide + 1} / {slideData.length}
            </span>
          </div>
        </div>
      </div>

      {/* スライド表示エリア */}
      <div className="flex-1 relative">
        <div className="w-full h-[calc(100vh-80px)] max-w-7xl mx-auto bg-white shadow-lg">
          <SlideViewer
            slideData={slideData[currentSlide]}
            slideNumber={currentSlide + 1}
            totalSlides={slideData.length}
          />
        </div>

        {/* ナビゲーションコントロール */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white rounded-full shadow-lg px-6 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* スライドサムネイル（簡易版） */}
          <div className="flex gap-1">
            {slideData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide
                    ? 'bg-blue-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slideData.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* キーボードショートカット */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-500 bg-white rounded px-2 py-1 shadow">
        キーボード: ← → で移動
      </div>
    </div>
  );
}



