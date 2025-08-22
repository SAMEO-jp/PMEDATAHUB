"use client"

import React, { useState } from 'react';
import { Button } from '@src/components/ui/button';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { Save, Loader2, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useEventContext } from '../context/EventContext';
import type { WorkTimeData } from '../types';
import { createNewEvent } from '../utils/eventUtils';

interface TimeGridHeaderProps {
  year: number;
  week: number;
}

export const TimeGridHeader: React.FC<TimeGridHeaderProps> = ({ year, week }) => {
  const database = useDatabase();
  const eventState = useEventContext();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 保存ボタンのクリックハンドラー
  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      setErrorMessage('');

      // 現在のイベントデータを取得
      const currentEvents = eventState.events || [];
      const currentWorkTimes: WorkTimeData[] = []; // 空配列として扱う

      console.log('保存開始:', {
        eventsCount: currentEvents.length,
        events: currentEvents
      });

      // データベースに保存
      const result = await database.saveWeekData(currentEvents, currentWorkTimes);

      console.log('保存結果:', result);

      // 保存成功後、データベースを再読み込み
      database.refetch();

      setSaveStatus('success');
      console.log('データが正常に保存されました');

      // 3秒後に成功状態をリセット
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);

    } catch (error: unknown) {
      console.error('保存エラー:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '保存に失敗しました');
      
      // 5秒後にエラー状態をリセット
      setTimeout(() => {
        setSaveStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  // テストデータ作成ハンドラー
  const handleCreateTestData = () => {
    try {
      const today = new Date();
      const testEvent = createNewEvent(today, 9, 0, eventState.ui?.hierarchy || { activeTab: 'project', activeSubTabs: { project: '計画', indirect: '目的間接' }, detailTabs: {}, businessTypes: {} });
      testEvent.title = 'テストイベント';
      testEvent.description = '保存機能のテスト用データ';
      testEvent.project = 'テストプロジェクト';
      
      const createdEvent = eventState.createEvent(testEvent);
      eventState.setSelectedEvent(createdEvent);
      
      console.log('テストデータを作成しました:', createdEvent);
    } catch (error) {
      console.error('テストデータ作成エラー:', error);
    }
  };

  // 保存ボタンの状態を決定
  const isSaveDisabled = database.isSaving || database.isLoading || saveStatus === 'saving';

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      {/* 左側: タイトルと週情報 */}
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">
          実績管理
        </h2>
        <div className="text-sm text-gray-600">
          {year}年 第{week}週
        </div>
        {database.metadata && (
          <div className="text-xs text-gray-500">
            最終更新: {new Date(database.metadata.lastModified).toLocaleString('ja-JP')}
          </div>
        )}
      </div>

      {/* 右側: 保存ボタンとエラー表示 */}
      <div className="flex items-center space-x-3">
        {/* エラー表示 */}
        {(database.error || saveStatus === 'error') && (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || 'データの取得に失敗しました'}
            </AlertDescription>
          </Alert>
        )}

        {/* 保存成功メッセージ */}
        {saveStatus === 'success' && (
          <Alert className="w-auto border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              データが正常に保存されました
            </AlertDescription>
          </Alert>
        )}

        {/* テストデータ作成ボタン */}
        <Button
          onClick={() => {
            handleCreateTestData();
          }}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>テストデータ作成</span>
        </Button>

        {/* 保存ボタン */}
        <Button
          onClick={() => {
            void handleSave();
          }}
          disabled={isSaveDisabled}
          variant="default"
          size="sm"
          className="flex items-center space-x-2"
        >
          {(database.isSaving || saveStatus === 'saving') ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>保存中...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>保存</span>
            </>
          )}
        </Button>

        {/* 保存済みインジケーター */}
        {!database.isSaving && !database.isLoading && saveStatus === 'idle' && database.events.length > 0 && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">保存済み</span>
          </div>
        )}
      </div>
    </div>
  );
};
