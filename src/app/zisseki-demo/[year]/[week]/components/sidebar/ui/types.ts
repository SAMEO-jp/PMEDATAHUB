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
export type UpdateEvent = (patch: any) => void;

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
  selectedEvent: any | null;
  updateEvent: (event: any) => void;
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
  onSelect: (code: string, additionalData: any) => void;
  getProjectClassifications: () => any[] | null;
  getIndirectClassifications: () => Record<string, any[]> | null;
  generateProjectCode: (mainTab: string, detailTab: string, classification: any, subTabType: string) => string;
  generateIndirectCode: (mainTab: string, detailTab: string, classification: any) => string;
  getProjectData: (classification: any) => any;
  getIndirectData: (detailTab: string, classification: any) => any;
  getPurchaseClassifications: () => any[];
}

export interface DetailClassificationsProps {
  state?: ClassificationState;
  actions?: ClassificationActions;
}

// TimeInputField用のPropsまとまり
export interface TimeInputState {
  selectedEvent: Record<string, unknown> | null;
  label?: string;
}

export interface TimeInputActions {
  onEventUpdate: (eventId: string, updates: any) => void;
}

export interface TimeInputProps {
  state?: TimeInputState;
  actions?: TimeInputActions;
}
