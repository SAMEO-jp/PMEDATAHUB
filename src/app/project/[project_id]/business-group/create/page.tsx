'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProjectBusinessGroupMutations } from '@src/hooks/useProjectBusinessGroupData';
import { ProjectBusinessGroupCreateSchema } from '@src/types/projectBusinessGroup';
import { z } from 'zod';

type FormData = z.infer<typeof ProjectBusinessGroupCreateSchema>;

export default function ProjectBusinessGroupCreatePage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.project_id as string;

  const { createMutation } = useProjectBusinessGroupMutations();
  const [formData, setFormData] = useState<FormData>({
    プロジェクト業務グループID: undefined,
    親グループID: undefined,
    業務種類ID: 0,
    プロジェクトID: projectId || '',
    業務種類ID_2: 0,
    使用目的: '',
    設置場所: '',
    ステータス: '',
    使用開始日: new Date(),
    使用終了日: new Date(),
    トランザクションID: 0,
  });
  const [errors, setErrors] = useState<z.ZodIssue[]>([]);

  useEffect(() => {
    if (projectId) {
      setFormData((prev) => ({
        ...prev,
        プロジェクトID: projectId,
      }));
    }
  }, [projectId]);

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
      // プロジェクトIDをformDataに強制的に設定（Zodバリデーション前に確実にするため）
      const dataToSubmit = { ...formData, プロジェクトID: projectId };
      ProjectBusinessGroupCreateSchema.parse(dataToSubmit);
      setErrors([]);
      await createMutation.mutateAsync(dataToSubmit);
      alert('プロジェクト業務グループが正常に追加されました！');
      router.push(`/project/${projectId}/business-group/list`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors);
      } else {
        alert(`プロジェクト業務グループの追加に失敗しました: ${createMutation.error?.message || '不明なエラー'}`);
        console.error("Failed to create project business group:", error);
      }
    }
  };

  const getErrorMessage = (path: string) => {
    return errors.find((err) => err.path.includes(path))?.message;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">新規プロジェクト業務グループ追加 (プロジェクトID: {projectId})</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="プロジェクト業務グループID" className="block text-sm font-medium text-gray-700">プロジェクト業務グループID</label>
          <input
            type="number"
            id="プロジェクト業務グループID"
            name="プロジェクト業務グループID"
            value={formData.プロジェクト業務グループID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('プロジェクト業務グループID') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('プロジェクト業務グループID')}</p>}
        </div>

        <div>
          <label htmlFor="親グループID" className="block text-sm font-medium text-gray-700">親グループID</label>
          <input
            type="number"
            id="親グループID"
            name="親グループID"
            value={formData.親グループID || ''}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('親グループID') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('親グループID')}</p>}
        </div>

        <div>
          <label htmlFor="業務種類ID" className="block text-sm font-medium text-gray-700">業務種類ID <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="業務種類ID"
            name="業務種類ID"
            value={formData.業務種類ID}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('業務種類ID') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('業務種類ID')}</p>}
        </div>

        {/* プロジェクトIDはURLから自動設定されるため、読み取り専用または非表示にする */}
        <div>
          <label htmlFor="プロジェクトID" className="block text-sm font-medium text-gray-700">プロジェクトID <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="プロジェクトID"
            name="プロジェクトID"
            value={formData.プロジェクトID}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
          />
          {getErrorMessage('プロジェクトID') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('プロジェクトID')}</p>}
        </div>

        <div>
          <label htmlFor="業務種類ID_2" className="block text-sm font-medium text-gray-700">業務種類ID_2 <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="業務種類ID_2"
            name="業務種類ID_2"
            value={formData.業務種類ID_2}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('業務種類ID_2') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('業務種類ID_2')}</p>}
        </div>

        <div>
          <label htmlFor="使用目的" className="block text-sm font-medium text-gray-700">使用目的 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="使用目的"
            name="使用目的"
            value={formData.使用目的}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('使用目的') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('使用目的')}</p>}
        </div>

        <div>
          <label htmlFor="設置場所" className="block text-sm font-medium text-gray-700">設置場所 <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="設置場所"
            name="設置場所"
            value={formData.設置場所}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('設置場所') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('設置場所')}</p>}
        </div>

        <div>
          <label htmlFor="ステータス" className="block text-sm font-medium text-gray-700">ステータス <span className="text-red-500">*</span></label>
          <input
            type="text"
            id="ステータス"
            name="ステータス"
            value={formData.ステータス}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('ステータス') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('ステータス')}</p>}
        </div>

        <div>
          <label htmlFor="使用開始日" className="block text-sm font-medium text-gray-700">使用開始日 <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="使用開始日"
            name="使用開始日"
            value={formData.使用開始日 ? formData.使用開始日.toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('使用開始日') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('使用開始日')}</p>}
        </div>

        <div>
          <label htmlFor="使用終了日" className="block text-sm font-medium text-gray-700">使用終了日 <span className="text-red-500">*</span></label>
          <input
            type="date"
            id="使用終了日"
            name="使用終了日"
            value={formData.使用終了日 ? formData.使用終了日.toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('使用終了日') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('使用終了日')}</p>}
        </div>

        <div>
          <label htmlFor="トランザクションID" className="block text-sm font-medium text-gray-700">トランザクションID <span className="text-red-500">*</span></label>
          <input
            type="number"
            id="トランザクションID"
            name="トランザクションID"
            value={formData.トランザクションID}
            onChange={handleNumberChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          {getErrorMessage('トランザクションID') && <p className="text-red-500 text-xs mt-1">{getErrorMessage('トランザクションID')}</p>}
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? '追加中...' : 'プロジェクト業務グループを追加'}
        </button>
        {createMutation.isError && (
          <p className="text-red-500 text-sm mt-2">エラー: {createMutation.error?.message}</p>
        )}
      </form>
    </div>
  );
}
