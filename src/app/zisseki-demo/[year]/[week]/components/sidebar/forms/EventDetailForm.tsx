"use client"

import React, { useState, useEffect } from 'react';
import { TimeGridEvent } from "../../../types";

interface Project {
  projectCode?: string;
  projectName?: string;
  name?: string;
}

interface EventDetailFormProps {
  selectedEvent: TimeGridEvent | null;
  selectedTab: string;
  selectedProjectSubTab: string;
  updateEvent: (event: TimeGridEvent) => void;
  handleDeleteEvent: () => void;
  setSelectedEvent: (event: TimeGridEvent | null) => void;
  projects?: Project[];
}

export const EventDetailForm = ({
  selectedEvent,
  selectedTab,
  selectedProjectSubTab,
  updateEvent,
  handleDeleteEvent,
  setSelectedEvent,
  projects = []
}: EventDetailFormProps) => {
  
  // デバッグ用: コンポーネントが呼び出されているかを確認
  console.log('EventDetailForm - selectedEvent:', selectedEvent);
  console.log('EventDetailForm - selectedEvent truthy:', !!selectedEvent);

  const [editedEvent, setEditedEvent] = useState<TimeGridEvent | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 選択されたイベントが変更されたら編集状態をリセット
  useEffect(() => {
    if (selectedEvent) {
      setEditedEvent({ ...selectedEvent });
      setHasChanges(false);
      setErrors({});
    }
  }, [selectedEvent]);

  // 変更を検知
  const handleChange = (field: keyof TimeGridEvent, value: unknown) => {
    if (!editedEvent) return;

    const updatedEvent = { ...editedEvent, [field]: value };
    setEditedEvent(updatedEvent);
    setHasChanges(true);

    // バリデーション
    validateField(field, value);
  };

  // フィールドバリデーション
  const validateField = (field: keyof TimeGridEvent, value: unknown) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'title': {
        const titleValue = value as string;
        if (!titleValue || titleValue.trim().length === 0) {
          newErrors.title = 'タイトルは必須です';
        } else if (titleValue.length > 100) {
          newErrors.title = 'タイトルは100文字以内で入力してください';
        } else {
          delete newErrors.title;
        }
        break;
      }

      case 'startDateTime':
      case 'endDateTime': {
        const start = new Date(editedEvent?.startDateTime || '');
        const end = new Date(editedEvent?.endDateTime || '');
        if (end <= start) {
          newErrors.time = '終了時間は開始時間より後に設定してください';
        } else {
          delete newErrors.time;
        }
        break;
      }

      default:
        break;
    }

    setErrors(newErrors);
  };

  // 保存処理
  const handleSave = () => {
    if (!editedEvent) return;

    // 全体バリデーション
    const validationErrors: Record<string, string> = {};
    
    if (!editedEvent.title || editedEvent.title.trim().length === 0) {
      validationErrors.title = 'タイトルは必須です';
    }

    const start = new Date(editedEvent.startDateTime);
    const end = new Date(editedEvent.endDateTime);
    if (end <= start) {
      validationErrors.time = '終了時間は開始時間より後に設定してください';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 時間変更時の位置再計算
    const updatedEvent = { ...editedEvent };
    if (hasChanges) {
      const startTime = new Date(updatedEvent.startDateTime);
      const endTime = new Date(updatedEvent.endDateTime);
      
      // top位置の再計算
      updatedEvent.top = startTime.getHours() * 64 + (startTime.getMinutes() / 60) * 64;
      
      // heightの再計算（分単位）
      const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      updatedEvent.height = (durationMinutes / 60) * 64;
    }

    updateEvent(updatedEvent);
    setHasChanges(false);
    setErrors({});
  };



  if (!selectedEvent || !editedEvent) {
    return (
      <div className="p-4 text-center text-gray-500">
        編集するイベントを選択してください
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">

      {/* エラー表示 */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded p-3">
          {Object.values(errors).map((error, index) => (
            <div key={index} className="text-red-600 text-sm">{error}</div>
          ))}
        </div>
      )}

      {/* タイトル */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          タイトル *
        </label>
        <input
          type="text"
          value={editedEvent.title || ""}
          onChange={(e) => handleChange('title', e.target.value)}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="イベントのタイトルを入力"
        />
      </div>

      {/* 説明 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          説明
        </label>
        <textarea
          value={editedEvent.description || ""}
          onChange={(e) => handleChange('description', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="イベントの詳細を入力"
        />
      </div>

      {/* プロジェクト選択 */}
      {projects.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            プロジェクト
          </label>
          <select
            value={editedEvent.project || ""}
            onChange={(e) => handleChange('project', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">プロジェクトを選択</option>
            {projects.map((project) => (
              <option key={project.projectCode} value={project.projectCode}>
                {project.projectName || project.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 時間設定 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            開始時間
          </label>
          <input
            type="time"
            value={new Date(editedEvent.startDateTime).toTimeString().slice(0, 5)}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newStart = new Date(editedEvent.startDateTime);
              newStart.setHours(parseInt(hours), parseInt(minutes));
              handleChange('startDateTime', newStart.toISOString());
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            終了時間
          </label>
          <input
            type="time"
            value={new Date(editedEvent.endDateTime).toTimeString().slice(0, 5)}
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':');
              const newEnd = new Date(editedEvent.endDateTime);
              newEnd.setHours(parseInt(hours), parseInt(minutes));
              handleChange('endDateTime', newEnd.toISOString());
            }}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
      </div>

      {/* 色設定（TimeGridEventのcolorプロパティがある場合） */}
      {'color' in editedEvent && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            色
          </label>
          <div className="flex space-x-2">
            {['#3788d8', '#dc2626', '#059669', '#d97706', '#7c3aed', '#ec4899'].map((color) => (
              <button
                key={color}
                onClick={() => handleChange('color' as keyof TimeGridEvent, color)}
                className={`w-8 h-8 rounded border-2 ${
                  (editedEvent as { color?: string }).color === color ? 'border-gray-900' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 状態設定（会議タブ以外で表示） */}
      {!(selectedTab === "project" && selectedProjectSubTab === "会議") && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            状態
          </label>
          <select
            value={editedEvent.status || "進行中"}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="進行中">進行中</option>
            <option value="完了">完了</option>
            <option value="中止">中止</option>
          </select>
        </div>
      )}

      {/* 保存と削除ボタン - サイドバーの一番下に配置 */}
      <div className="border-t pt-4 space-y-2">
        <button
          onClick={handleSave}
          disabled={Object.keys(errors).length > 0 || !hasChanges}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          保存
        </button>
        <button
          onClick={handleDeleteEvent}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500"
        >
          イベントを削除
        </button>
      </div>
    </div>
  );
}; 