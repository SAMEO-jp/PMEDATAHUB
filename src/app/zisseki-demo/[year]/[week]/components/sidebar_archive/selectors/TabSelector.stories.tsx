import type { Meta, StoryObj } from '@storybook/react';
import { TabSelector } from './TabSelector';
import { MockEventProvider } from '../__mocks__/EventProvider';

const meta: Meta<typeof TabSelector> = {
  title: 'ZissekiDemo/Sidebar/Selectors/TabSelector',
  component: TabSelector,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'プロジェクト業務と間接業務を切り替えるためのタブセレクター。選択されたタブに応じて業務分類コードも自動更新されます。'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story, { parameters }) => (
      <MockEventProvider mockState={{ activeTab: parameters?.mockActiveTab || 'project' }}>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-sm font-medium mb-2">業務詳細</h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">タブ選択</span>
              <Story />
            </div>
          </div>
        </div>
      </MockEventProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// プロジェクトタブが選択された状態
export const ProjectSelected: Story = {
  parameters: {
    mockActiveTab: 'project',
    docs: {
      description: {
        story: 'プロジェクトタブが選択された状態。プロジェクト業務の入力が可能になります。'
      }
    }
  }
};

// 間接業務タブが選択された状態
export const IndirectSelected: Story = {
  parameters: {
    mockActiveTab: 'indirect',
    docs: {
      description: {
        story: '間接業務タブが選択された状態。間接業務の入力が可能になります。'
      }
    }
  }
};

// デフォルト状態（プロジェクト選択）
export const Default: Story = {
  parameters: {
    mockActiveTab: 'project',
    docs: {
      description: {
        story: 'デフォルト状態。通常はプロジェクトタブが初期選択されます。'
      }
    }
  }
};

// インタラクション例
export const InteractionExample: Story = {
  parameters: {
    mockActiveTab: 'project',
    docs: {
      description: {
        story: 'タブクリック時の動作例。開発者ツールのコンソールでイベントを確認できます。'
      }
    }
  }
};

// レイアウト例 - サイドバーヘッダー内
export const InSidebarHeader: Story = {
  parameters: {
    mockActiveTab: 'indirect',
  },
  decorators: [
    (Story, { parameters }) => (
      <MockEventProvider mockState={{ activeTab: parameters?.mockActiveTab || 'project' }}>
        <div className="w-80 bg-white rounded-lg shadow">
          {/* サイドバーヘッダーを模擬 */}
          <div className="p-3 flex justify-between items-center border-b">
            <h2 className="text-lg font-bold">業務詳細</h2>
            <Story />
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600">
              {parameters?.mockActiveTab === 'project' ? 'プロジェクト業務の内容がここに表示されます。' : '間接業務の内容がここに表示されます。'}
            </p>
          </div>
        </div>
      </MockEventProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'サイドバーヘッダー内での実際の配置例。'
      }
    }
  }
};