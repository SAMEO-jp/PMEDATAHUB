import { useReducer, useCallback } from 'react';
import { WorkTimeData } from '../../types';

// ========================================
// アクションの型定義
// ========================================
type WorkTimeAction = 
  | { type: 'SET_WORK_TIMES'; payload: WorkTimeData[] }
  | { type: 'UPDATE_WORK_TIME'; payload: { date: string; startTime: string; endTime: string } }
  | { type: 'ADD_WORK_TIME'; payload: WorkTimeData }
  | { type: 'DELETE_WORK_TIME'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR'; payload: void }
  | { type: 'SET_HAS_CHANGES'; payload: boolean };

// ========================================
// 状態の型定義
// ========================================
interface WorkTimeState {
  workTimes: WorkTimeData[];
  loading: boolean;
  error: string | null;
  hasChanges: boolean;
}

// ========================================
// 初期状態
// ========================================
const initialState: WorkTimeState = {
  workTimes: [],
  loading: false,
  error: null,
  hasChanges: false
};

// ========================================
// リデューサー関数
// ========================================
function workTimeReducer(state: WorkTimeState, action: WorkTimeAction): WorkTimeState {
  switch (action.type) {
    case 'SET_WORK_TIMES':
      return { 
        ...state, 
        workTimes: action.payload, 
        loading: false,
        error: null,
        hasChanges: false
      };
    
    case 'UPDATE_WORK_TIME': {
      const updatedWorkTimes = state.workTimes.map(wt => 
        wt.date === action.payload.date 
          ? { ...wt, startTime: action.payload.startTime, endTime: action.payload.endTime }
          : wt
      );
      return { 
        ...state, 
        workTimes: updatedWorkTimes,
        hasChanges: true,
        error: null 
      };
    }
    
    case 'ADD_WORK_TIME':
      return { 
        ...state, 
        workTimes: [...state.workTimes, action.payload],
        hasChanges: true,
        error: null 
      };
    
    case 'DELETE_WORK_TIME':
      return {
        ...state,
        workTimes: state.workTimes.filter(wt => wt.date !== action.payload),
        hasChanges: true,
        error: null
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_HAS_CHANGES':
      return { ...state, hasChanges: action.payload };
    
    default:
      return state;
  }
}

/**
 * 勤務時間管理フック（useReducer版）
 * 
 * 機能:
 * - 勤務時間データの管理
 * - 勤務時間の更新・追加・削除
 * - 変更フラグの管理
 * - エラーハンドリング
 */
export const useWorkTimeReducer = () => {
  const [state, dispatch] = useReducer(workTimeReducer, initialState);

  // 勤務時間を設定
  const setWorkTimes = useCallback((workTimes: WorkTimeData[]) => {
    dispatch({ type: 'SET_WORK_TIMES', payload: workTimes });
  }, []);

  // 勤務時間を更新
  const updateWorkTime = useCallback((date: string, startTime: string, endTime: string) => {
    console.log('勤務時間更新:', { date, startTime, endTime });
    dispatch({ type: 'UPDATE_WORK_TIME', payload: { date, startTime, endTime } });
  }, []);

  // 勤務時間を追加
  const addWorkTime = useCallback((workTime: WorkTimeData) => {
    console.log('勤務時間追加:', workTime);
    dispatch({ type: 'ADD_WORK_TIME', payload: workTime });
  }, []);

  // 勤務時間を削除
  const deleteWorkTime = useCallback((date: string) => {
    console.log('勤務時間削除:', date);
    dispatch({ type: 'DELETE_WORK_TIME', payload: date });
  }, []);

  // ローディング状態を設定
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  // エラーを設定
  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  // エラーをクリア
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR', payload: undefined });
  }, []);

  // 変更フラグを設定
  const setHasChanges = useCallback((hasChanges: boolean) => {
    dispatch({ type: 'SET_HAS_CHANGES', payload: hasChanges });
  }, []);

  return {
    workTimes: state.workTimes,
    loading: state.loading,
    error: state.error,
    hasChanges: state.hasChanges,
    setWorkTimes,
    updateWorkTime,
    addWorkTime,
    deleteWorkTime,
    setLoading,
    setError,
    clearError,
    setHasChanges
  };
}; 