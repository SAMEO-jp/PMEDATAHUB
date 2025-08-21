import { TitleField } from '../ui/TitleField';
import { DescriptionField } from '../ui/DescriptionField';
import { FormState } from '../ui/types';

interface SidebarBasicProps {
  form: FormState;
}

export const SidebarBasic = ({ form }: SidebarBasicProps) => {
  return (
    <div className="space-y-2 p-2">
      <TitleField
        value={form.title}
        onChange={(value) => form.onLocalChange('title', value)}
        onBlur={(value) => form.onCommit('title', value)}
        label="タイトル"
        placeholder="タイトルを入力"
      />
      <DescriptionField
        value={form.description}
        onChange={(value) => form.onLocalChange('description', value)}
        onBlur={(value) => form.onCommit('description', value)}
        label="説明"
        placeholder="説明を入力"
        rows={3}
      />
    </div>
  );
};
