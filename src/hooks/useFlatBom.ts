// ==========================================
// ファイル名: useFlatBom.ts
// 機能: フラットBOMデータ取得用カスタムフック
// 技術: React Hooks, Axios, TypeScript
// ==========================================

import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';
import { ApiResponse } from '../types/api';
import { FlatBomData, FlatBomPartData } from '../types/flat-bom';

/**
 * フラットBOMデータ取得用カスタムフック
 * @param projectId - プロジェクトID
 * @returns フラットBOMデータ、ローディング状態、エラー状態
 */
export const useFlatBom = (projectId: string) => {
  const [data, setData] = useState<FlatBomData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlatBom = async () => {
    if (!projectId) {
      setError('プロジェクトIDが指定されていません');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<ApiResponse<FlatBomData[]>>(
        `/api/bom/${projectId}/flat`,
        'GET'
      );
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlatBom();
  }, [projectId]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    setData(null);
    fetchFlatBom();
  };

  return { data, loading, error, refetch };
};

/**
 * 部品単一重量付きフラットBOMデータ取得用カスタムフック
 * @param projectId - プロジェクトID
 * @returns 部品単一重量付きフラットBOMデータ、ローディング状態、エラー状態
 */
export const useFlatBomPart = (projectId: string) => {
  const [data, setData] = useState<FlatBomPartData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlatBomPart = async () => {
    if (!projectId) {
      setError('プロジェクトIDが指定されていません');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<ApiResponse<FlatBomPartData[]>>(
        `/api/bom/${projectId}/flat/part`,
        'GET'
      );
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期しないエラーが発生しました';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlatBomPart();
  }, [projectId]);

  const refetch = () => {
    setLoading(true);
    setError(null);
    setData(null);
    fetchFlatBomPart();
  };

  return { data, loading, error, refetch };
}; 