import { useState, useEffect } from 'react';
import { apiRequest } from '@src/lib/apiRequest';
import type { ApiResponse } from '@src/types/api';

// ==========================================
// 型定義層
// ==========================================
interface PartData {
  ROWID: number;
  PART_ID: string;
  QUANTITY: number;
  SPARE_QUANTITY: number;
  PART_NAME: string;
  REMARKS: string;
  TEHAI_DIVISION: string;
  TEHAI_ID: string;
  MANUFACTURER: string;
  PART_PROJECT_ID: string;
  ZUMEN_ID: string;
  PART_TANNI_WEIGHT: string | null;
}

// ==========================================
// カスタムフック実装層
// ==========================================
export const usePartsData = (projectId: string) => {
  const [data, setData] = useState<PartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiRequest<ApiResponse<PartData[]>>(`/api/bom/${projectId}/parts`, 'GET');
      
      if (response.success) {
        setData(response.data);
      } else {
        setError(response.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const refetch = () => {
    setLoading(true);
    fetchData();
  };

  return { data, loading, error, refetch };
}; 