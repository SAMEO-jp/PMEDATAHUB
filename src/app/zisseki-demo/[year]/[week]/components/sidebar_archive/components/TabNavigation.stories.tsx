import type { Meta, StoryObj } from '@storybook/react';
import { TabNavigation, HierarchicalTabNavigation } from './TabNavigation';

// Mock icons (you can replace with actual icons)
const ProjectIcon = () => <span>📋</span>;
const IndirectIcon = () => <span>⚡</span>;
const PlanIcon = () => <span>📝</span>;
const DesignIcon = () => <span>🎨</span>;
const MeetingIcon = () => <span>🤝</span>;
const PurchaseIcon = () => <span>🛒</span>;
const OtherIcon = () => <span>📄</span>;

// Mock data for tabs
const mockTabs = [
  { id: 'planning', label: '計画', icon: <PlanIcon /> },
  { id: 'design', label: '設計', icon: <DesignIcon /> },
  { id: 'meeting', label: '会議', icon: <MeetingIcon /> },
  { id: 'purchase', label: '購入品', icon: <PurchaseIcon /> },
  { id: 'other', label: 'その他', icon: <OtherIcon /> },
];

const mockTabsWithBadge = [
  { id: 'planning', label: '計画', icon: <PlanIcon />, badge: '3' },
  { id: 'design', label: '設計', icon: <DesignIcon />, badge: '12' },
  { id: 'meeting', label: '会議', icon: <MeetingIcon />, badge: 'New' },
  { id: 'purchase', label: '購入品', icon: <PurchaseIcon /> },
  { id: 'other', label: 'その他', icon: <OtherIcon />, disabled: true },
];

const mockHierarchicalConfig = {
  level1: {
    id: 'project',
    label: 'プロジェクト',
    icon: <ProjectIcon />
  },
  level2: {
    id: 'planning',
    label: '計画',
    icon: <PlanIcon />,
    tabs: [
      { id: 'planning', label: '計画' },
      { id: 'design', label: '設計' },
      { id: 'meeting', label: '会議' },
      { id: 'purchase', label: '購入品' },
      { id: 'other', label: 'その他' },
    ]
  },
  level3: {
    id: 'planning-detail',
    label: '計画詳細',
    tabs: [
      { id: 'planning-diagram', label: '計画図' },
      { id: 'review', label: '検討書' },
      { id: 'estimate', label: '見積り' },
    ]
  }
};

const meta: Meta<typeof TabNavigation> = {
  title: 'ZissekiDemo/Sidebar/Components/TabNavigation',
  component: TabNavigation,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'WeekShiwake機能で使用されるタブナビゲーションコンポーネント。単一レベルと階層タブの両方に対応。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'pills', 'underline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Tab Navigation Stories
export const Default: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'planning',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
  },
  parameters: {
    docs: {
      description: {
        story: '基本的なタブナビゲーション（デフォルトスタイル）'
      }
    }
  }
};

export const Pills: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'design',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    variant: 'pills',
  },
  parameters: {
    docs: {
      description: {
        story: 'ピルスタイルのタブナビゲーション'
      }
    }
  }
};

export const Underline: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'meeting',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    variant: 'underline',
  },
  parameters: {
    docs: {
      description: {
        story: 'アンダーラインスタイルのタブナビゲーション'
      }
    }
  }
};

export const WithBadges: Story = {
  args: {
    tabs: mockTabsWithBadge,
    activeTabId: 'planning',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    variant: 'pills',
  },
  parameters: {
    docs: {
      description: {
        story: 'バッジと無効化状態を含むタブナビゲーション'
      }
    }
  }
};

export const Small: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'planning',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: '小サイズのタブナビゲーション'
      }
    }
  }
};

export const Large: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'planning',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    size: 'lg',
    variant: 'pills',
  },
  parameters: {
    docs: {
      description: {
        story: '大サイズのタブナビゲーション'
      }
    }
  }
};

export const Vertical: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'planning',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    orientation: 'vertical',
    variant: 'pills',
  },
  parameters: {
    docs: {
      description: {
        story: '縦方向のタブナビゲーション'
      }
    }
  }
};

export const Disabled: Story = {
  args: {
    tabs: mockTabs,
    activeTabId: 'planning',
    onTabChange: (tabId) => console.log('Tab changed to:', tabId),
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '全体が無効化されたタブナビゲーション'
      }
    }
  }
};

// Hierarchical Tab Navigation Stories
const HierarchicalMeta: Meta<typeof HierarchicalTabNavigation> = {
  title: 'ZissekiDemo/Sidebar/Components/HierarchicalTabNavigation',
  component: HierarchicalTabNavigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const HierarchicalDefault: StoryObj<typeof HierarchicalTabNavigation> = {
  args: {
    config: mockHierarchicalConfig,
    activeLevel1Id: 'project',
    activeLevel2Id: 'planning',
    activeLevel3Id: 'planning-diagram',
    onLevel1Change: (id) => console.log('Level 1 changed to:', id),
    onLevel2Change: (id) => console.log('Level 2 changed to:', id),
    onLevel3Change: (id) => console.log('Level 3 changed to:', id),
  },
  parameters: {
    docs: {
      description: {
        story: '階層タブナビゲーション（2レベル）'
      }
    }
  }
};

export const HierarchicalWithLevel3: StoryObj<typeof HierarchicalTabNavigation> = {
  args: {
    config: mockHierarchicalConfig,
    activeLevel1Id: 'project',
    activeLevel2Id: 'planning',
    activeLevel3Id: 'planning-diagram',
    onLevel1Change: (id) => console.log('Level 1 changed to:', id),
    onLevel2Change: (id) => console.log('Level 2 changed to:', id),
    onLevel3Change: (id) => console.log('Level 3 changed to:', id),
    showLevel3: true,
  },
  parameters: {
    docs: {
      description: {
        story: '階層タブナビゲーション（3レベル）'
      }
    }
  }
};

export const HierarchicalUnderline: StoryObj<typeof HierarchicalTabNavigation> = {
  args: {
    config: mockHierarchicalConfig,
    activeLevel1Id: 'project',
    activeLevel2Id: 'design',
    activeLevel3Id: 'planning-diagram',
    onLevel1Change: (id) => console.log('Level 1 changed to:', id),
    onLevel2Change: (id) => console.log('Level 2 changed to:', id),
    onLevel3Change: (id) => console.log('Level 3 changed to:', id),
    showLevel3: true,
    variant: 'underline',
    size: 'sm',
  },
  parameters: {
    docs: {
      description: {
        story: 'アンダーライン小サイズの階層タブナビゲーション'
      }
    }
  }
};