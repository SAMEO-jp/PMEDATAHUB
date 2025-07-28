import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TimeGridEvent, WorkTimeData, Employee, User, Project } from '../types';
import { demoStorage } from '../utils/demoStorage';

interface ZissekiState {
  // データ
  events: TimeGridEvent[];
  workTimes: WorkTimeData[];
  employees: Employee[];
  projects: Project[];
  currentUser: User | null;
  
  // UI状態
  loading: boolean;
  error: string | null;
  
  // セッター
  setEvents: (events: TimeGridEvent[]) => void;
  setWorkTimes: (workTimes: WorkTimeData[]) => void;
  setEmployees: (employees: Employee[]) => void;
  setProjects: (projects: Project[]) => void;
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 複合アクション
  updateEvents: (newEvents: TimeGridEvent[]) => void;
  updateWorkTimes: (newWorkTimes: WorkTimeData[]) => void;
  updateEmployees: (newEmployees: Employee[]) => void;
  updateProjects: (newProjects: Project[]) => void;
  updateCurrentUser: (newUser: User) => void;
  resetData: () => void;
  
  // 初期化
  initializeFromStorage: () => void;
}

export const useZissekiStore = create<ZissekiState>()(
  devtools(
    (set, get) => ({
      // 初期状態
      events: [],
      workTimes: [],
      employees: [],
      projects: [],
      currentUser: null,
      loading: false,
      error: null,
      
      // セッター
      setEvents: (events) => set({ events }),
      setWorkTimes: (workTimes) => set({ workTimes }),
      setEmployees: (employees) => set({ employees }),
      setProjects: (projects) => set({ projects }),
      setCurrentUser: (currentUser) => set({ currentUser }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // 複合アクション（localStorage保存付き）
      updateEvents: (newEvents) => {
        set({ events: newEvents });
        demoStorage.saveEvents(newEvents);
      },
      
      updateWorkTimes: (newWorkTimes) => {
        set({ workTimes: newWorkTimes });
        demoStorage.saveWorkTimes(newWorkTimes);
      },
      
      updateEmployees: (newEmployees) => {
        set({ employees: newEmployees });
        demoStorage.saveEmployees(newEmployees);
      },
      
      updateProjects: (newProjects) => {
        set({ projects: newProjects });
        demoStorage.saveProjects(newProjects);
      },
      
      updateCurrentUser: (newUser) => {
        set({ currentUser: newUser });
        demoStorage.saveCurrentUser(newUser);
      },
      
      resetData: () => {
        demoStorage.clearAllDemoData();
        set({
          events: [],
          workTimes: [],
          employees: [],
          projects: [],
          currentUser: null,
          error: null
        });
      },
      
      // localStorageから初期化
      initializeFromStorage: () => {
        try {
          const savedEvents = demoStorage.loadEvents();
          const savedWorkTimes = demoStorage.loadWorkTimes();
          const savedEmployees = demoStorage.loadEmployees();
          const savedProjects = demoStorage.loadProjects();
          const savedCurrentUser = demoStorage.loadCurrentUser();
          
          if (savedEvents.length > 0) set({ events: savedEvents });
          if (savedWorkTimes.length > 0) set({ workTimes: savedWorkTimes });
          if (savedEmployees.length > 0) set({ employees: savedEmployees });
          if (savedProjects.length > 0) set({ projects: savedProjects });
          if (savedCurrentUser) set({ currentUser: savedCurrentUser });
        } catch (error) {
          console.error('Failed to initialize from storage:', error);
        }
      }
    }),
    { name: 'zisseki-store' }
  )
); 