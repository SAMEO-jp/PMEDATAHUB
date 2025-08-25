import { ClassificationItem } from '../../../constants/activity-codes';

// タブ型の集中管理
export const TAB = { PROJECT: 'project', INDIRECT: 'indirect' } as const;
export type Tab = typeof TAB[keyof typeof TAB];

// サブタブ設定の型定義
export interface SubTabConfig {
  name: string;
  color: string;
  subTabs?: string[];
}

// プロジェクトサブタブ設定の型
export type ProjectSubTabConfigs = Record<string, SubTabConfig>;

// 間接業務サブタブ設定の型
export type IndirectSubTabConfigs = Record<string, SubTabConfig>;

// Project型の厳密化
export interface Project {
  code: string;        // projectCode を code に統一
  name: string;        // projectName を name に統一
  description?: string;
  status?: string;
}

// イベント更新の型定義
export type UpdateEvent = (patch: Partial<{
  id: string;
  title: string;
  description: string;
  project: string;
  startDateTime: string;
  endDateTime: string;
  activityCode?: string;
  employeeNumber?: string;
  equipmentNumber?: string;
  equipmentName?: string;
  purposeProject?: string;
  departmentCode?: string;
  status?: string;
  category?: string;
  selectedTab?: string;
  selectedProjectSubTab?: string;
  selectedIndirectSubTab?: string;
}>) => void;

// ローカル変更と確定の型定義
export type OnLocalChange = (value: string) => void;
export type OnCommit = (value: string) => void;

// Propsまとまりのオブジェクト化
export interface TabState {
  selected: Tab;
  projectSub: string;
  indirectSub: string;
  onChange: (tab: Tab) => void;
}

export interface EventBinding {
  selectedEvent: {
    id: string;
    title: string;
    description: string;
    project: string;
    startDateTime: string;
    endDateTime: string;
    activityCode?: string;
    employeeNumber?: string;
    equipmentNumber?: string;
    equipmentName?: string;
    purposeProject?: string;
    departmentCode?: string;
    status?: string;
    category?: string;
    selectedTab?: string;
    selectedProjectSubTab?: string;
    selectedIndirectSubTab?: string;
    color?: string;
    top?: number;
    height?: number;
    unsaved?: boolean;
  } | null;
  updateEvent: (event: Partial<{
    id: string;
    title: string;
    description: string;
    project: string;
    startDateTime: string;
    endDateTime: string;
    activityCode?: string;
    employeeNumber?: string;
    equipmentNumber?: string;
    equipmentName?: string;
    purposeProject?: string;
    departmentCode?: string;
    status?: string;
    category?: string;
    selectedTab?: string;
    selectedProjectSubTab?: string;
    selectedIndirectSubTab?: string;
    color?: string;
    top?: number;
    height?: number;
    unsaved?: boolean;
  }>) => void;
}

export interface FormState {
  title: string;
  description: string;
  project: string;
  activityCode: string;
  onLocalChange: (field: string, value: string) => void;
  onCommit: (field: string, value: string) => void;
}

// SidebarActiveCodeEditor用のPropsまとまり
export interface ActiveCodeEditorState {
  selectedTab: Tab;
  projectSubTab: string;
  indirectSubTab: string;
}

export interface ActiveCodeEditorProps {
  state?: ActiveCodeEditorState;
  event?: EventBinding;
}

// DetailClassifications用のPropsまとまり
export interface ClassificationState {
  selectedTab: Tab;
  mainSubTab: string;
  detailSubTab: string;
  currentCode: string;
}

export interface ClassificationActions {
  onSelect: (code: string, additionalData: Record<string, unknown>) => void;
  getProjectClassifications: () => ClassificationItem[] | null;
  getIndirectClassifications: () => Record<string, ClassificationItem[]> | null;
  generateProjectCode: (mainTab: string, detailTab: string, classification: ClassificationItem, subTabType: string) => string;
  generateIndirectCode: (mainTab: string, detailTab: string, classification: ClassificationItem) => string;
  getProjectData: (classification: ClassificationItem) => Record<string, unknown>;
  getIndirectData: (detailTab: string, classification: ClassificationItem) => Record<string, unknown>;
  getPurchaseClassifications: () => ClassificationItem[];
}

export interface DetailClassificationsProps {
  state?: ClassificationState;
  actions?: ClassificationActions;
}

// TimeInputField用のPropsまとまり
export interface TimeInputState {
  selectedEvent: {
    id: string;
    startDateTime: string;
    endDateTime: string;
  } | null;
  label?: string;
}

export interface TimeInputActions {
  onEventUpdate: (eventId: string, updates: Partial<{
    startDateTime: string;
    endDateTime: string;
    top: number;
    height: number;
    unsaved: boolean;
  }>) => void;
}

export interface TimeInputProps {
  state?: TimeInputState;
  actions?: TimeInputActions;
}
