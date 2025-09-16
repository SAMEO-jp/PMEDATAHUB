"use client";

import { useMemo } from 'react';

interface ProjectAssignment {
  project_id: string;
  project_name: string;
  role: string;
}

interface SetsubiAssignment {
  id: number;
  project_id: string;
  setsubi_id: number;
  seiban: string;
  setsubi_name: string;
}

interface KounyuAssignment {
  id: number;
  project_id: string;
  kounyu_id: number;
  management_number: string;
  item_name: string;
}

interface UserInfo {
  user_id: string;
  name_japanese: string;
  projects: ProjectAssignment[];
  setsubi_assignments: SetsubiAssignment[];
  kounyu_assignments: KounyuAssignment[];
}

/**
 * ユーザーのプロジェクト参加情報と担当装備・購入品情報を管理するフック
 */
export const useProjectAssignments = (userInfo: UserInfo | null) => {
  console.log('useProjectAssignments: Received userInfo:', userInfo);

  // 参加プロジェクト一覧を取得
  const userProjects = useMemo(() => {
    if (!userInfo?.projects) {
      console.log('useProjectAssignments: No projects found in userInfo');
      return [];
    }

    console.log('useProjectAssignments: Processing projects:', userInfo.projects);

    const result = userInfo.projects.map(project => ({
      code: project.project_id,
      name: project.project_name,
      description: `役割: ${project.role}`,
      status: 'active'
    }));

    console.log('useProjectAssignments: Processed userProjects:', result);
    return result;
  }, [userInfo?.projects]);

  // 指定プロジェクトの担当装備を取得
  const getSetsubiByProject = (projectId: string) => {
    if (!userInfo?.setsubi_assignments) return [];
    return userInfo.setsubi_assignments
      .filter(assignment => assignment.project_id === projectId)
      .map(assignment => ({
        id: assignment.setsubi_id,
        code: assignment.seiban,
        name: assignment.setsubi_name,
        assignmentId: assignment.id
      }));
  };

  // 指定プロジェクトの担当購入品を取得
  const getKounyuByProject = (projectId: string) => {
    if (!userInfo?.kounyu_assignments) return [];
    return userInfo.kounyu_assignments
      .filter(assignment => assignment.project_id === projectId)
      .map(assignment => ({
        id: assignment.kounyu_id,
        code: assignment.management_number,
        name: assignment.item_name,
        assignmentId: assignment.id
      }));
  };

  // 指定プロジェクトの担当情報をまとめて取得
  const getProjectAssignments = (projectId: string) => {
    return {
      setsubi: getSetsubiByProject(projectId),
      kounyu: getKounyuByProject(projectId)
    };
  };

  return {
    userProjects,
    getSetsubiByProject,
    getKounyuByProject,
    getProjectAssignments
  };
};
