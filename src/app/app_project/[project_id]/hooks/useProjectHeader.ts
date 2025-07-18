// ==========================================
// ファイル名: useProjectHeader.ts
// 機能: プロジェクト情報をヘッダーストアに設定するカスタムフック
// 技術: React Hooks, Zustand
// 作成日: 2024-12-19
// ==========================================

import { useEffect } from 'react';
import { useHeader } from '@/src/components/layout/header/store/headerStore';
import { Project } from '@/src/types/db_project';
import { ProjectInfo } from '@/src/components/layout/header/store/headerStore';

/**
 * プロジェクト情報をヘッダーストアに設定するカスタムフック
 * @param project プロジェクト情報
 */
export const useProjectHeader = (
  project: Project | null
) => {
  const {
    setDisplayType,
    setCurrentProject,
    setDisplayConfig,
  } = useHeader();

  useEffect(() => {
    if (!project) {
      // プロジェクトが存在しない場合はデフォルトタイプに戻す
      setDisplayType('default');
      setCurrentProject(null);
      setDisplayConfig({
        title: 'プロジェクト詳細',
        subtitle: '',
        breadcrumbItems: [],
      });
      return;
    }

    // プロジェクト情報をヘッダーストアの形式に変換
    const projectInfo: ProjectInfo = {
      id: project.PROJECT_ID,
      name: project.PROJECT_NAME,
      code: project.PROJECT_ID,
      description: project.PROJECT_DESCRIPTION,
      status: mapProjectStatus(project.PROJECT_STATUS),
      startDate: project.PROJECT_START_DATE,
      endDate: project.PROJECT_START_ENDDATE,
    };

    // ヘッダーストアに設定
    setDisplayType('project-detail');
    setCurrentProject(projectInfo);
    setDisplayConfig({
      title: project.PROJECT_NAME,
      titleSuffix: ' ＞ 詳細',
      subtitle: '', // サブタイトルを非表示
      breadcrumbItems: [], // パンくずリストを非表示
      searchPlaceholder: '',
    });

  }, [project, setDisplayType, setCurrentProject, setDisplayConfig]);

  // プロジェクトステータスをマッピング
  const mapProjectStatus = (status: string): 'active' | 'completed' | 'pending' => {
    switch (status.toLowerCase()) {
      case 'active':
      case '進行中':
        return 'active';
      case 'completed':
      case '完了':
        return 'completed';
      default:
        return 'pending';
    }
  };

  return {
    // プロジェクト情報が設定されたかどうかを返す
    isProjectSet: !!project,
  };
}; 