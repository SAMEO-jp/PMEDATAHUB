'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Save, X, Plus, Calendar, Building, User, Tag, MessageSquare } from 'lucide-react';

export default function PJ003ProjectCreateDemo() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: '企画中',
    client: '',
    startDate: '',
    endDate: '',
    budget: 'B',
    category: '',
    equipmentCategory: '',
    productCategory: '',
    installationDate: '',
    drawingCompletionDate: '',
    notes: '',
    tags: [] as string[],
    pm: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState('');

  // バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'プロジェクト名は必須です';
    }

    if (!formData.client.trim()) {
      newErrors.client = 'クライアント名は必須です';
    }

    if (!formData.startDate) {
      newErrors.startDate = '開始日は必須です';
    }

    if (!formData.endDate) {
      newErrors.endDate = '終了予定日は必須です';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
      newErrors.endDate = '終了予定日は開始日より後である必要があります';
    }

    if (!formData.pm.trim()) {
      newErrors.pm = 'プロジェクトマネージャーは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // デモ用の遅延
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 成功時の処理（実際の実装ではAPI呼び出し）
    alert('プロジェクトが正常に作成されました！');
    setIsSubmitting(false);
  };

  // タグ追加
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // タグ削除
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* ヘッダー */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PJ-003: プロジェクト作成</h1>
            <p className="text-gray-600 mt-2">新規プロジェクト登録</p>
          </div>
          <div className="flex gap-3">
            <Link href="/project/demo/pj-001">
              <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                キャンセル
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            基本情報
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* プロジェクト名 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクト名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="プロジェクト名を入力してください"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* プロジェクト説明 */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクト説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="プロジェクトの詳細説明を入力してください"
              />
            </div>

            {/* ステータス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ステータス
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="企画中">企画中</option>
                <option value="進行中">進行中</option>
                <option value="一時停止">一時停止</option>
                <option value="完了">完了</option>
                <option value="キャンセル">キャンセル</option>
              </select>
            </div>

            {/* クライアント */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                クライアント <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.client ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="クライアント名を入力してください"
              />
              {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
            </div>

            {/* 開始日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                開始日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
            </div>

            {/* 終了予定日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                終了予定日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
            </div>

            {/* 予算グレード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                予算グレード
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A">A（高予算）</option>
                <option value="B">B（中予算）</option>
                <option value="C">C（低予算）</option>
              </select>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="設備工事、システム開発など"
              />
            </div>

            {/* プロジェクトマネージャー */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクトマネージャー <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.pm}
                onChange={(e) => setFormData(prev => ({ ...prev, pm: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pm ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="PM名を入力してください"
              />
              {errors.pm && <p className="mt-1 text-sm text-red-600">{errors.pm}</p>}
            </div>
          </div>
        </div>

        {/* スケジュール情報 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            スケジュール情報
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 図面完成日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                図面完成日
              </label>
              <input
                type="date"
                value={formData.drawingCompletionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, drawingCompletionDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 設置日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                設置日
              </label>
              <input
                type="date"
                value={formData.installationDate}
                onChange={(e) => setFormData(prev => ({ ...prev, installationDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 設備カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                設備カテゴリ
              </label>
              <input
                type="text"
                value={formData.equipmentCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, equipmentCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="高炉設備、製鉄設備など"
              />
            </div>

            {/* 商品カテゴリ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品カテゴリ
              </label>
              <input
                type="text"
                value={formData.productCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, productCategory: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="製鉄設備、環境設備など"
              />
            </div>
          </div>
        </div>

        {/* タグ・備考 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            タグ・備考
          </h2>

          <div className="space-y-6">
            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="タグを入力してEnterキーで追加"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  追加
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                備考
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="プロジェクトに関する備考を入力してください"
              />
            </div>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end gap-4">
          <Link href="/project/demo/pj-001">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              キャンセル
            </button>
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? '作成中...' : 'プロジェクトを作成'}
          </button>
        </div>
      </form>

      {/* 機能説明 */}
      <div className="mt-8 bg-purple-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">実装済み機能</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
          <div>
            <h4 className="font-medium mb-2">入力フォーム:</h4>
            <ul className="space-y-1">
              <li>• 必須項目のバリデーション</li>
              <li>• 日付整合性チェック</li>
              <li>• リアルタイムエラー表示</li>
              <li>• タグの動的追加・削除</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">ユーザビリティ:</h4>
            <ul className="space-y-1">
              <li>• セクション分けされたフォーム</li>
              <li>• 直感的な入力フィールド</li>
              <li>• 送信中の状態表示</li>
              <li>• キャンセル機能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


