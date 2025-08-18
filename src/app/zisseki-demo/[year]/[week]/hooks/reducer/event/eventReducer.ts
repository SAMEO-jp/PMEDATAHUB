import { EventState, EventAction } from './types';

export const initialState: EventState = {
  events: [],
  selectedEvent: null,
  
  // UI状態（4段階階層を含む）
  ui: {
    hierarchy: {
      // レベル1: メインタブ
      activeTab: 'project',
      
      // レベル2: サブタブ
      activeSubTabs: {
        project: '計画',
        indirect: '純間接'
      },
      
      // レベル3: 詳細タブ
      detailTabs: {
        project: {
          計画: '計画図',
          設計: '計画図',
          会議: '内部会議',
          購入品: '設備',
          その他: '出張'
        },
        indirect: {
          純間接: '日報入力',
          目的間接: '〇先対応',
          控除時間: '休憩'
        }
      },
      
      // レベル4: 業務タイプ
      businessTypes: {
        planning: { planningSubType: '' },
        design: { designSubType: '' },
        meeting: { meetingType: '' },
        purchase: { purchaseType: '' },
        other: { otherType: '' },
        indirect: { indirectType: '' }
      }
    },
    
    modals: {},
    dragState: {
      isDragging: false,
      draggedEvent: null
    },
    resizeState: {
      isResizing: false,
      resizedEvent: null
    }
  },
  
  // サイドバー状態（イベントと連携）
  sidebar: {
    selectedProjectCode: '',
    purposeProjectCode: '',
    tabDetails: {
      planning: { planningSubType: '', estimateSubType: '' },
      design: { designSubType: '' },
      meeting: { meetingType: '' },
      other: { travelType: '', stakeholderType: '', documentType: '' },
      indirect: { otherSubTab: '〇先対応', indirectDetailTab: '日報入力' }
    }
  },
  
  // システム状態
  loading: true,
  error: null
};

export function eventReducer(state: EventState, action: EventAction): EventState {
  switch (action.type) {
    // イベントデータ関連
    case 'SET_EVENTS':
      return { 
        ...state, 
        events: action.payload, 
        loading: false,
        error: null 
      };
    
    case 'ADD_EVENT':
      return { 
        ...state, 
        events: [...state.events, action.payload],
        error: null 
      };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId ? action.payload.event : event
        ),
        error: null
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
        error: null
      };
    
    // UI状態関連
    case 'SET_SELECTED_EVENT':
      return { ...state, selectedEvent: action.payload };
    
    case 'SET_MODAL_OPEN':
      return {
        ...state,
        ui: {
          ...state.ui,
          modals: {
            ...state.ui.modals,
            [action.payload.modalType]: action.payload.isOpen
          }
        }
      };
    
    case 'SET_DRAG_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          dragState: {
            isDragging: action.payload.isDragging,
            draggedEvent: action.payload.draggedEvent
          }
        }
      };
    
    case 'SET_RESIZE_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          resizeState: {
            isResizing: action.payload.isResizing,
            resizedEvent: action.payload.resizedEvent
          }
        }
      };
    
    // 階層状態関連
    case 'SET_ACTIVE_TAB':
      return { 
        ...state, 
        ui: {
          ...state.ui,
          hierarchy: {
            ...state.ui.hierarchy,
            activeTab: action.payload
          }
        }
      };
    
    case 'SET_ACTIVE_SUBTAB':
      return {
        ...state,
        ui: {
          ...state.ui,
          hierarchy: {
            ...state.ui.hierarchy,
            activeSubTabs: {
              ...state.ui.hierarchy.activeSubTabs,
              [action.payload.tab]: action.payload.subTab
            }
          }
        }
      };
    
    case 'SET_DETAIL_TAB':
      return {
        ...state,
        ui: {
          ...state.ui,
          hierarchy: {
            ...state.ui.hierarchy,
            detailTabs: {
              ...state.ui.hierarchy.detailTabs,
              [action.payload.mainTab]: {
                ...state.ui.hierarchy.detailTabs[action.payload.mainTab as keyof typeof state.ui.hierarchy.detailTabs],
                [action.payload.subTab]: action.payload.detailTab
              } as any
            }
          }
        }
      };
    
    case 'SET_BUSINESS_TYPE':
      return {
        ...state,
        ui: {
          ...state.ui,
          hierarchy: {
            ...state.ui.hierarchy,
            businessTypes: {
              ...state.ui.hierarchy.businessTypes,
              [action.payload.businessType]: {
                ...state.ui.hierarchy.businessTypes[action.payload.businessType as keyof typeof state.ui.hierarchy.businessTypes],
                [action.payload.subType]: action.payload.value
              } as any
            }
          }
        }
      };
    
    // 共通状態
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    // サイドバー状態関連
    case 'SET_SELECTED_PROJECT_CODE':
      return { 
        ...state, 
        sidebar: {
          ...state.sidebar,
          selectedProjectCode: action.payload
        }
      };
    
    case 'SET_PURPOSE_PROJECT_CODE':
      return { 
        ...state, 
        sidebar: {
          ...state.sidebar,
          purposeProjectCode: action.payload
        }
      };
    
    case 'SET_TAB_DETAIL':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          tabDetails: {
            ...state.sidebar.tabDetails,
            [action.payload.tab as keyof typeof state.sidebar.tabDetails]: {
              ...state.sidebar.tabDetails[action.payload.tab as keyof typeof state.sidebar.tabDetails],
              [action.payload.detail]: action.payload.value
            } as any
          }
        }
      };
    
    case 'SET_INDIRECT_DETAIL':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          tabDetails: {
            ...state.sidebar.tabDetails,
            indirect: {
              ...state.sidebar.tabDetails.indirect,
              [action.payload.detail]: action.payload.value
            }
          }
        }
      };
    
    case 'UPDATE_SIDEBAR_STATE':
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          ...action.payload
        }
      };
    
    // 統合操作
    case 'SYNC_EVENT_TO_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          hierarchy: {
            activeTab: (action.payload.selectedTab as 'project' | 'indirect') || 'project',
            activeSubTabs: {
              project: action.payload.selectedProjectSubTab || '計画',
              indirect: action.payload.selectedIndirectSubTab || '純間接'
            },
            detailTabs: {
              project: {
                計画: action.payload.planningSubType || '計画図',
                設計: action.payload.designSubType || '計画図',
                会議: action.payload.meetingType || '内部会議',
                購入品: '設備',
                その他: action.payload.travelType || '出張'
              },
              indirect: {
                純間接: action.payload.selectedIndirectDetailTab || '日報入力',
                目的間接: action.payload.selectedOtherSubTab || '〇先対応',
                控除時間: '休憩'
              }
            },
            businessTypes: {
              planning: { planningSubType: action.payload.planningSubType || '' },
              design: { designSubType: action.payload.designSubType || '' },
              meeting: { meetingType: action.payload.meetingType || '' },
              purchase: { purchaseType: '' },
              other: { otherType: action.payload.travelType || '' },
              indirect: { indirectType: action.payload.selectedIndirectDetailTab || '' }
            }
          }
        },
        sidebar: {
          selectedProjectCode: action.payload.project || '',
          purposeProjectCode: action.payload.purposeProject || '',
          tabDetails: {
            planning: {
              planningSubType: action.payload.planningSubType || '',
              estimateSubType: action.payload.estimateSubType || ''
            },
            design: {
              designSubType: action.payload.designSubType || ''
            },
            meeting: {
              meetingType: action.payload.meetingType || ''
            },
            other: {
              travelType: action.payload.travelType || '',
              stakeholderType: action.payload.stakeholderType || '',
              documentType: action.payload.documentType || ''
            },
            indirect: {
              otherSubTab: action.payload.selectedOtherSubTab || '〇先対応',
              indirectDetailTab: action.payload.selectedIndirectDetailTab || '日報入力'
            }
          }
        }
      };
      
    case 'SYNC_SIDEBAR_TO_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId 
            ? { 
                ...event, 
                project: action.payload.sidebarState.selectedProjectCode || event.project,
                purposeProject: action.payload.sidebarState.purposeProjectCode || event.purposeProject,
                ...action.payload.sidebarState.tabDetails && {
                  planningSubType: action.payload.sidebarState.tabDetails.planning?.planningSubType || event.planningSubType,
                  estimateSubType: action.payload.sidebarState.tabDetails.planning?.estimateSubType || event.estimateSubType,
                  designSubType: action.payload.sidebarState.tabDetails.design?.designSubType || event.designSubType,
                  meetingType: action.payload.sidebarState.tabDetails.meeting?.meetingType || event.meetingType,
                  travelType: action.payload.sidebarState.tabDetails.other?.travelType || event.travelType,
                  stakeholderType: action.payload.sidebarState.tabDetails.other?.stakeholderType || event.stakeholderType,
                  documentType: action.payload.sidebarState.tabDetails.other?.documentType || event.documentType
                }
              }
            : event
        )
      };
    
    case 'SYNC_HIERARCHY_TO_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.eventId 
            ? { 
                ...event, 
                selectedTab: action.payload.hierarchyState.activeTab || event.selectedTab,
                selectedProjectSubTab: action.payload.hierarchyState.activeSubTabs?.project || event.selectedProjectSubTab,
                selectedIndirectSubTab: action.payload.hierarchyState.activeSubTabs?.indirect || event.selectedIndirectSubTab,
                ...action.payload.hierarchyState.businessTypes && {
                  planningSubType: action.payload.hierarchyState.businessTypes.planning?.planningSubType || event.planningSubType,
                  designSubType: action.payload.hierarchyState.businessTypes.design?.designSubType || event.designSubType,
                  meetingType: action.payload.hierarchyState.businessTypes.meeting?.meetingType || event.meetingType
                }
              }
            : event
        )
      };
    
    default:
      return state;
  }
} 