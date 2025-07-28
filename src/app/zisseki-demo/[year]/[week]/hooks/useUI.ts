import { useState, useEffect, useCallback } from 'react';
import { demoStorage, DemoUIState } from '../utils/demoStorage';
import { TimeGridEvent } from '../types';

export const useUI = () => {
  // 初期状態の設定
  const getInitialUIState = (): DemoUIState => ({
    selectedTab: "project",
    selectedProjectSubTab: "計画",
    indirectSubTab: "純間接",
    selectedEvent: null,
    hasChanges: false
  });

  const [uiState, setUIState] = useState<DemoUIState>(getInitialUIState);

  // localStorageからUI状態を読み込み
  const loadUIState = useCallback(() => {
    const savedUIState = demoStorage.loadUIState();
    if (savedUIState) {
      setUIState(savedUIState);
    }
  }, []);

  // UI状態をlocalStorageに保存
  const saveUIState = useCallback((newState: DemoUIState) => {
    demoStorage.saveUIState(newState);
  }, []);

  // 状態更新関数
  const setSelectedTab = useCallback((tab: string) => {
    const newState = { ...uiState, selectedTab: tab };
    setUIState(newState);
    saveUIState(newState);
  }, [uiState, saveUIState]);

  const setSelectedProjectSubTab = useCallback((subTab: string) => {
    const newState = { ...uiState, selectedProjectSubTab: subTab };
    setUIState(newState);
    saveUIState(newState);
  }, [uiState, saveUIState]);

  const setIndirectSubTab = useCallback((subTab: string) => {
    const newState = { ...uiState, indirectSubTab: subTab };
    setUIState(newState);
    saveUIState(newState);
  }, [uiState, saveUIState]);

  const setSelectedEvent = useCallback((event: TimeGridEvent | null) => {
    const newState = { ...uiState, selectedEvent: event };
    setUIState(newState);
    saveUIState(newState);
  }, [uiState, saveUIState]);

  const setHasChanges = useCallback((hasChanges: boolean) => {
    const newState = { ...uiState, hasChanges };
    setUIState(newState);
    saveUIState(newState);
  }, [uiState, saveUIState]);

  // UI状態のリセット
  const resetUIState = useCallback(() => {
    const initialState = getInitialUIState();
    setUIState(initialState);
    saveUIState(initialState);
  }, [saveUIState]);

  // コンポーネントマウント時にlocalStorageから状態を読み込み
  useEffect(() => {
    loadUIState();
  }, [loadUIState]);

  return {
    selectedTab: uiState.selectedTab,
    setSelectedTab,
    selectedProjectSubTab: uiState.selectedProjectSubTab,
    setSelectedProjectSubTab,
    indirectSubTab: uiState.indirectSubTab,
    setIndirectSubTab,
    selectedEvent: uiState.selectedEvent,
    setSelectedEvent,
    hasChanges: uiState.hasChanges,
    setHasChanges,
    resetUIState
  };
}; 