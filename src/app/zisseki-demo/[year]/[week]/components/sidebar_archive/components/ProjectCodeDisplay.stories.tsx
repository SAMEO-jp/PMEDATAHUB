import type { Meta, StoryObj } from '@storybook/react';
import { ProjectCodeDisplay } from './ProjectCodeDisplay';
import { MockEventProvider } from '../__mocks__/EventProvider';

// Mock data
const mockProjects = [
  { 
    projectCode: 'P001', 
    projectName: 'システム開発プロジェクト', 
    name: 'システム開発プロジェクト',
    isProject: '1'
  },
  { 
    projectCode: 'P002', 
    projectName: 'インフラ構築プロジェクト', 
    name: 'インフラ構築プロジェクト',
    isProject: '1'
  },
  { 
    projectCode: 'P003', 
    projectName: 'デザイン改善プロジェクト', 
    name: 'デザイン改善プロジェクト',
    isProject: '1'
  },
];

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

const mockActions = {
  updateEvent: (event: any) => console.log('updateEvent called:', event),
  setSelectedProjectCode: (code: string) => console.log('setSelectedProjectCode called:', code),
  setPurposeProjectCode: (code: string) => console.log('setPurposeProjectCode called:', code),
};

const meta: Meta<typeof ProjectCodeDisplay> = {
  title: 'ZissekiDemo/Sidebar/Components/ProjectCodeDisplay',
  component: ProjectCodeDisplay,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'プロジェクトコードの表示・選択を行うコンポーネント。選択されたタブとサブタブに応じて表示内容が変わります。'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <MockEventProvider mockState={{
        selectedProjectCode: args.selectedProjectCode,
        purposeProjectCode: args.purposeProjectCode,
        selectedEvent: args.selectedEvent,
      }}>
        <div className="w-80 bg-white rounded-lg shadow">
          <Story />
        </div>
      </MockEventProvider>
    ),
  ],
  argTypes: {
    selectedTab: {
      control: { type: 'select' },
      options: ['project', 'indirect'],
      description: '現在選択されているメインタブ'
    },
    indirectSubTab: {
      control: { type: 'select' },
      options: ['純間接', '目的間接', '控除時間'],
      description: '間接業務のサブタブ（selectedTab="indirect"の場合のみ有効）'
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// プロジェクトタブでの表示
export const ProjectTab: Story = {
  args: {
    selectedTab: 'project',
    indirectSubTab: '純間接',
    selectedProjectCode: 'P001',
    purposeProjectCode: '',
    projects: mockProjects,
    selectedEvent: mockEvent,
    updateEvent: mockActions.updateEvent,
    setSelectedProjectCode: mockActions.setSelectedProjectCode,
    setPurposeProjectCode: mockActions.setPurposeProjectCode,
  },
  parameters: {
    docs: {
      description: {
        story: 'プロジェクトタブが選択された状態。プロジェクトコード選択ドロップダウンが表示されます。'
      }
    }
  }
};

// 間接業務 - 目的間接タブでの表示
export const IndirectPurposeTab: Story = {
  args: {
    selectedTab: 'indirect',
    indirectSubTab: '目的間接',
    selectedProjectCode: '',
    purposeProjectCode: 'P002',
    projects: mockProjects,
    selectedEvent: mockEvent,
    updateEvent: mockActions.updateEvent,
    setSelectedProjectCode: mockActions.setSelectedProjectCode,
    setPurposeProjectCode: mockActions.setPurposeProjectCode,
  },
  parameters: {
    docs: {
      description: {
        story: '間接業務の目的間接タブが選択された状態。目的プロジェクトコード選択が表示されます。'
      }
    }
  }
};

// 間接業務 - 純間接タブでの表示
export const IndirectPureTab: Story = {
  args: {
    selectedTab: 'indirect',
    indirectSubTab: '純間接',
    selectedProjectCode: '',
    purposeProjectCode: '',
    projects: mockProjects,
    selectedEvent: mockEvent,
    updateEvent: mockActions.updateEvent,
    setSelectedProjectCode: mockActions.setSelectedProjectCode,
    setPurposeProjectCode: mockActions.setPurposeProjectCode,
  },
  parameters: {
    docs: {
      description: {
        story: '間接業務の純間接タブが選択された状態。固定の純間接コードが表示されます。'
      }
    }
  }
};

// 間接業務 - 控除時間タブでの表示
export const IndirectDeductionTab: Story = {
  args: {
    selectedTab: 'indirect',
    indirectSubTab: '控除時間',
    selectedProjectCode: '',
    purposeProjectCode: '',
    projects: mockProjects,
    selectedEvent: mockEvent,
    updateEvent: mockActions.updateEvent,
    setSelectedProjectCode: mockActions.setSelectedProjectCode,
    setPurposeProjectCode: mockActions.setPurposeProjectCode,
  },
  parameters: {
    docs: {
      description: {
        story: '間接業務の控除時間タブが選択された状態。固定の控除時間コードが表示されます。'
      }
    }
  }
};

// プロジェクトが空の状態
export const EmptyProjects: Story = {
  args: {
    selectedTab: 'project',
    indirectSubTab: '純間接',
    selectedProjectCode: '',
    purposeProjectCode: '',
    projects: [],
    selectedEvent: null,
    updateEvent: mockActions.updateEvent,
    setSelectedProjectCode: mockActions.setSelectedProjectCode,
    setPurposeProjectCode: mockActions.setPurposeProjectCode,
  },
  parameters: {
    docs: {
      description: {
        story: 'プロジェクト一覧が空の状態。'
      }
    }
  }
};

// 多数のプロジェクトがある状態
export const ManyProjects: Story = {
  args: {
    selectedTab: 'project',
    indirectSubTab: '純間接',
    selectedProjectCode: 'P005',
    purposeProjectCode: '',
    projects: [
      ...mockProjects,
      { projectCode: 'P004', projectName: 'モバイルアプリ開発', name: 'モバイルアプリ開発', isProject: '1' },
      { projectCode: 'P005', projectName: 'データ分析基盤構築', name: 'データ分析基盤構築', isProject: '1' },
      { projectCode: 'P006', projectName: 'セキュリティ強化プロジェクト', name: 'セキュリティ強化プロジェクト', isProject: '1' },
      { projectCode: 'P007', projectName: 'UI/UX改善プロジェクト', name: 'UI/UX改善プロジェクト', isProject: '1' },
      { projectCode: 'P008', projectName: 'パフォーマンス最適化', name: 'パフォーマンス最適化', isProject: '1' },
    ],
    selectedEvent: mockEvent,
    updateEvent: mockActions.updateEvent,
    setSelectedProjectCode: mockActions.setSelectedProjectCode,
    setPurposeProjectCode: mockActions.setPurposeProjectCode,
  },
  parameters: {
    docs: {
      description: {
        story: '多数のプロジェクトがある状態でのプロジェクトコード選択。'
      }
    }
  }
};