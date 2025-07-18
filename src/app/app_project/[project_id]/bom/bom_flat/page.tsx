// ==========================================
// ファイル名: page.tsx
// 機能: フラットBOMデータ表示ページ
// 技術: Next.js App Router, React, TypeScript
// ==========================================

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useFlatBom, useFlatBomPart } from '../../../../../hooks/useFlatBom';
import { FlatBomTable } from './components/FlatBomTable';
import { BuzaiWeightAggregatedTable } from './components/BuzaiWeightAggregatedTable';
import { FlatBomPartTable } from './components/FlatBomPartTable';
import { TableViewToggle } from './components/TableViewToggle';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../components/ui/card';
import { Button } from '../../../../../components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { TableViewMode } from '../../../../../types/flat-bom';

// ==========================================
// パラメータとルーティング層（searchParams, params, useParams, useRouter, useSearchParams）
// ==========================================
export default function FlatBomPage() {
  const resolvedParams = useParams();
  const projectId = resolvedParams.project_id as string;

  // ==========================================
  // 状態管理層（テーブル表示モード）
  // ==========================================
  const [viewMode, setViewMode] = useState<TableViewMode>('flat');

  // ==========================================
  // データ取得層（Server Components: async/await, Client Components: useEffect, use hooks）
  // ==========================================
  const { data: flatData, loading: flatLoading, error: flatError, refetch: flatRefetch } = useFlatBom(projectId);
  const { data: partData, loading: partLoading, error: partError, refetch: partRefetch } = useFlatBomPart(projectId);

  // ==========================================
  // 検証・バリデーション層（入力値チェック、データ整合性）
  // ==========================================
  if (!projectId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>プロジェクトIDが指定されていません。</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // エラーハンドリング層（エラー処理、フォールバック）
  // ==========================================
  const getCurrentError = () => {
    if (viewMode === 'flat' || viewMode === 'aggregated') {
      return flatError;
    }
    return partError;
  };

  const getCurrentLoading = () => {
    if (viewMode === 'flat' || viewMode === 'aggregated') {
      return flatLoading;
    }
    return partLoading;
  };

  const handleRefetch = () => {
    if (viewMode === 'flat' || viewMode === 'aggregated') {
      flatRefetch();
    } else {
      partRefetch();
    }
  };

  const currentError = getCurrentError();
  const currentLoading = getCurrentLoading();

  if (currentError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              エラー
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{currentError}</p>
            <Button onClick={handleRefetch} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              再試行
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==========================================
  // イベントハンドラ層（表示モード切り替え）
  // ==========================================
  const handleViewModeChange = (mode: TableViewMode) => {
    setViewMode(mode);
  };

  // ==========================================
  // レンダリング層（JSX return）
  // ==========================================
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">フラットBOM</h1>
        <p className="text-gray-600">
          プロジェクトID: {projectId}
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <TableViewToggle 
            currentMode={viewMode} 
            onModeChange={handleViewModeChange} 
          />
          <Button
            onClick={handleRefetch}
            disabled={currentLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${currentLoading ? 'animate-spin' : ''}`} />
            更新
          </Button>
        </div>
      </div>

      {viewMode === 'flat' && (
        <FlatBomTable data={flatData || []} loading={flatLoading} />
      )}
      {viewMode === 'aggregated' && (
        <BuzaiWeightAggregatedTable data={flatData || []} loading={flatLoading} />
      )}
      {viewMode === 'part' && (
        <FlatBomPartTable data={partData || []} loading={partLoading} />
      )}
    </div>
  );
} 