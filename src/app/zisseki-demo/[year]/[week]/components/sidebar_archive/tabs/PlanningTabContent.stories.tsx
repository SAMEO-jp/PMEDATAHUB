import type { Meta, StoryObj } from '@storybook/react';
import { PlanningTabContent } from './PlanningTabContent';
import { MockEventProvider } from '../__mocks__/EventProvider';

// Mock event data
const mockEvent = {
  id: 'event1',
  title: '計画図作成',
  startDate: '2024-01-15',
  startTime: '09:00',
  endTime: '11:00',
  projectCode: 'P001',
  activityCode: 'PP02',
  description: '基本設計の計画図を作成',
  businessType: '計画',
  businessSubType: '計画図',
  subTabType: '計画図',
  planningSubType: '作図及び作図準備',
  user: 'user001'
};

const mockEventKentosho = {
  ...mockEvent,
  id: 'event2',
  title: '検討書作成',
  activityCode: 'PC01',
  businessSubType: '検討書',
  subTabType: '検討書',
  description: '検討書の作成とサイン'
};

const mockEventMitsumore = {
  ...mockEvent,
  id: 'event3',
  title: '見積り作成',
  activityCode: 'PT01',
  businessSubType: '見積り',
  subTabType: '見積り',
  estimateSubType: '設計費見積書',
  description: '設計費見積書の作成'
};

const mockActions = {
  updateEvent: (event: any) => console.log('updateEvent called:', event),
};

const meta: Meta<typeof PlanningTabContent> = {
  title: 'ZissekiDemo/Sidebar/Tabs/PlanningTabContent',
  component: PlanningTabContent,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'プロジェクトの計画業務タブのコンテンツ。計画図、検討書、見積りの各サブタブに応じて異なる業務選択肢を表示します。'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { args }) => (
      <MockEventProvider mockState={{
        planningSubType: args.selectedEvent?.planningSubType || '',
        estimateSubType: args.selectedEvent?.estimateSubType || '',
      }}>
        <div className="w-80 bg-white rounded-lg shadow">
          <Story />
        </div>
      </MockEventProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 計画図タブのコンテンツ
export const PlanningDiagramTab: Story = {
  args: {
    selectedEvent: mockEvent,
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '計画図が選択された状態。計画図に関連する業務選択肢が表示されます。'
      }
    }
  }
};

// 計画図タブ - 選択済み状態
export const PlanningDiagramTabSelected: Story = {
  args: {
    selectedEvent: {
      ...mockEvent,
      planningSubType: '作図指示',
      activityCode: 'PP04'
    },
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '計画図タブで「作図指示」が選択された状態。'
      }
    }
  }
};

// 検討書タブのコンテンツ
export const ReviewDocumentTab: Story = {
  args: {
    selectedEvent: mockEventKentosho,
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '検討書が選択された状態。検討書作成およびサインの固定コンテンツが表示されます。'
      }
    }
  }
};

// 見積りタブのコンテンツ
export const EstimateTab: Story = {
  args: {
    selectedEvent: mockEventMitsumore,
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '見積りが選択された状態。見積りに関連する業務選択肢が表示されます。'
      }
    }
  }
};

// 見積りタブ - 選択済み状態
export const EstimateTabSelected: Story = {
  args: {
    selectedEvent: {
      ...mockEventMitsumore,
      estimateSubType: '製作品BQ',
      activityCode: 'PT04'
    },
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '見積りタブで「製作品BQ」が選択された状態。'
      }
    }
  }
};

// 複数選択状態
export const MultipleSelections: Story = {
  args: {
    selectedEvent: {
      ...mockEvent,
      planningSubType: '検図',
      activityCode: 'PP07'
    },
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '計画図タブで「検図」が選択された状態。'
      }
    }
  }
};

// イベント未選択状態
export const NoEventSelected: Story = {
  args: {
    selectedEvent: null,
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: 'イベントが選択されていない状態。何も表示されません。'
      }
    }
  }
};

// 異なるサブタイプの計画図
export const PlanningDiagramOtherSubtype: Story = {
  args: {
    selectedEvent: {
      ...mockEvent,
      planningSubType: 'その他',
      activityCode: 'PP09'
    },
    updateEvent: mockActions.updateEvent,
  },
  parameters: {
    docs: {
      description: {
        story: '計画図タブで「その他」が選択された状態。'
      }
    }
  }
};