import type { Meta, StoryObj } from '@storybook/react';
import { UnifiedSidebar } from './UnifiedSidebar';
import { UnifiedSidebarState, UnifiedSidebarActions } from './types/unifiedSidebar';
import { MockEventProvider } from './__mocks__/EventProvider';

// Mock data
const mockProjects = [
  { projectCode: 'P001', projectName: 'プロジェクトA', name: 'プロジェクトA', isProject: '1' },
  { projectCode: 'P002', projectName: 'プロジェクトB', name: 'プロジェクトB', isProject: '1' },
  { projectCode: 'P003', projectName: 'プロジェクトC', name: 'プロジェクトC', isProject: '1' },
];

const mockUser = {
  id: 'user001',
  name: '田中太郎',
  department: '開発部',
  projects: mockProjects
};

const mockEvent = {
  id: 'event1',
  title: '設計レビュー会議',
  startDate: '2024-01-15',
  startTime: '09:00',
  endTime: '11:00',
  projectCode: 'P001',
  activityCode: 'DESIGN',
  description: '基本設計の確認',
  businessType: '会議',
  businessSubType: '内部定例',
  user: 'user001'
};

// Base state for stories
const createBaseState = (overrides: Partial<UnifiedSidebarState> = {}): UnifiedSidebarState => ({
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
      購入品: '購入品A'
    },
    indirect: {
      純間接: '日報入力',
      目的間接: '〇先対応',
      控除時間: '休憩'
    }
  },
  businessType: {
    planningSubType: '計画図',
    designSubType: '計画図',
    meetingType: '内部定例',
    otherType: '出張',
    purchaseType: '購入品A',
    indirectType: '日報入力',
    indirectDetailType: '〇先対応'
  },

  // プロジェクト情報
  selectedProjectCode: 'P001',
  purposeProjectCode: 'P002',
  projects: mockProjects,

  // ユーザー情報
  currentUser: mockUser,

  // 設備情報
  equipmentNumber: 'EQ001',
  equipmentName: '設備A',
  equipmentOptions: [
    { id: 'EQ001', name: '設備A' },
    { id: 'EQ002', name: '設備B' }
  ],
  isLoadingEquipment: false,

  // 購入品情報
  selectedPurchaseItem: 'ITEM001',
  purchaseItems: [
    { keyID: 'ITEM001', itemName: '購入品A', itemDescription: '購入品Aの説明' },
    { keyID: 'ITEM002', itemName: '購入品B', itemDescription: '購入品Bの説明' }
  ],
  isLoadingPurchaseItems: false,

  // イベント情報
  eventInfo: {
    title: '設計レビュー会議',
    description: '基本設計の確認',
    startDateTime: '2024-01-15T09:00',
    endDateTime: '2024-01-15T11:00',
    project: 'P001',
    activityCode: 'DESIGN'
  },

  // システム状態
  selectedEvent: mockEvent,
  hasChanges: false,
  loading: false,
  error: null,
  isSaving: false,
  saveMessage: null,
  apiError: null,

  // 表示制御フラグ
  showProjectCode: true,
  showSubTabs: true,
  showDetailTabs: true,
  showEquipment: false,
  showPurchaseItems: false,
  showEventForm: true,
  showIndirectContent: false,
  showEventInfo: true,
  showEmptyState: false,

  ...overrides
});

// Mock actions
const createMockActions = (): UnifiedSidebarActions => ({
  setActiveTab: (tab) => {},
  setProjectSubTab: (subTab) => {},
  setIndirectSubTab: (subTab) => {},
  setDetailTab: (mainTab, subTab, detailTab) => {},
  setBusinessType: (type, value) => {},
  
  setSelectedProjectCode: (code) => {},
  setPurposeProjectCode: (code) => {},
  setProjects: (projects) => {},
  
  setCurrentUser: (user) => {},
  
  setEquipmentNumber: (number) => {},
  setEquipmentName: (name) => {},
  setEquipmentOptions: (options) => {},
  setIsLoadingEquipment: (loading) => {},
  
  setSelectedPurchaseItem: (item) => {},
  setPurchaseItems: (items) => {},
  setIsLoadingPurchaseItems: (loading) => {},
  
  updateEventInfo: (updates) => {},
  
  setSelectedEvent: (event) => {},
  updateEvent: (event) => {},
  deleteEvent: () => {},
  
  setHasChanges: (hasChanges) => {},
  setLoading: (loading) => {},
  setError: (error) => {},
  clearError: () => {},
  
  setIsSaving: (saving) => {},
  setSaveMessage: (message) => {},
  setApiError: (error) => {},
});

const meta: Meta<typeof UnifiedSidebar> = {
  title: 'ZissekiDemo/Sidebar/UnifiedSidebar',
  component: UnifiedSidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'WeekShiwake機能のメインサイドバーコンポーネント。プロジェクト業務と間接業務の詳細入力を管理します。'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MockEventProvider>
        <div className="min-h-screen bg-gray-100 p-4">
          <Story />
        </div>
      </MockEventProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// プロジェクト業務 - 基本状態
export const ProjectDefault: Story = {
  args: {
    state: createBaseState(),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: 'プロジェクト業務タブの基本状態。計画タブが選択されています。'
      }
    }
  }
};

// プロジェクト業務 - 設計タブ
export const ProjectDesign: Story = {
  args: {
    state: createBaseState({
      projectSubTab: '設計',
      showEquipment: true,
      detailTab: {
        project: {
          計画: '計画図',
          設計: '詳細図',
          会議: '内部定例',
          その他: '出張',
          購入品: '購入品A'
        },
        indirect: {
          純間接: '日報入力',
          目的間接: '〇先対応',
          控除時間: '休憩'
        }
      }
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '設計タブが選択された状態。設備選択が表示されます。'
      }
    }
  }
};

// プロジェクト業務 - 会議タブ
export const ProjectMeeting: Story = {
  args: {
    state: createBaseState({
      projectSubTab: '会議',
      detailTab: {
        project: {
          計画: '計画図',
          設計: '計画図',
          会議: 'プロ進行',
          その他: '出張',
          購入品: '購入品A'
        },
        indirect: {
          純間接: '日報入力',
          目的間接: '〇先対応',
          控除時間: '休憩'
        }
      }
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '会議タブが選択された状態。プロ進行の詳細タブが選択されています。'
      }
    }
  }
};

// プロジェクト業務 - 購入品タブ
export const ProjectPurchase: Story = {
  args: {
    state: createBaseState({
      projectSubTab: '購入品',
      showPurchaseItems: true,
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '購入品タブが選択された状態。購入品選択が表示されます。'
      }
    }
  }
};

// 間接業務 - 純間接
export const IndirectPure: Story = {
  args: {
    state: createBaseState({
      activeTab: 'indirect',
      showProjectCode: false,
      showEventForm: false,
      showIndirectContent: true,
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '間接業務の純間接タブが選択された状態。'
      }
    }
  }
};

// 間接業務 - 目的間接
export const IndirectPurpose: Story = {
  args: {
    state: createBaseState({
      activeTab: 'indirect',
      indirectSubTab: '目的間接',
      showProjectCode: true,
      showEventForm: false,
      showIndirectContent: true,
      detailTab: {
        project: {
          計画: '計画図',
          設計: '計画図',
          会議: '内部定例',
          その他: '出張',
          購入品: '購入品A'
        },
        indirect: {
          純間接: '日報入力',
          目的間接: '品質管理',
          控除時間: '休憩'
        }
      }
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '間接業務の目的間接タブが選択された状態。プロジェクトコードが表示されます。'
      }
    }
  }
};

// ローディング状態
export const Loading: Story = {
  args: {
    state: createBaseState({
      loading: true,
      showEventForm: false,
      showEventInfo: false,
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: 'データ読み込み中の状態。'
      }
    }
  }
};

// エラー状態
export const WithError: Story = {
  args: {
    state: createBaseState({
      error: 'データの取得に失敗しました。ネットワーク接続を確認してください。',
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: 'エラーが発生した状態。'
      }
    }
  }
};

// 空の状態（イベント未選択）
export const EmptyState: Story = {
  args: {
    state: createBaseState({
      selectedEvent: null,
      showEventForm: false,
      showEventInfo: false,
      showEmptyState: true,
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: 'イベントが選択されていない空の状態。'
      }
    }
  }
};

// 設備読み込み中
export const EquipmentLoading: Story = {
  args: {
    state: createBaseState({
      projectSubTab: '設計',
      showEquipment: true,
      isLoadingEquipment: true,
      equipmentOptions: [],
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '設備データ読み込み中の状態。'
      }
    }
  }
};

// 購入品読み込み中
export const PurchaseItemsLoading: Story = {
  args: {
    state: createBaseState({
      projectSubTab: '購入品',
      showPurchaseItems: true,
      isLoadingPurchaseItems: true,
      purchaseItems: [],
    }),
    actions: createMockActions(),
  },
  parameters: {
    docs: {
      description: {
        story: '購入品データ読み込み中の状態。'
      }
    }
  }
};