import type { Meta, StoryObj } from '@storybook/react';
import { BusinessTypeTab, BusinessTypeTabGroup } from './BusinessTypeTab';
import { useState } from 'react';

const meta: Meta<typeof BusinessTypeTab> = {
  title: 'ZissekiDemo/Sidebar/Components/BusinessTypeTab',
  component: BusinessTypeTab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '業務タイプ選択専用のタブコンポーネント。選択/選択解除の切り替えが可能で、業務コードも表示できます。'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isSelected: {
      control: 'boolean',
      description: 'タブが選択されているかどうか'
    },
    businessCode: {
      control: 'text',
      description: '業務コード（括弧内に表示）'
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// 基本的な業務タイプタブ
export const Default: Story = {
  args: {
    businessName: '作図及び作図準備',
    businessCode: '02',
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    businessName: '作図及び作図準備',
    businessCode: '02',
    isSelected: true,
  },
};

export const WithoutCode: Story = {
  args: {
    businessName: '検討書作成およびサイン',
    isSelected: true,
    description: '検討書の作成と必要なサイン作業を行います。',
  },
};

export const LongText: Story = {
  args: {
    businessName: '出図前図面検討会での詳細レビュー',
    businessCode: '03',
    isSelected: false,
  },
};

// BusinessTypeTabGroup使用例
const PlanningTabExample = () => {
  const [selectedPlanning, setSelectedPlanning] = useState<string>('');

  const planningOptions = [
    { name: "作図及び作図準備", code: "02", description: "CADでの作図作業と事前準備" },
    { name: "作図指示", code: "04", description: "作図に関する指示出し" },
    { name: "検図", code: "07", description: "完成した図面の確認作業" },
    { name: "承認作業", code: "08", description: "図面の最終承認" },
    { name: "出図前図面検討会", code: "03", description: "出図前の図面レビュー会議" },
    { name: "出図後図面検討会", code: "06", description: "出図後のフィードバック会議" },
    { name: "その他", code: "09", description: "上記に該当しない計画業務" },
  ];

  return (
    <div className="w-80 bg-white rounded-lg shadow">
      <BusinessTypeTabGroup
        title="計画図業務"
        options={planningOptions}
        selectedValue={selectedPlanning}
        onSelectionChange={(selected) => {
          setSelectedPlanning(selected?.name || '');
          console.log('選択変更:', selected);
        }}
      />
      <div className="p-4">
        <p className="text-sm text-gray-600">
          選択中: {selectedPlanning || '未選択'}
        </p>
      </div>
    </div>
  );
};

export const PlanningTabGroup: Story = {
  render: () => <PlanningTabExample />,
  parameters: {
    docs: {
      description: {
        story: '計画図業務の選択例。複数のオプションから一つを選択/選択解除できます。'
      }
    }
  }
};

const EstimateTabExample = () => {
  const [selectedEstimate, setSelectedEstimate] = useState<string>('設計費見積書');

  const estimateOptions = [
    { name: "設計費見積書", code: "01" },
    { name: "見積仕様書", code: "02" },
    { name: "テクスぺ", code: "03" },
    { name: "製作品BQ", code: "04" },
    { name: "工事BQ", code: "05" },
    { name: "購入品見積", code: "06" },
    { name: "区分見積", code: "07" },
    { name: "予備品見積", code: "08" },
    { name: "その他", code: "09" },
  ];

  return (
    <div className="w-80 bg-white rounded-lg shadow">
      <BusinessTypeTabGroup
        title="見積り業務"
        options={estimateOptions}
        selectedValue={selectedEstimate}
        onSelectionChange={(selected) => {
          setSelectedEstimate(selected?.name || '');
          console.log('選択変更:', selected);
        }}
      />
      <div className="p-4">
        <p className="text-sm text-gray-600">
          選択中: {selectedEstimate || '未選択'}
        </p>
      </div>
    </div>
  );
};

export const EstimateTabGroup: Story = {
  render: () => <EstimateTabExample />,
  parameters: {
    docs: {
      description: {
        story: '見積り業務の選択例。初期選択状態から選択解除も可能です。'
      }
    }
  }
};

const MultipleGroupsExample = () => {
  const [selectedPlanning, setSelectedPlanning] = useState<string>('検図');
  const [selectedMeeting, setSelectedMeeting] = useState<string>('');

  return (
    <div className="space-y-4">
      <div className="w-80 bg-white rounded-lg shadow">
        <BusinessTypeTabGroup
          title="計画図業務"
          options={[
            { name: "作図及び作図準備", code: "02" },
            { name: "検図", code: "07" },
            { name: "承認作業", code: "08" },
          ]}
          selectedValue={selectedPlanning}
          onSelectionChange={(selected) => setSelectedPlanning(selected?.name || '')}
        />
      </div>
      
      <div className="w-80 bg-white rounded-lg shadow">
        <BusinessTypeTabGroup
          title="会議種別"
          options={[
            { name: "内部定例", code: "01" },
            { name: "外部定例", code: "02" },
            { name: "プロ進行", code: "03" },
          ]}
          selectedValue={selectedMeeting}
          onSelectionChange={(selected) => setSelectedMeeting(selected?.name || '')}
        />
      </div>
      
      <div className="p-4 bg-gray-100 rounded">
        <p className="text-sm">計画: {selectedPlanning || '未選択'}</p>
        <p className="text-sm">会議: {selectedMeeting || '未選択'}</p>
      </div>
    </div>
  );
};

export const MultipleGroups: Story = {
  render: () => <MultipleGroupsExample />,
  parameters: {
    docs: {
      description: {
        story: '複数のBusinessTypeTabGroupを組み合わせた例。それぞれ独立して選択状態を管理できます。'
      }
    }
  }
};