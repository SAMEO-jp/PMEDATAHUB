import { WorkTimeData, Employee, User, Project, TimeGridEvent } from '../types';

// localStorageのキー定数
const STORAGE_KEYS = {
  DEMO_EVENTS: 'zisseki_demo_events',
  DEMO_WORK_TIMES: 'zisseki_demo_work_times',
  DEMO_EMPLOYEES: 'zisseki_demo_employees',
  DEMO_PROJECTS: 'zisseki_demo_projects',
  DEMO_CURRENT_USER: 'zisseki_demo_current_user',
  DEMO_UI_STATE: 'zisseki_demo_ui_state',
  DEMO_LAST_UPDATED: 'zisseki_demo_last_updated'
} as const;

export interface DemoUIState {
  selectedTab: string;
  selectedProjectSubTab: string;
  indirectSubTab: string;
  selectedEvent: TimeGridEvent | null;
  hasChanges: boolean;
}

// localStorageユーティリティ関数
export const demoStorage = {
  // データの保存
  saveEvents: (events: TimeGridEvent[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_EVENTS, JSON.stringify(events));
      localStorage.setItem(STORAGE_KEYS.DEMO_LAST_UPDATED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save events to localStorage:', error);
    }
  },

  saveWorkTimes: (workTimes: WorkTimeData[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_WORK_TIMES, JSON.stringify(workTimes));
      localStorage.setItem(STORAGE_KEYS.DEMO_LAST_UPDATED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save work times to localStorage:', error);
    }
  },

  saveEmployees: (employees: Employee[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_EMPLOYEES, JSON.stringify(employees));
      localStorage.setItem(STORAGE_KEYS.DEMO_LAST_UPDATED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save employees to localStorage:', error);
    }
  },

  saveProjects: (projects: Project[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_PROJECTS, JSON.stringify(projects));
      localStorage.setItem(STORAGE_KEYS.DEMO_LAST_UPDATED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save projects to localStorage:', error);
    }
  },

  saveCurrentUser: (user: User) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_CURRENT_USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.DEMO_LAST_UPDATED, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save current user to localStorage:', error);
    }
  },

  saveUIState: (uiState: DemoUIState) => {
    try {
      localStorage.setItem(STORAGE_KEYS.DEMO_UI_STATE, JSON.stringify(uiState));
    } catch (error) {
      console.error('Failed to save UI state to localStorage:', error);
    }
  },

  // データの読み込み
  loadEvents: (): TimeGridEvent[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_EVENTS);
      return data ? JSON.parse(data) as TimeGridEvent[] : [];
    } catch (error) {
      console.error('Failed to load events from localStorage:', error);
      return [];
    }
  },

  loadWorkTimes: (): WorkTimeData[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_WORK_TIMES);
      return data ? JSON.parse(data) as WorkTimeData[] : [];
    } catch (error) {
      console.error('Failed to load work times from localStorage:', error);
      return [];
    }
  },

  loadEmployees: (): Employee[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_EMPLOYEES);
      return data ? JSON.parse(data) as Employee[] : [];
    } catch (error) {
      console.error('Failed to load employees from localStorage:', error);
      return [];
    }
  },

  loadProjects: (): Project[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_PROJECTS);
      return data ? JSON.parse(data) as Project[] : [];
    } catch (error) {
      console.error('Failed to load projects from localStorage:', error);
      return [];
    }
  },

  loadCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_CURRENT_USER);
      return data ? JSON.parse(data) as User : null;
    } catch (error) {
      console.error('Failed to load current user from localStorage:', error);
      return null;
    }
  },

  loadUIState: (): DemoUIState | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DEMO_UI_STATE);
      return data ? JSON.parse(data) as DemoUIState : null;
    } catch (error) {
      console.error('Failed to load UI state from localStorage:', error);
      return null;
    }
  },

  // データの削除
  clearAllDemoData: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear demo data from localStorage:', error);
    }
  },

  // データの存在確認
  hasDemoData: (): boolean => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEMO_EVENTS) !== null;
    } catch (error) {
      console.error('Failed to check demo data existence:', error);
      return false;
    }
  },

  // 最終更新日時の取得
  getLastUpdated: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DEMO_LAST_UPDATED);
    } catch (error) {
      console.error('Failed to get last updated time:', error);
      return null;
    }
  }
}; 