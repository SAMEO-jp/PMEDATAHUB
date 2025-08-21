"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@src/components/ui/card';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { useZissekiOperations } from '@src/hooks/useZissekiData';
import { trpc } from '@src/lib/trpc/client';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ZissekiApiTestPage() {
  const [year, setYear] = useState(2024);
  const [week, setWeek] = useState(1);
  const [testEvent, setTestEvent] = useState({
    title: 'テストイベント',
    description: 'APIテスト用のイベント',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(Date.now() + 3600000).toISOString(),
  });

  // tRPCクエリとミューテーション
  const { data: weekData, isLoading, error, refetch } = trpc.zisseki.getWeekData.useQuery(
    { year, week },
    { enabled: false } // 手動で実行
  );

  // 自動実行版（デバッグ用）
  const { data: autoWeekData, isLoading: autoLoading, error: autoError } = trpc.zisseki.getWeekData.useQuery(
    { year, week },
    { 
      enabled: true, // 自動実行
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  const saveMutation = trpc.zisseki.saveWeekData.useMutation({
    onSuccess: () => {
      console.log('保存成功');
      refetch();
    },
    onError: (error) => {
      console.error('保存エラー:', error);
    },
  });

  const updateMutation = trpc.zisseki.updateEvent.useMutation({
    onSuccess: () => {
      console.log('更新成功');
      refetch();
    },
    onError: (error) => {
      console.error('更新エラー:', error);
    },
  });

  const deleteMutation = trpc.zisseki.deleteEvent.useMutation({
    onSuccess: () => {
      console.log('削除成功');
      refetch();
    },
    onError: (error) => {
      console.error('削除エラー:', error);
    },
  });

  // テスト用のイベントデータ
  const testEvents = [
    {
      id: 'test-1',
      title: testEvent.title,
      description: testEvent.description,
      project: 'TEST_PROJECT',
      startDateTime: testEvent.startDateTime,
      endDateTime: testEvent.endDateTime,
      activityCode: 'TEST001',
      top: 100,
      height: 64,
      color: '#3788d8',
      unsaved: false,
      category: 'test',
      employeeNumber: 'EMP001',
    },
  ];

  const testWorkTimes = [
    {
      date: '2024-01-01',
      startTime: '09:00',
      endTime: '17:00',
    },
  ];

  // デバッグ情報
  useEffect(() => {
    console.log('=== tRPC API デバッグ情報 ===');
    console.log('手動クエリ:', {
      isLoading,
      error: error?.message,
      data: weekData?.data,
      eventsCount: weekData?.data?.events?.length || 0
    });
    console.log('自動クエリ:', {
      isLoading: autoLoading,
      error: autoError?.message,
      data: autoWeekData?.data,
      eventsCount: autoWeekData?.data?.events?.length || 0
    });
  }, [weekData, autoWeekData, isLoading, autoLoading, error, autoError]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Zisseki API テスト</h1>

      {/* デバッグ情報表示 */}
      <Card>
        <CardHeader>
          <CardTitle>デバッグ情報</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">手動クエリ状態</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify({
                  isLoading,
                  error: error?.message,
                  eventsCount: weekData?.data?.events?.length || 0,
                  hasData: !!weekData?.data
                }, null, 2)}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold">自動クエリ状態</h3>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify({
                  isLoading: autoLoading,
                  error: autoError?.message,
                  eventsCount: autoWeekData?.data?.events?.length || 0,
                  hasData: !!autoWeekData?.data
                }, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* パラメータ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>パラメータ設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">年</label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min={2020}
                max={2030}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">週</label>
              <Input
                type="number"
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value))}
                min={1}
                max={53}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API操作ボタン */}
      <Card>
        <CardHeader>
          <CardTitle>API操作</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <span>データ取得</span>
              )}
            </Button>

            <Button
              onClick={() => saveMutation.mutate({
                year,
                week,
                data: { events: testEvents, workTimes: testWorkTimes },
              })}
              disabled={saveMutation.isPending}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>保存中...</span>
                </>
              ) : (
                <span>テストデータ保存</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* エラー表示 */}
      {(error || autoError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            エラー: {error?.message || autoError?.message}
          </AlertDescription>
        </Alert>
      )}

      {/* 結果表示 */}
      {(weekData || autoWeekData) && (
        <Card>
          <CardHeader>
            <CardTitle>取得結果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">メタデータ</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify((weekData || autoWeekData)?.data?.metadata, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">イベント ({(weekData || autoWeekData)?.data?.events?.length || 0}件)</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm max-h-96 overflow-auto">
                  {JSON.stringify((weekData || autoWeekData)?.data?.events, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">ワークタイム ({(weekData || autoWeekData)?.data?.workTimes?.length || 0}件)</h3>
                <pre className="bg-gray-100 p-2 rounded text-sm">
                  {JSON.stringify((weekData || autoWeekData)?.data?.workTimes, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ミューテーション状態 */}
      <Card>
        <CardHeader>
          <CardTitle>ミューテーション状態</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span>保存:</span>
              {saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : saveMutation.isSuccess ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : saveMutation.isError ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <span className="text-gray-400">待機中</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span>更新:</span>
              {updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : updateMutation.isSuccess ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : updateMutation.isError ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <span className="text-gray-400">待機中</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span>削除:</span>
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : deleteMutation.isSuccess ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : deleteMutation.isError ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <span className="text-gray-400">待機中</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

