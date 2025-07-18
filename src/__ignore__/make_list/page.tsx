'use client';

// ==========================================
// ファイル名: page.tsx
// 機能: 部品単位管理ページ - 部品リストの表示・管理・単位ID作成
// 技術: React Hooks, Next.js App Router, TanStack Table + Shadcn UI, Tailwind CSS
// ルール: table.mdc - TanStack Table + Shadcn UI組み合わせルール適用
// ==========================================

// ==========================================
// インポート層
// ==========================================
// 1. React関連（必ず最初）
import React, { useState, useCallback } from 'react';
// 2. Next.js関連
import { useParams } from 'next/navigation';
// 3. Shadcn UI関連
import { Card, CardContent } from '@ui/card';
import { Button } from '@ui/button';
// 4. 外部ライブラリ（アルファベット順）
import { RefreshCw } from 'lucide-react';
// 5. 内部コンポーネント（階層順）
import { KonpoTable } from './components';
// 6. 型定義・設定（最後）
import { useKonpoData, useKonpoActions } from './hooks';

// ==========================================
// 型定義層（Props, 内部型, API型）
// ==========================================
// 必要に応じて型定義を追加

// ==========================================
// パラメータとルーティング層
// ==========================================
/**
 * 部品単位管理ページ
 * TanStack Table + Shadcn UIの組み合わせで実装されたテーブル機能を提供
 * データ処理ロジックはTanStack Table、UI表示はShadcn UIで分離
 */
export default function MakeTanniPage() {
  const params = useParams();
  const projectId = params.project_id as string;

  // ==========================================
  // 状態管理層
  // ==========================================
  const [activeTab, setActiveTab] = useState<'all' | 'with-list' | 'without-list'>('all');

  // ==========================================
  // データ取得層
  // ==========================================
  const { loading, error, groupedData, refreshData } = useKonpoData(projectId);

  // ==========================================
  // ビジネスロジック層
  // ==========================================
  const {
    selectedRows,
    expandedRows,
    toggleRow,
    toggleExpand,
    handleGenerateTanniIds
  } = useKonpoActions(projectId, groupedData, refreshData);

  // ==========================================
  // 副作用層（useMemo, useCallback）
  // ==========================================
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'all' | 'with-list' | 'without-list');
  }, []);

  // ==========================================
  // エラーハンドリング層
  // ==========================================
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>データを読み込み中...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">
              <p className="text-lg font-semibold mb-2">エラーが発生しました</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              <Button 
                variant="outline" 
                onClick={refreshData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                再試行
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // レンダリング層
  // ==========================================
  return (
    <div className="container mx-auto p-3">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0">
          <div className="m-0">
            {/* TanStack Table + Shadcn UI組み合わせのテーブルコンポーネント */}
            <KonpoTable
              groupedData={groupedData}
              selectedRows={selectedRows}
              expandedRows={expandedRows}
              activeTab={activeTab}
              onToggleRow={toggleRow}
              onToggleExpand={toggleExpand}
              onTabChange={handleTabChange}
              onCreateListId={handleGenerateTanniIds}
              rowHeight="sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
