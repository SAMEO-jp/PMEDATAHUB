"use client"

import React from 'react';
import { Button } from '@src/components/ui/button';
import { Alert, AlertDescription } from '@src/components/ui/alert';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useDatabase } from '../context/DatabaseContext';
import { useEventContext } from '../context/EventContext';
import type { WorkTimeData } from '../types';

interface TimeGridHeaderProps {
  year: number;
  week: number;
}

export const TimeGridHeader: React.FC<TimeGridHeaderProps> = ({ year, week }) => {
  const database = useDatabase();
  const eventState = useEventContext();

  // 保存ボタンのクリックハンドラー
  const handleSave = async () => {
    try {
      // 現在のイベントデータを取得
      const currentEvents = eventState.events;
      const currentWorkTimes: WorkTimeData[] = []; // 空配列として扱う

      // データベースに保存
      await database.saveWeekData(currentEvents, currentWorkTimes);

      // 成功メッセージを表示（一時的に）
      console.log('データが正常に保存されました');
    } catch (error) {
      console.error('保存エラー:', error);
    }
  };

  // 保存ボタンの状態を決定
  const isSaveDisabled = database.isSaving || database.isLoading;

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
        {database.error && (
          <Alert variant="destructive" className="w-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              データの取得に失敗しました
            </AlertDescription>
          </Alert>
        )}

        {/* 保存ボタン */}
        <Button
          onClick={handleSave}
          disabled={isSaveDisabled}
          variant="default"
          size="sm"
          className="flex items-center space-x-2"
        >
          {database.isSaving ? (
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

        {/* 保存成功インジケーター */}
        {!database.isSaving && database.events.length > 0 && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs">保存済み</span>
          </div>
        )}
      </div>
    </div>
  );
};
