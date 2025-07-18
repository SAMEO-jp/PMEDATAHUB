import { useState } from 'react';
import { GroupedData } from '../types/konpo.types';

export const useKonpoActions = (projectId: string, groupedData: GroupedData, refreshData: () => Promise<void>) => {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // ==========================================
  // イベントハンドラ層
  // ==========================================
  const toggleRow = (key: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(key)) {
      newSelectedRows.delete(key);
    } else {
      newSelectedRows.add(key);
    }
    setSelectedRows(newSelectedRows);
  };

  const toggleExpand = (key: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(key)) {
      newExpandedRows.delete(key);
    } else {
      newExpandedRows.add(key);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleGenerateTanniIds = async () => {
    // 選択された行の単位IDを取得
    const selectedTanniIds = Array.from(selectedRows).map(key => {
      const group = groupedData[key];
      return group.items[0].KONPO_TANNI_ID;
    });

    if (selectedTanniIds.length === 0) {
      alert('リストIDを作成するデータを選択してください');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/bom/${projectId}/make_konpo_list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIds: selectedTanniIds }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'リストIDの作成に失敗しました');
      }

      // データを再取得
      await refreshData();
      setSelectedRows(new Set()); // 選択をクリア
    } catch (err) {
      console.error('リストID作成エラー:', err);
      alert(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    selectedRows,
    expandedRows,
    isGenerating,
    toggleRow,
    toggleExpand,
    handleGenerateTanniIds
  };
}; 