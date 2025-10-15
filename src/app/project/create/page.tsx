'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectMutations } from '@src/hooks/useProjectData';
import { ProjectCreateSchema } from '@src/types/project';
import { z } from 'zod';

type FormData = z.infer<typeof ProjectCreateSchema>;

export default function ProjectCreatePage() {
  const router = useRouter();
  const { createMutation } = useProjectMutations();
  const [formData, setFormData] = useState<FormData>({
    プロジェクトID: '',
    プロジェクト名: '',
    プロジェクト説明: '',
    プロジェクト開始日: undefined,
    プロジェクト終了日: undefined,
    プロジェクトステータスID: undefined,
    クライアント名ID: undefined,
    プロジェクト分類ID: undefined,
    予算グレードID: undefined,
    設備カテゴリID: undefined,
    商品カテゴリID: undefined,
    備考: '',
    プロジェクトフラグ: undefined,
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : parseInt(value, 10),
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : new Date(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      ProjectCreateSchema.parse(formData);
      setErrors([]);
      await createMutation.mutateAsync(formData);
      alert('プロジェクトが正常に追加されました！');
      router.push('/project/list');
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors);
      } else {
        alert(`プロジェクトの追加に失敗しました: ${createMutation.error?.message || '不明なエラー'}`);
        console.error("Failed to create project:", error);
      }
    }
  };

  const getErrorMessage = (path: string) => {
    return errors.find((err) => err.path.includes(path))?.message;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規プロジェクト追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="プロジェクトID" className="block text-sm font-medium text-gray-700">プロジェクトID <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="プロジェクトID"
            name="プロジェクトID"
            value={formData.プロジェクトID || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('プロジェクトID') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('プロジェクトID')}</p>}
        </div>

        <div>
          <label htmlFor="プロジェクト名" className="block text-sm font-medium text-gray-700">プロジェクト名 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="プロジェクト名"
            name="プロジェクト名"
            value={formData.プロジェクト名 || ''}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('プロジェクト名') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('プロジェクト名')}</p>}
        </div>

        <div>
          <label htmlFor="プロジェクト説明" className="block text-sm font-medium text-gray-700">プロジェクト説明</label>
          <textarea
            id="プロジェクト説明"
            name="プロジェクト説明"
            value={formData.プロジェクト説明 || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>

        <div>
          <label htmlFor="プロジェクト開始日" className="block text-sm font-medium text-gray-700">プロジェクト開始日</label>
          <input
            type="date"
            id="プロジェクト開始日"
            name="プロジェクト開始日"
            value={formData.プロジェクト開始日 ? formData.プロジェクト開始日.toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="プロジェクト終了日" className="block text-sm font-medium text-gray-700">プロジェクト終了日</label>
          <input
            type="date"
            id="プロジェクト終了日"
            name="プロジェクト終了日"
            value={formData.プロジェクト終了日 ? formData.プロジェクト終了日.toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="プロジェクトステータスID" className="block text-sm font-medium text-gray-700">プロジェクトステータスID</label>
          <input
            type="number"
            id="プロジェクトステータスID"
            name="プロジェクトステータスID"
            value={formData.プロジェクトステータスID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="クライアント名ID" className="block text-sm font-medium text-gray-700">クライアント名ID</label>
          <input
            type="number"
            id="クライアント名ID"
            name="クライアント名ID"
            value={formData.クライアント名ID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="プロジェクト分類ID" className="block text-sm font-medium text-gray-700">プロジェクト分類ID</label>
          <input
            type="number"
            id="プロジェクト分類ID"
            name="プロジェクト分類ID"
            value={formData.プロジェクト分類ID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="予算グレードID" className="block text-sm font-medium text-gray-700">予算グレードID</label>
          <input
            type="number"
            id="予算グレードID"
            name="予算グレードID"
            value={formData.予算グレードID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="設備カテゴリID" className="block text-sm font-medium text-gray-700">設備カテゴリID</label>
          <input
            type="number"
            id="設備カテゴリID"
            name="設備カテゴリID"
            value={formData.設備カテゴリID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="商品カテゴリID" className="block text-sm font-medium text-gray-700">商品カテゴリID</label>
          <input
            type="number"
            id="商品カテゴリID"
            name="商品カテゴリID"
            value={formData.商品カテゴリID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label htmlFor="備考" className="block text-sm font-medium text-gray-700">備考</label>
          <textarea
            id="備考"
            name="備考"
            value={formData.備考 || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          ></textarea>
        </div>

        <div>
          <label htmlFor="プロジェクトフラグ" className="block text-sm font-medium text-gray-700">プロジェクトフラグ</label>
          <input
            type="number"
            id="プロジェクトフラグ"
            name="プロジェクトフラグ"
            value={formData.プロジェクトフラグ || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? '追加中...' : 'プロジェクトを追加'}
        </button>
        {createMutation.isError && (
          <p className="text-red-500 text-sm mt-2">エラー: {createMutation.error?.message}</p>
        )}
      </form>
    </div>
  );
}
