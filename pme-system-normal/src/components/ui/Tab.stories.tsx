import type { Meta, StoryObj } from '@storybook/react';
import { Tab } from './Tab';
import { TabGroup } from './TabGroup';
import { useState } from 'react';

// Mock icons
const ProjectIcon = () => <span>📋</span>;
const PlanIcon = () => <span>📝</span>;
const DesignIcon = () => <span>🎨</span>;
const MeetingIcon = () => <span>🤝</span>;

const meta: Meta<typeof Tab> = {
  title: 'UI/Tab',
  component: Tab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '汎用的なタブコンポーネント。単体使用またはTabGroupと組み合わせて使用します。'
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
    active: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的なタブ
export const Default: Story = {
  args: {
    children: 'プロジェクト',
    active: false,
  },
};

export const Active: Story = {
  args: {
    children: 'プロジェクト',
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'プロジェクト',
    icon: <ProjectIcon />,
    active: true,
  },
};

export const WithBadge: Story = {
  args: {
    children: '計画',
    badge: '3',
    active: false,
  },
};

export const WithIconAndBadge: Story = {
  args: {
    children: '設計',
    icon: <DesignIcon />,
    badge: 'New',
    active: true,
  },
};

// バリアント
export const Pills: Story = {
  args: {
    children: '会議',
    variant: 'pills',
    icon: <MeetingIcon />,
    active: true,
  },
};

export const Underline: Story = {
  args: {
    children: '計画',
    variant: 'underline',
    icon: <PlanIcon />,
    active: true,
  },
};

// サイズ
export const Small: Story = {
  args: {
    children: '小サイズ',
    size: 'sm',
    active: true,
  },
};

export const Large: Story = {
  args: {
    children: '大サイズ',
    size: 'lg',
    variant: 'pills',
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    children: '無効',
    disabled: true,
  },
};

// TabGroup使用例
const TabGroupExample = () => {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">TabGroup 使用例</h3>
      <TabGroup value={activeTab} onValueChange={setActiveTab}>
        <Tab value="planning" icon={<PlanIcon />}>
          計画
        </Tab>
        <Tab value="design" icon={<DesignIcon />} badge="5">
          設計
        </Tab>
        <Tab value="meeting" icon={<MeetingIcon />}>
          会議
        </Tab>
      </TabGroup>
      <p className="text-sm text-gray-600">選択中: {activeTab}</p>
    </div>
  );
};

export const TabGroupHorizontal: Story = {
  render: () => <TabGroupExample />,
  parameters: {
    docs: {
      description: {
        story: 'TabGroupを使用した水平タブの例'
      }
    }
  }
};

const VerticalTabGroupExample = () => {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">縦方向TabGroup</h3>
      <TabGroup 
        value={activeTab} 
        onValueChange={setActiveTab} 
        orientation="vertical"
        variant="pills"
      >
        <Tab value="planning" icon={<PlanIcon />}>
          計画
        </Tab>
        <Tab value="design" icon={<DesignIcon />} badge="5">
          設計
        </Tab>
        <Tab value="meeting" icon={<MeetingIcon />}>
          会議
        </Tab>
      </TabGroup>
      <p className="text-sm text-gray-600">選択中: {activeTab}</p>
    </div>
  );
};

export const TabGroupVertical: Story = {
  render: () => <VerticalTabGroupExample />,
  parameters: {
    docs: {
      description: {
        story: 'TabGroupを使用した垂直タブの例'
      }
    }
  }
};