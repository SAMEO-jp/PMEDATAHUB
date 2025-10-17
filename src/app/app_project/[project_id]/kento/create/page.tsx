'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface KentoFormData {
  title: string;
  description: string;
  equipmentCode: string;
  category: string;
  priority: string;
  assignedTo: string;
  startDate: string;
  targetDate: string;
  status: string;
}

export default function KentoCreatePage() {
  const [formData, setFormData] = useState<KentoFormData>({
    title: '',
    description: '',
    equipmentCode: '',
    category: '',
    priority: 'medium',
    assignedTo: '',
    startDate: '',
    targetDate: '',
    status: '未着手'
  });

  const [errors, setErrors] = useState<Partial<KentoFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const equipmentOptions = [
    { value: '1100', label: '1100 (本体)' },
    { value: '1B00', label: '1B00 (炉頂)' },
    { value: '1200', label: '1200 (熱風炉)' },
    { value: '1300', label: '1300 (原料処理)' }
  ];

  const categoryOptions = [
    { value: '基本設計', label: '基本設計' },
    { value: '材料選定', label: '材料選定' },
    { value: '熱設計', label: '熱設計' },
    { value: '構造解析', label: '構造解析' },
    { value: '製造技術', label: '製造技術' },
    { value: '保守設計', label: '保守設計' },
    { value: '制御システム', label: '制御システム' },
    { value: '安全設計', label: '安全設計' },
    { value: '環境設備', label: '環境設備' },
    { value: '操作性', label: '操作性' }
  ];

  const priorityOptions = [
    { value: 'high', label: '高' },
    { value: 'medium', label: '中' },
    { value: 'low', label: '低' }
  ];

  const statusOptions = [
    { value: '未着手', label: '未着手' },
    { value: '進行中', label: '進行中' },
    { value: '完了', label: '完了' }
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<KentoFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }

    if (!formData.description.trim()) {
      newErrors.description = '説明は必須です';
    }

    if (!formData.equipmentCode) {
      newErrors.equipmentCode = '設備製番は必須です';
    }

    if (!formData.category) {
      newErrors.category = 'カテゴリは必須です';
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = '担当者は必須です';
    }

    if (!formData.startDate) {
      newErrors.startDate = '開始日は必須です';
    }

    if (!formData.targetDate) {
      newErrors.targetDate = '目標日は必須です';
    }

    if (formData.startDate && formData.targetDate && formData.startDate > formData.targetDate) {
      newErrors.targetDate = '目標日は開始日より後である必要があります';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // ここでAPI呼び出しを行う
      console.log('検討書データ:', formData);
      
      // 成功時の処理（実際の実装ではリダイレクトなど）
      alert('検討書が正常に作成されました');
      
      // フォームをリセット
      setFormData({
        title: '',
        description: '',
        equipmentCode: '',
        category: '',
        priority: 'medium',
        assignedTo: '',
        startDate: '',
        targetDate: '',
        status: '未着手'
      });
      
    } catch (error) {
      console.error('検討書作成エラー:', error);
      alert('検討書の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof KentoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="kento-create-page p-6">
      {/* ヘッダー */}
      <div className="page-header mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="../"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
          >
            <span>←</span>
            <span>検討書一覧に戻る</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">新規検討書作成</h1>
        <p className="text-gray-600">新しい技術検討書を作成します</p>
      </div>

      {/* フォーム */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本情報 */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
            </div>

            {/* タイトル */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                検討書タイトル *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="例: 炉体構造設計"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* 説明 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="検討内容の詳細を記述してください"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* 設備製番 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                設備製番 *
              </label>
              <select
                value={formData.equipmentCode}
                onChange={(e) => handleInputChange('equipmentCode', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.equipmentCode ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">設備製番を選択</option>
                {equipmentOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.equipmentCode && (
                <p className="text-red-500 text-sm mt-1">{errors.equipmentCode}</p>
              )}
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">カテゴリを選択</option>
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* 優先度 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                優先度
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 担当者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                担当者 *
              </label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="担当者名を入力"
              />
              {errors.assignedTo && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedTo}</p>
              )}
            </div>

            {/* 開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日 *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            {/* 目標日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                目標日 *
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => handleInputChange('targetDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.targetDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.targetDate && (
                <p className="text-red-500 text-sm mt-1">{errors.targetDate}</p>
              )}
            </div>

            {/* ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Link
              href="../"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '作成中...' : '検討書を作成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
