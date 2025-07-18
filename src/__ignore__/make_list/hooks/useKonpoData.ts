import { useState, useEffect } from 'react';
import { KonpoData, GroupedData } from '../types/konpo.types';

export const useKonpoData = (projectId: string) => {
  const [data, setData] = useState<KonpoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // データ取得層
  // ==========================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bom/${projectId}/flat/konpo`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  // ==========================================
  // ビジネスロジック層
  // ==========================================
  const groupedData = data.reduce((acc: GroupedData, item) => {
    const key = `${item.Zumen_ID}-${item.PART_ID}`;
    if (!acc[key]) {
      acc[key] = {
        items: [],
        totalWeight: 0
      };
    }
    acc[key].items.push(item);
    
    // 部材の単重量を集計
    if (item.BUZAI_WEIGHT) {
      const weight = parseFloat(item.BUZAI_WEIGHT.toString());
      if (!isNaN(weight)) {
        acc[key].totalWeight += weight;
      }
    }
    
    return acc;
  }, {});

  const filteredData = (activeTab: string) => {
    return data.filter(item => {
      switch (activeTab) {
        case 'with-list':
          return item.KONPO_LIST_ID && item.KONPO_LIST_ID.trim() !== '';
        case 'without-list':
          return !item.KONPO_LIST_ID || item.KONPO_LIST_ID.trim() === '';
        default:
          return true;
      }
    });
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/bom/${projectId}/flat/konpo`);
      if (!response.ok) {
        throw new Error('データの再取得に失敗しました');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    groupedData,
    filteredData,
    refreshData
  };
}; 