"use client"

import { useState, useCallback, useMemo } from 'react';
import { TimeGridEvent } from '../../../types';
import { UnifiedSidebarState, UnifiedSidebarActions } from '../types/unifiedSidebar';

// 初期状態
const initialState: UnifiedSidebarState = {
  // 階層状態
  activeTab: 'project',
  projectSubTab: '計画',
  indirectSubTab: '純間接',
  detailTab: {
    project: {
      計画: '計画図',
      設計: '計画図',
      会議: '内部定例',
      その他: '出張',
      購入品: '設備'
    },
    indirect: {
      純間接: '日報入力',
      目的間接: '〇先対応',
      控除時間: '休憩'
    }
  },
  businessType: {
    planningSubType: '',
    designSubType: '',
    meetingType: '',
    otherType: '',
    purchaseType: '',
    indirectType: '',
    indirectDetailType: ''
  },

  // プロジェクト情報
  selectedProjectCode: '',
  purposeProjectCode: '',
  projects: [],

  // ユーザー情報
  currentUser: null,

  // 設備情報
  equipmentNumber: '',
  equipmentName: '',
  equipmentOptions: [],
  isLoadingEquipment: false,

  // 購入品情報
  selectedPurchaseItem: '',
  purchaseItems: [],
  isLoadingPurchaseItems: false,

  // イベント基本情報
  eventInfo: {
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    project: '',
    activityCode: ''
  },

  // システム状態
  selectedEvent: null,
  hasChanges: false,
  loading: false,
  error: null,
  isSaving: false,
  saveMessage: null,
  apiError: null,

  // 表示制御フラグ（プロパティベース）
  showProjectCode: false,
  showSubTabs: false,
  showDetailTabs: false,
  showEquipment: false,
  showPurchaseItems: false,
  showEventForm: false,
  showIndirectContent: false,
  showEventInfo: false,
  showEmptyState: true
};

export const useUnifiedSidebar = () => {
  const [state, setState] = useState<UnifiedSidebarState>(initialState);

  // 表示制御フラグを自動計算する関数
  const updateDisplayFlags = useCallback((newState: Partial<UnifiedSidebarState>) => {
    const currentState = { ...state, ...newState };
    
    const displayFlags = {
      showProjectCode: currentState.activeTab === 'project' || 
        (currentState.activeTab === 'indirect' && currentState.indirectSubTab === '目的間接'),
      showSubTabs: true, // 常に表示
      showDetailTabs: currentState.activeTab === 'project' && 
        ['計画', '設計', '会議', 'その他', '購入品'].includes(currentState.projectSubTab),
      showEquipment: currentState.activeTab === 'project' && currentState.projectSubTab === '設計',
      showPurchaseItems: currentState.activeTab === 'project' && currentState.projectSubTab === '購入品',
      showEventForm: !!currentState.selectedEvent,
      showIndirectContent: currentState.activeTab === 'indirect',
      showEventInfo: !!currentState.selectedEvent,
      showEmptyState: !currentState.selectedEvent
    };

    return { ...currentState, ...displayFlags };
  }, [state]);

  // 状態更新関数
  const updateState = useCallback((updates: Partial<UnifiedSidebarState>) => {
    setState(prevState => updateDisplayFlags({ ...prevState, ...updates }));
  }, [updateDisplayFlags]);

  // アクション関数
  const actions: UnifiedSidebarActions = useMemo(() => ({
    // 階層状態変更
    setActiveTab: (tab: 'project' | 'indirect') => {
      updateState({ activeTab: tab });
    },
    setProjectSubTab: (subTab: UnifiedSidebarState['projectSubTab']) => {
      updateState({ projectSubTab: subTab });
    },
    setIndirectSubTab: (subTab: UnifiedSidebarState['indirectSubTab']) => {
      updateState({ indirectSubTab: subTab });
    },
    setDetailTab: (mainTab: string, subTab: string, detailTab: string) => {
      updateState({
        detailTab: {
          ...state.detailTab,
          [mainTab]: {
            ...state.detailTab[mainTab as keyof typeof state.detailTab],
            [subTab]: detailTab
          }
        }
      });
    },
    setBusinessType: (type: string, value: string) => {
      updateState({
        businessType: {
          ...state.businessType,
          [type]: value
        }
      });
    },

    // プロジェクト情報変更
    setSelectedProjectCode: (code: string) => {
      updateState({ selectedProjectCode: code });
    },
    setPurposeProjectCode: (code: string) => {
      updateState({ purposeProjectCode: code });
    },
    setProjects: (projects: UnifiedSidebarState['projects']) => {
      updateState({ projects });
    },

    // ユーザー情報変更
    setCurrentUser: (user: UnifiedSidebarState['currentUser']) => {
      updateState({ currentUser: user });
    },

    // 設備情報変更
    setEquipmentNumber: (number: string) => {
      updateState({ equipmentNumber: number });
    },
    setEquipmentName: (name: string) => {
      updateState({ equipmentName: name });
    },
    setEquipmentOptions: (options: Array<{ id: string; name: string }>) => {
      updateState({ equipmentOptions: options });
    },
    setIsLoadingEquipment: (loading: boolean) => {
      updateState({ isLoadingEquipment: loading });
    },

    // 購入品情報変更
    setSelectedPurchaseItem: (item: string) => {
      updateState({ selectedPurchaseItem: item });
    },
    setPurchaseItems: (items: Array<{ keyID: string; itemName: string; itemDescription?: string }>) => {
      updateState({ purchaseItems: items });
    },
    setIsLoadingPurchaseItems: (loading: boolean) => {
      updateState({ isLoadingPurchaseItems: loading });
    },

    // イベント情報変更
    updateEventInfo: (updates: Partial<UnifiedSidebarState['eventInfo']>) => {
      updateState({
        eventInfo: {
          ...state.eventInfo,
          ...updates
        }
      });
    },

    // イベント操作
    setSelectedEvent: (event: TimeGridEvent | null) => {
      updateState({ selectedEvent: event });
    },
    updateEvent: (event: TimeGridEvent) => {
      // イベント更新時にイベント情報も同期
      updateState({
        selectedEvent: event,
        eventInfo: {
          title: event.title || '',
          description: event.description || '',
          startDateTime: event.startDateTime || '',
          endDateTime: event.endDateTime || '',
          project: event.project || '',
          activityCode: event.activityCode || ''
        }
      });
    },
    deleteEvent: () => {
      updateState({ selectedEvent: null });
    },

    // システム状態
    setHasChanges: (hasChanges: boolean) => {
      updateState({ hasChanges });
    },
    setLoading: (loading: boolean) => {
      updateState({ loading });
    },
    setError: (error: string | null) => {
      updateState({ error });
    },
    clearError: () => {
      updateState({ error: null });
    },

    // API状態
    setIsSaving: (saving: boolean) => {
      updateState({ isSaving: saving });
    },
    setSaveMessage: (message: { type: string; text: string; } | null) => {
      updateState({ saveMessage: message });
    },
    setApiError: (error: string | null) => {
      updateState({ apiError: error });
    }
  }), [state, updateState]);

  return {
    state,
    actions
  };
};
