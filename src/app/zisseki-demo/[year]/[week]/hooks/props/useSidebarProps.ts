import { useZissekiStore } from '../../store/zissekiStore';
import { useEventContext } from '@src/app/zisseki-demo/[year]/[week]/context/EventContext';

export const useSidebarProps = (year: number, week: number) => {
  // Zustandストアからデータを取得（マスターデータ）
  const {
    employees,   // 従業員一覧
    projects,    // プロジェクト一覧
    currentUser, // 現在のユーザー
  } = useZissekiStore();

  // 統合されたイベント・UI状態管理フック（シングルトン）
  const {
    selectedEvent,
    setSelectedEvent,
    activeTab,
    activeSubTabs,
    setActiveTab,
    setActiveSubTab,
    error: uiError,
    clearError: clearUIError,
    handleDeleteEvent,
    updateEventHandler,
    // 新規追加（Event Reducerから統合）
    selectedProjectCode,
    purposeProjectCode,
    tabDetails,
    setSelectedProjectCode,
    setPurposeProjectCode,
    setTabDetail,
    setIndirectDetail
  } = useEventContext();

  // デバッグ用: selectedEventの値を確認
  console.log('useSidebarProps - selectedEvent:', selectedEvent);
  console.log('useSidebarProps - selectedEvent truthy:', !!selectedEvent);
  console.log('useSidebarProps - tabDetails:', tabDetails);

  // 統合されたエラー状態
  const hasError = uiError;

  return {
    // ZissekiSidebarPropsの型に合わせて修正
    selectedTab: activeTab,
    setSelectedTab: setActiveTab,
    selectedProjectSubTab: activeSubTabs.project || 'overview',
    _setSelectedProjectSubTab: (subTab: string) => setActiveSubTab('project', subTab),
    selectedEvent,
    _hasChanges: false, // 変更フラグは別途管理
    handleDeleteEvent,
    updateEvent: updateEventHandler,
    _employees: employees,
    projects,
    setSelectedEvent,
    _currentUser: currentUser,
    indirectSubTab: activeSubTabs.indirect || '純間接',
    setIndirectSubTab: (subTab: string) => setActiveSubTab('indirect', subTab),
    
    // 新規追加（Event Reducerから統合）
    selectedProjectCode,
    purposeProjectCode,
    tabDetails,
    setSelectedProjectCode,
    setPurposeProjectCode,
    setTabDetail,
    setIndirectDetail,
    
    // エラー管理（デバッグ用）
    hasError,
    uiError,
    clearUIError,
    
    // パラメータ
    year,
    week
  };
}; 