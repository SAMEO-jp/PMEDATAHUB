// ==========================================
// ファイル名: useProjectListHeader.ts
// 機能: プロジェクト一覧ページ用のヘッダー設定カスタムフック
// 技術: React Hooks, Zustand
// 作成日: 2024-12-19
// ==========================================

import { useEffect } from 'react';
import { useHeader } from '@/components/layout/header/store/headerStore';

/**
 * プロジェクト一覧ページ用のヘッダー設定カスタムフック
 * @param projectCount プロジェクト数（オプション）
 * @param searchTerm 検索キーワード（オプション）
 */
export const useProjectListHeader = (
  projectCount?: number,
  searchTerm?: string
) => {
  const {
    setDisplayType,
    setDisplayConfig,
    setCurrentProject,
  } = useHeader();

  useEffect(() => {
    // ダッシュボードタイプに設定
    setDisplayType('dashboard');
    
    // プロジェクト一覧用の設定
    setDisplayConfig({
      title: 'プロジェクト一覧',
      titleSuffix: projectCount !== undefined 
        ? ` ＞ ${projectCount}件`
        : '',
      subtitle: '', // サブタイトルは非表示
      searchPlaceholder: 'プロジェクトを検索...',
      breadcrumbItems: [
        { label: 'ホーム', href: '/' },
        { label: 'プロジェクト一覧' },
      ],
    });

    // プロジェクト詳細の情報はクリア
    setCurrentProject(null);

  }, [projectCount, searchTerm, setDisplayType, setDisplayConfig, setCurrentProject]);

  return {
    // ダッシュボードモードが設定されたかどうかを返す
    isDashboardMode: true,
  };
}; 