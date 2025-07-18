/**
 * @file 図面組立図検索APIのテストコンポーネント
 */

'use client';

import { useState } from 'react';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@src/components/ui/card';
import { Badge } from '@src/components/ui/badge';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { useZumenAssemblySearch } from '@src/app/app_project/[project_id]/zumen/[zumen_id]/hooks/useZumenAssemblySearch';
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function ZumenAssemblySearchTRPCTest() {
  const [zumenId, setZumenId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [zumenKind, setZumenKind] = useState('');
  const [searchType, setSearchType] = useState<'basic' | 'exact' | 'project' | 'kind'>('basic');

  const {
    searchByZumenId,
    searchExactByZumenId,
    searchByZumenIdAndProject,
    searchByZumenIdAndKind,
    invalidateCache,
  } = useZumenAssemblySearch();

  // 各検索クエリの実行
  const basicQuery = searchByZumenId(zumenId);
  const exactQuery = searchExactByZumenId(zumenId);
  const projectQuery = searchByZumenIdAndProject(zumenId, projectId);
  const kindQuery = searchByZumenIdAndKind(zumenId, zumenKind || undefined);

  // 現在の検索タイプに応じたクエリを選択
  const currentQuery = (() => {
    switch (searchType) {
      case 'basic':
        return basicQuery;
      case 'exact':
        return exactQuery;
      case 'project':
        return projectQuery;
      case 'kind':
        return kindQuery;
      default:
        return basicQuery;
    }
  })();

  const handleSearch = () => {
    if (!zumenId.trim()) {
      alert('図面番号を入力してください');
      return;
    }

    if (searchType === 'project' && !projectId.trim()) {
      alert('プロジェクトIDを入力してください');
      return;
    }

    // キャッシュを無効化して最新データを取得
    invalidateCache();
  };

  const renderSearchForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          図面組立図検索
        </CardTitle>
        <CardDescription>
          図面番号で組立図としてデータを登録している図面を逆に調べるAPIのテスト
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">図面番号 *</label>
            <Input
              value={zumenId}
              onChange={(e) => setZumenId(e.target.value)}
              placeholder="例: ZUMEN001"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">検索タイプ</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'basic' | 'exact' | 'project' | 'kind')}
              className="w-full p-2 border rounded-md"
            >
              <option value="basic">基本検索</option>
              <option value="exact">完全一致検索</option>
              <option value="project">プロジェクト指定</option>
              <option value="kind">図面種類指定</option>
            </select>
          </div>
        </div>

        {searchType === 'project' && (
          <div>
            <label className="text-sm font-medium mb-2 block">プロジェクトID *</label>
            <Input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="例: PROJ001"
              className="w-full"
            />
          </div>
        )}

        {searchType === 'kind' && (
          <div>
            <label className="text-sm font-medium mb-2 block">図面種類</label>
            <Input
              value={zumenKind}
              onChange={(e) => setZumenKind(e.target.value)}
              placeholder="例: 組立図"
              className="w-full"
            />
          </div>
        )}

        <Button onClick={handleSearch} className="w-full">
          {currentQuery.isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              検索中...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              検索実行
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  const renderResults = () => {
    if (currentQuery.isLoading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>検索中...</span>
          </CardContent>
        </Card>
      );
    }

    if (currentQuery.error) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            エラーが発生しました: {currentQuery.error.message}
          </AlertDescription>
        </Alert>
      );
    }

    if (!currentQuery.data?.data) {
      return (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            検索結果がありません
          </CardContent>
        </Card>
      );
    }

    const { assemblyZumen, totalCount } = currentQuery.data.data;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            検索結果
          </CardTitle>
          <CardDescription>
            見つかった図面数: <Badge variant="secondary">{totalCount}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assemblyZumen.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              該当する図面が見つかりませんでした
            </p>
          ) : (
            <div className="space-y-4">
              {assemblyZumen.map((zumen, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">{zumen.Zumen_Name}</h4>
                        <p className="text-sm text-muted-foreground">図面ID: {zumen.Zumen_ID}</p>
                        <p className="text-sm text-muted-foreground">プロジェクトID: {zumen.project_ID}</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {zumen.Zumen_Kind || '未分類'}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          組立図: {zumen.Kumitate_Zumen || 'なし'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          担当者: {zumen.Tantou_a1 || '未設定'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">図面組立図検索API テスト</h1>
        <p className="text-muted-foreground">
          図面番号で組立図としてデータを登録している図面を逆に調べるAPIのテストページです。
        </p>
      </div>

      {renderSearchForm()}
      {renderResults()}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>API エンドポイント</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>基本検索:</strong> trpc.zumenAssemblySearch.searchByZumenId</p>
            <p><strong>完全一致検索:</strong> trpc.zumenAssemblySearch.searchExactByZumenId</p>
            <p><strong>プロジェクト指定検索:</strong> trpc.zumenAssemblySearch.searchByZumenIdAndProject</p>
            <p><strong>図面種類指定検索:</strong> trpc.zumenAssemblySearch.searchByZumenIdAndKind</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 