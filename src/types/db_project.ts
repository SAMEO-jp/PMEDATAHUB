/**
 * 基本的なデータベース側のプロジェクト情報の型定義
 */
export interface Project {
  rowid: number;
  PROJECT_ID: string;
  PROJECT_NAME: string;
  PROJECT_DESCRIPTION: string;
  PROJECT_START_DATE: string;
  PROJECT_STATUS: string;
  PROJECT_CLIENT_NAME: string;
  PROJECT_CLIENT_PERSON: string;
  PROJECT_CLIENT_CONTACT: string;
  PROJECT_START_ENDDATE: string;
  PROJECT_SYSTEM_NAME: string;
  PROJECT_SYSTEM_DESCRIPTION: string;
  PROJECT_NOTE: string;
  CREATED_AT: string;
  UPDATE_AT: string;
  PROJECT_CLASSIFICATION: string;
  PROJECT_BUDGENT_GRADE: string;
  installationDate: string;
  drawingCompletionDate: string;
  PROJECT_EQUIPMENT_CATEGORY: string;
  PROJECT_SYOHIN_CATEGORY: string;
  SPARE1: string;
  SPARE2: string;
  SPARE3: string;
  IS_PROJECT: string;
}