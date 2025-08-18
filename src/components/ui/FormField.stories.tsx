import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from './FormField';
import { Input } from './input';

const meta: Meta<typeof FormField> = {
  title: 'UI/Forms/FormField',
  component: FormField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'フォームフィールドのラッパーコンポーネント。ラベル、エラーメッセージ、ヒントテキストを統一的に管理します。'
      }
    }
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'ユーザー名',
    children: <Input placeholder="ユーザー名を入力" />
  },
};

export const Required: Story = {
  args: {
    label: 'メールアドレス',
    required: true,
    children: <Input type="email" placeholder="example@company.com" />
  },
};

export const WithError: Story = {
  args: {
    label: 'パスワード',
    required: true,
    error: 'パスワードは8文字以上である必要があります',
    children: <Input type="password" />
  },
};

export const WithHint: Story = {
  args: {
    label: '電話番号',
    hint: 'ハイフンなしで入力してください（例: 09012345678）',
    children: <Input placeholder="09012345678" />
  },
};

export const Complex: Story = {
  render: () => (
    <div className="space-y-4">
      <FormField label="会社名" required>
        <Input placeholder="株式会社サンプル" />
      </FormField>
      
      <FormField 
        label="部署名" 
        hint="所属部署を入力してください"
      >
        <Input placeholder="開発部" />
      </FormField>
      
      <FormField 
        label="確認用パスワード" 
        required
        error="パスワードが一致しません"
      >
        <Input type="password" />
      </FormField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '複数のFormFieldを組み合わせたフォーム例'
      }
    }
  }
};