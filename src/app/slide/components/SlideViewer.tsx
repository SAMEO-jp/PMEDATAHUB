'use client';

import React from 'react';

// Google Apps ScriptのslideData型定義
export interface SlideData {
  type: string;
  title?: string;
  subhead?: string;
  date?: string;
  notes?: string;
  sectionNo?: number;
  // contentタイプ
  points?: string[];
  twoColumn?: boolean;
  contentColumns?: [string[], string[]];
  images?: (string | { url: string; caption?: string })[];
  // compareタイプ
  leftTitle?: string;
  rightTitle?: string;
  leftItems?: string[];
  rightItems?: string[];
  // processタイプ
  steps?: string[];
  // timelineタイプ
  milestones?: { label: string; date: string; state?: 'done' | 'next' | 'todo' }[];
  // diagramタイプ
  lanes?: { title: string; items: string[] }[];
  // cardsタイプ
  cardColumns?: 2 | 3;
  items?: (string | { title: string; desc?: string } | { q: string; a: string })[];
  // headerCardsタイプ
  // tableタイプ
  headers?: string[];
  rows?: string[][];
  // progressタイプ
  // quoteタイプ
  text?: string;
  author?: string;
  // kpiタイプ
  kpiColumns?: 2 | 3 | 4;
  // bulletCardsタイプ
  // faqタイプ
  // statsCompareタイプ
  leftValue?: string;
  rightValue?: string;
  stats?: { label: string; leftValue: string; rightValue: string; trend?: 'up' | 'down' | 'neutral' }[];
  // closingタイプ
}

interface SlideViewerProps {
  slideData: SlideData;
  slideNumber?: number;
  totalSlides?: number;
}

export function SlideViewer({ slideData, slideNumber, totalSlides }: SlideViewerProps) {
  const renderSlide = () => {
    switch (slideData.type) {
      case 'title':
        return <TitleSlide data={slideData} />;
      case 'section':
        return <SectionSlide data={slideData} />;
      case 'content':
        return <ContentSlide data={slideData} />;
      case 'bulletCards':
        return <BulletCardsSlide data={slideData} />;
      case 'compare':
        return <CompareSlide data={slideData} />;
      case 'process':
        return <ProcessSlide data={slideData} />;
      case 'faq':
        return <FaqSlide data={slideData} />;
      case 'closing':
        return <ClosingSlide data={slideData} />;
      default:
        return <DefaultSlide data={slideData} />;
    }
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      {/* スライドコンテンツ */}
      <div className="w-full h-full p-6">
        {renderSlide()}
      </div>

      {/* フッター */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-gray-500">
        <span>© 2025 Google Inc.</span>
        {slideNumber && totalSlides && (
          <span>{slideNumber} / {totalSlides}</span>
        )}
      </div>

      {/* ノート表示（オプション） */}
      {slideData.notes && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-100 p-4 text-sm text-gray-700 border-t">
          <strong>発表者ノート:</strong> {slideData.notes}
        </div>
      )}
    </div>
  );
}

// タイトルスライド
function TitleSlide({ data }: { data: SlideData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* ロゴ（仮） */}
      <div className="w-24 h-24 bg-blue-600 rounded-full mb-8 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">G</span>
      </div>

      {/* タイトル */}
      <h1 className="text-5xl font-bold text-gray-900 text-center mb-8 leading-tight">
        {data.title}
      </h1>

      {/* 日付 */}
      {data.date && (
        <p className="text-xl text-gray-600">
          {data.date}
        </p>
      )}
    </div>
  );
}

// 章扉スライド
function SectionSlide({ data }: { data: SlideData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
      {/* 章番号（透かし） */}
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-gray-200 opacity-30">
        {data.sectionNo || '1'}
      </div>

      {/* 章タイトル */}
      <h1 className="text-6xl font-bold text-gray-900 text-center relative z-10">
        {data.title}
      </h1>
    </div>
  );
}

// コンテンツスライド
function ContentSlide({ data }: { data: SlideData }) {
  return (
    <div className="h-full">
      {/* ヘッダーロゴ */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-sm font-bold">G</span>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        {data.subhead && (
          <p className="text-lg text-gray-600">{data.subhead}</p>
        )}
        {/* タイトル下線 */}
        <div className="w-32 h-1 bg-blue-600 mt-4"></div>
      </div>

      {/* コンテンツエリア */}
      <div className="space-y-4">
        {data.points && data.points.map((point, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="text-blue-600 mt-1">•</span>
            <span className="text-gray-700">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 箇条書きカードスライド
function BulletCardsSlide({ data }: { data: SlideData }) {
  return (
    <div className="h-full">
      {/* ヘッダーロゴ */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-sm font-bold">G</span>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        {data.subhead && (
          <p className="text-lg text-gray-600">{data.subhead}</p>
        )}
        {/* タイトル下線 */}
        <div className="w-32 h-1 bg-blue-600 mt-4"></div>
      </div>

      {/* カードグリッド */}
      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {Array.isArray(data.items) && data.items.slice(0, 3).map((item, index) => {
          if (typeof item === 'string') {
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item}
                </h3>
              </div>
            );
          } else if ('title' in item) {
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                {item.desc && (
                  <p className="text-gray-700">{item.desc}</p>
                )}
              </div>
            );
          } else if ('q' in item) {
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  Q. {item.q}
                </h3>
                <p className="text-gray-700">A. {item.a}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// 比較スライド
function CompareSlide({ data }: { data: SlideData }) {
  return (
    <div className="h-full">
      {/* ヘッダーロゴ */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-sm font-bold">G</span>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        {data.subhead && (
          <p className="text-lg text-gray-600">{data.subhead}</p>
        )}
        {/* タイトル下線 */}
        <div className="w-32 h-1 bg-blue-600 mt-4"></div>
      </div>

      {/* 比較エリア */}
      <div className="grid grid-cols-2 gap-8 h-96">
        {/* 左側 */}
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold text-center mb-4 text-blue-600">
            {data.leftTitle}
          </h3>
          <div className="space-y-3">
            {data.leftItems && data.leftItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 右側 */}
        <div className="bg-gray-50 rounded-lg p-6 border">
          <h3 className="text-xl font-semibold text-center mb-4 text-blue-600">
            {data.rightTitle}
          </h3>
          <div className="space-y-3">
            {data.rightItems && data.rightItems.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-gray-600 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// プロセススライド
function ProcessSlide({ data }: { data: SlideData }) {
  return (
    <div className="h-full">
      {/* ヘッダーロゴ */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-sm font-bold">G</span>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        {data.subhead && (
          <p className="text-lg text-gray-600">{data.subhead}</p>
        )}
        {/* タイトル下線 */}
        <div className="w-32 h-1 bg-blue-600 mt-4"></div>
      </div>

      {/* プロセスエリア */}
      <div className="flex items-center justify-center space-x-8 mt-16">
        {data.steps && data.steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* ステップ番号 */}
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">{index + 1}</span>
            </div>
            {/* ステップテキスト */}
            <p className="text-center text-gray-700 max-w-32">{step}</p>
          </div>
        ))}
      </div>

      {/* 接続線（簡易） */}
      {data.steps && data.steps.length > 1 && (
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-2xl h-1 bg-gray-300 relative">
            <div className="absolute top-0 left-0 right-0 h-full bg-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// FAQスライド
function FaqSlide({ data }: { data: SlideData }) {
  return (
    <div className="h-full">
      {/* ヘッダーロゴ */}
      <div className="absolute top-4 right-4 w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
        <span className="text-white text-sm font-bold">G</span>
      </div>

      {/* タイトル */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {data.title}
        </h1>
        {data.subhead && (
          <p className="text-lg text-gray-600">{data.subhead}</p>
        )}
        {/* タイトル下線 */}
        <div className="w-32 h-1 bg-blue-600 mt-4"></div>
      </div>

      {/* FAQリスト */}
      <div className="space-y-6 max-w-4xl">
        {Array.isArray(data.items) && data.items.slice(0, 4).map((item, index) => {
          if (typeof item === 'object' && 'q' in item && 'a' in item) {
            return (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  Q. {item.q}
                </h3>
                <p className="text-gray-700 pl-4">
                  A. {item.a}
                </p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// クロージングスライド
function ClosingSlide({ data }: { data: SlideData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* ロゴ */}
      <div className="w-32 h-32 bg-blue-600 rounded-full mb-8 flex items-center justify-center">
        <span className="text-white text-4xl font-bold">G</span>
      </div>

      {/* メッセージ */}
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
        ご清聴ありがとうございました
      </h1>

      {/* 追加メッセージ */}
      {data.notes && (
        <p className="text-xl text-gray-600 text-center max-w-2xl">
          {data.notes}
        </p>
      )}
    </div>
  );
}

// デフォルトスライド（未実装のタイプ用）
function DefaultSlide({ data }: { data: SlideData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {data.title || 'スライド'}
        </h1>
        <p className="text-gray-600">
          タイプ: {data.type} (未実装)
        </p>
      </div>
    </div>
  );
}
