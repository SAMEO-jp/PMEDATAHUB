"use client"

import React, { useState, useEffect } from 'react';
import { calculateEventPosition } from "../../../utils/eventPositionCalculator";

import { TimeInputProps } from './types';

// 既存の型定義を削除し、新しい型を使用

// 時間文字列をDate部分と時間部分に分割
const parseDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
    date: date
  };
};

// Date、時間、分から新しいISOStringを作成
const createDateTime = (originalDate: Date, hours: number, minutes: number): string => {
  const newDate = new Date(originalDate);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

export const TimeInputField = ({ state, actions }: TimeInputProps) => {
  // stateやactionsがundefinedの場合は早期リターン
  if (!state || !actions) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">⏰</span>
          </div>
          <span className="text-xs font-medium text-gray-700">時間設定</span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <div className="animate-spin w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full mr-1.5"></div>
            読み込み中...
          </div>
        </div>
      </div>
    );
  }

  const { selectedEvent, label = "時間設定" } = state;
  const { onEventUpdate } = actions;
  const [startTime, setStartTime] = useState({ hours: 9, minutes: 0 });
  const [endTime, setEndTime] = useState({ hours: 10, minutes: 0 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 選択されたイベントが変更されたとき、時間を初期化
  useEffect(() => {
    if (selectedEvent?.startDateTime && selectedEvent?.endDateTime && typeof selectedEvent.startDateTime === 'string' && typeof selectedEvent.endDateTime === 'string') {
      const start = parseDateTime(selectedEvent.startDateTime);
      const end = parseDateTime(selectedEvent.endDateTime);
      
      setStartTime({ hours: start.hours, minutes: start.minutes });
      setEndTime({ hours: end.hours, minutes: end.minutes });
      setHasUnsavedChanges(false);
    }
  }, [selectedEvent?.id, selectedEvent?.startDateTime, selectedEvent?.endDateTime]);

  // 時間変更のハンドラー
  const handleTimeChange = (
    type: 'start' | 'end',
    field: 'hours' | 'minutes',
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = field === 'hours' 
      ? Math.max(0, Math.min(23, numValue))
      : Math.max(0, Math.min(59, numValue));

    if (type === 'start') {
      setStartTime(prev => ({ ...prev, [field]: clampedValue }));
    } else {
      setEndTime(prev => ({ ...prev, [field]: clampedValue }));
    }
    
    setHasUnsavedChanges(true);
  };

  // 時間を適用
  const applyTimeChanges = () => {
    if (!selectedEvent || typeof selectedEvent.startDateTime !== 'string' || typeof selectedEvent.endDateTime !== 'string') return;

    const startDate = new Date(selectedEvent.startDateTime);
    const endDate = new Date(selectedEvent.endDateTime);

    const newStartDateTime = createDateTime(startDate, startTime.hours, startTime.minutes);
    const newEndDateTime = createDateTime(endDate, endTime.hours, endTime.minutes);

    // startDateTime/endDateTimeからtop/heightを自動計算
    const { top, height } = calculateEventPosition(newStartDateTime, newEndDateTime);

    onEventUpdate(selectedEvent.id, {
      startDateTime: newStartDateTime,
      endDateTime: newEndDateTime,
      top,
      height,
      unsaved: true
    });

    setHasUnsavedChanges(false);
  };

  // スマート時間調整（終了時間を開始時間より後に自動調整）
  const smartAdjustEndTime = () => {
    const startMinutes = startTime.hours * 60 + startTime.minutes;
    const endMinutes = endTime.hours * 60 + endTime.minutes;

    if (endMinutes <= startMinutes) {
      // 終了時間を開始時間より1時間後に設定
      const newEndMinutes = startMinutes + 60;
      const newHours = Math.floor(newEndMinutes / 60) % 24;
      const newMins = newEndMinutes % 60;
      
      setEndTime({ hours: newHours, minutes: newMins });
    }
  };

  // 開始時間変更時に終了時間を自動調整
  useEffect(() => {
    if (hasUnsavedChanges) {
      smartAdjustEndTime();
    }
  }, [startTime, hasUnsavedChanges]);

  if (!selectedEvent) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-xs">⏰</span>
          </div>
          <span className="text-xs font-medium text-gray-700">{label}</span>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded p-2.5">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <span className="mr-1.5">📅</span>
            イベントを選択してください
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* ヘッダー部分 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-xs">⏰</span>
          </div>
          <span className="text-xs font-medium text-gray-700">{label}</span>
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-600 font-medium">未保存</span>
          )}
        </div>
        {hasUnsavedChanges && (
          <button
            onClick={applyTimeChanges}
            className="px-1.5 py-0.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors duration-200"
          >
            適用
          </button>
        )}
      </div>
      
      {/* 時間入力コンテナ */}
      <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded p-1.5">
        {/* 時間入力行 */}
        <div className="grid grid-cols-2 gap-1">
          {/* 開始時間 */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">開始</span>
            </div>
            <div className="flex items-center bg-white border border-gray-200 rounded p-0.5">
              <input
                type="number"
                min="0"
                max="23"
                value={startTime.hours}
                onChange={(e) => handleTimeChange('start', 'hours', e.target.value)}
                className="w-8 text-center text-xs font-medium border-none outline-none bg-transparent"
              />
              <span className="mx-0.5 text-gray-400 text-xs">:</span>
              <input
                type="number"
                min="0"
                max="59"
                step="10"
                value={startTime.minutes}
                onChange={(e) => handleTimeChange('start', 'minutes', e.target.value)}
                className="w-8 text-center text-xs font-medium border-none outline-none bg-transparent"
              />
            </div>
          </div>

          {/* 終了時間 */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              <span className="text-xs font-medium text-gray-600">終了</span>
            </div>
            <div className="flex items-center bg-white border border-gray-200 rounded p-0.5">
              <input
                type="number"
                min="0"
                max="23"
                value={endTime.hours}
                onChange={(e) => handleTimeChange('end', 'hours', e.target.value)}
                className="w-8 text-center text-xs font-medium border-none outline-none bg-transparent"
              />
              <span className="mx-0.5 text-gray-400 text-xs">:</span>
              <input
                type="number"
                min="0"
                max="59"
                step="10"
                value={endTime.minutes}
                onChange={(e) => handleTimeChange('end', 'minutes', e.target.value)}
                className="w-8 text-center text-xs font-medium border-none outline-none bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};