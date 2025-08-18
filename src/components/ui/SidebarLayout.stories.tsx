import type { Meta, StoryObj } from '@storybook/react';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarSection, 
  SidebarActions 
} from './SidebarLayout';
import { Tab } from './Tab';
import { TabGroup } from './TabGroup';
import { Input } from './input';
import { Button } from './button';
import { FormField } from './FormField';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'サイドバーレイアウト用コンポーネントセット。ヘッダー、コンテンツ、セクション、アクションを組み合わせて使用します。'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-100 p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Sidebar>
      <SidebarHeader title="基本サイドバー" />
      <SidebarContent>
        <p className="text-gray-600">基本的なサイドバーの例です。</p>
      </SidebarContent>
    </Sidebar>
  ),
};

export const WithTabs: Story = {
  render: () => (
    <Sidebar>
      <SidebarHeader 
        title="業務詳細"
        actions={
          <TabGroup value="project" onValueChange={console.log}>
            <Tab value="project">プロジェクト</Tab>
            <Tab value="indirect">間接業務</Tab>
          </TabGroup>
        }
      />
      <SidebarContent>
        <SidebarSection title="プロジェクト情報">
          <FormField label="プロジェクトコード">
            <Input placeholder="プロジェクトを選択してください" />
          </FormField>
        </SidebarSection>
        
        <SidebarSection title="基本情報">
          <FormField label="タイトル" required>
            <Input placeholder="イベントタイトル" />
          </FormField>
        </SidebarSection>
      </SidebarContent>
      
      <SidebarActions>
        <Button variant="destructive">削除</Button>
        <Button variant="secondary">キャンセル</Button>
        <Button>保存</Button>
      </SidebarActions>
    </Sidebar>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <Sidebar>
      <SidebarHeader title="折り畳み可能セクション" />
      <SidebarContent>
        <SidebarSection title="基本設定" collapsible>
          <FormField label="名前">
            <Input placeholder="名前を入力" />
          </FormField>
          <FormField label="説明">
            <Input placeholder="説明を入力" />
          </FormField>
        </SidebarSection>
        
        <SidebarSection title="詳細設定" collapsible defaultCollapsed>
          <FormField label="詳細オプション1">
            <Input placeholder="オプション1" />
          </FormField>
          <FormField label="詳細オプション2">
            <Input placeholder="オプション2" />
          </FormField>
        </SidebarSection>
      </SidebarContent>
    </Sidebar>
  ),
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Sidebar width="sm">
        <SidebarHeader title="Small" />
        <SidebarContent>
          <p className="text-sm text-gray-600">幅: 256px</p>
        </SidebarContent>
      </Sidebar>
      
      <Sidebar width="md">
        <SidebarHeader title="Medium" />
        <SidebarContent>
          <p className="text-sm text-gray-600">幅: 320px</p>
        </SidebarContent>
      </Sidebar>
      
      <Sidebar width="lg">
        <SidebarHeader title="Large" />
        <SidebarContent>
          <p className="text-sm text-gray-600">幅: 384px</p>
        </SidebarContent>
      </Sidebar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '異なるサイズのサイドバー比較'
      }
    }
  }
};

export const ActionVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Sidebar width="sm">
        <SidebarHeader title="左寄せ" />
        <SidebarContent>
          <p className="text-sm">アクション左寄せの例</p>
        </SidebarContent>
        <SidebarActions align="left">
          <Button size="sm">保存</Button>
        </SidebarActions>
      </Sidebar>
      
      <Sidebar width="sm">
        <SidebarHeader title="中央寄せ" />
        <SidebarContent>
          <p className="text-sm">アクション中央寄せの例</p>
        </SidebarContent>
        <SidebarActions align="center">
          <Button size="sm">実行</Button>
        </SidebarActions>
      </Sidebar>
      
      <Sidebar width="sm">
        <SidebarHeader title="右寄せ" />
        <SidebarContent>
          <p className="text-sm">アクション右寄せの例</p>
        </SidebarContent>
        <SidebarActions align="right">
          <Button size="sm">完了</Button>
        </SidebarActions>
      </Sidebar>
      
      <Sidebar width="sm">
        <SidebarHeader title="両端寄せ" />
        <SidebarContent>
          <p className="text-sm">アクション両端寄せの例</p>
        </SidebarContent>
        <SidebarActions align="between">
          <Button size="sm" variant="secondary">キャンセル</Button>
          <Button size="sm">OK</Button>
        </SidebarActions>
      </Sidebar>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SidebarActionsの様々な配置パターン'
      }
    }
  }
};