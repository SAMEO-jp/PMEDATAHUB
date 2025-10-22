'use client';

//React関連（必ず最初）
import { useState } from 'react';

//Next.js関連
import { useRouter } from 'next/navigation';

//型定義（最後）

// カスタムフック
import { useProjectCreate } from '@src/hooks/useProjectData';

interface FormData {
  PROJECT_ID: string;
  PROJECT_NAME: string;
  PROJECT_DESCRIPTION: string;
  PROJECT_START_DATE: string;
  PROJECT_STATUS: 'active' | 'completed' | 'archived';
  PROJECT_CLIENT_NAME: string;
  PROJECT_START_ENDDATE: string;
  PROJECT_NOTE: string;
  PROJECT_CLASSIFICATION: string;
  PROJECT_BUDGENT_GRADE: string;
  installationDate: string;
  drawingCompletionDate: string;
  PROJECT_EQUIPMENT_CATEGORY: string;
  PROJECT_SYOHIN_CATEGORY: string;
}

export default function CreateProjectPage() {
  const router = useRouter();

  // tRPCを使用したプロジェクト作成フック
  const { handleCreate, isLoading } = useProjectCreate();

  const [formData, setFormData] = useState<FormData>({
    PROJECT_ID: '',
    PROJECT_NAME: '',
    PROJECT_DESCRIPTION: '',
    PROJECT_START_DATE: '',
    PROJECT_STATUS: 'active',
    PROJECT_CLIENT_NAME: '',
    PROJECT_START_ENDDATE: '',
    PROJECT_NOTE: '',
    PROJECT_CLASSIFICATION: '',
    PROJECT_BUDGENT_GRADE: '',
    installationDate: '',
    drawingCompletionDate: '',
    PROJECT_EQUIPMENT_CATEGORY: '',
    PROJECT_SYOHIN_CATEGORY: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 必須フィールドのバリデーション
    if (!formData.PROJECT_ID.trim()) {
      alert('プロジェクトIDは必須です');
      return;
    }
    if (!formData.PROJECT_NAME.trim()) {
      alert('プロジェクト名は必須です');
      return;
    }
    if (!formData.PROJECT_START_DATE) {
      alert('開始日は必須です');
      return;
    }
    if (!formData.PROJECT_CLIENT_NAME.trim()) {
      alert('クライアント名は必須です');
      return;
    }

    try {
      // tRPCを使用してプロジェクト作成
      const result = await handleCreate(formData);

      if (result.success) {
        console.log('プロジェクト作成成功');
        // 作成成功時はプロジェクト一覧に戻る
        router.push('/app_project');
      } else {
        console.error('プロジェクト作成失敗:', result);
        alert('プロジェクトの作成に失敗しました');
      }
    } catch (err) {
      console.error('プロジェクト作成エラー:', err);
      alert('プロジェクトの作成に失敗しました');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">プロジェクト新規作成</h1>
        <button
          onClick={() => router.push('/app_project')}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          戻る
        </button>
      </div>

      {/* エラー表示 */}
      {/* tRPCのエラーはhandleSubmit内で処理するため、ここでは表示しない */}

      <form onSubmit={(e) => void handleSubmit(e)} className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 必須フィールド */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-red-600">必須項目</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プロジェクトID *
            </label>
            <input
              type="text"
              value={formData.PROJECT_ID}
              onChange={(e) => handleInputChange('PROJECT_ID', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="例: PROJ-001"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プロジェクト名 *
            </label>
            <input
              type="text"
              value={formData.PROJECT_NAME}
              onChange={(e) => handleInputChange('PROJECT_NAME', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="プロジェクト名を入力"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              開始日 *
            </label>
            <input
              type="date"
              value={formData.PROJECT_START_DATE}
              onChange={(e) => handleInputChange('PROJECT_START_DATE', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ステータス *
            </label>
            <select
              value={formData.PROJECT_STATUS}
              onChange={(e) => handleInputChange('PROJECT_STATUS', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="active">進行中</option>
              <option value="completed">完了</option>
              <option value="archived">アーカイブ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              クライアント名 *
            </label>
            <input
              type="text"
              value={formData.PROJECT_CLIENT_NAME}
              onChange={(e) => handleInputChange('PROJECT_CLIENT_NAME', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="クライアント名を入力"
              required
            />
          </div>

          {/* 基本情報 */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">基本情報</h2>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              終了日
            </label>
            <input
              type="date"
              value={formData.PROJECT_START_ENDDATE}
              onChange={(e) => handleInputChange('PROJECT_START_ENDDATE', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>



          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プロジェクト説明
            </label>
            <textarea
              value={formData.PROJECT_DESCRIPTION}
              onChange={(e) => handleInputChange('PROJECT_DESCRIPTION', e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="プロジェクトの詳細説明を入力"
            />
          </div>



          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              備考
            </label>
            <textarea
              value={formData.PROJECT_NOTE}
              onChange={(e) => handleInputChange('PROJECT_NOTE', e.target.value)}
              rows={2}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="備考を入力"
            />
          </div>

          {/* 追加情報 */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">追加情報</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分類
            </label>
            <input
              type="text"
              value={formData.PROJECT_CLASSIFICATION}
              onChange={(e) => handleInputChange('PROJECT_CLASSIFICATION', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="プロジェクト分類を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              予算等級
            </label>
            <input
              type="text"
              value={formData.PROJECT_BUDGENT_GRADE}
              onChange={(e) => handleInputChange('PROJECT_BUDGENT_GRADE', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="予算等級を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              設置日
            </label>
            <input
              type="date"
              value={formData.installationDate}
              onChange={(e) => handleInputChange('installationDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              図面完了日
            </label>
            <input
              type="date"
              value={formData.drawingCompletionDate}
              onChange={(e) => handleInputChange('drawingCompletionDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              設備カテゴリ
            </label>
            <input
              type="text"
              value={formData.PROJECT_EQUIPMENT_CATEGORY}
              onChange={(e) => handleInputChange('PROJECT_EQUIPMENT_CATEGORY', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="設備カテゴリを入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品カテゴリ
            </label>
            <input
              type="text"
              value={formData.PROJECT_SYOHIN_CATEGORY}
              onChange={(e) => handleInputChange('PROJECT_SYOHIN_CATEGORY', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="商品カテゴリを入力"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push('/app_project')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            キャンセル
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            {isLoading ? '作成中...' : 'プロジェクトを作成'}
          </button>
        </div>
      </form>
    </div>
  );
}
