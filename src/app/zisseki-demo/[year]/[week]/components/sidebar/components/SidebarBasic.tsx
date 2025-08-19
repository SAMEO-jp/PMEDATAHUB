import { TitleField } from '../ui/TitleField';
import { DescriptionField } from '../ui/DescriptionField';

interface SidebarBasicProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTitleBlur?: (value: string) => void;
  onDescriptionBlur?: (value: string) => void;
}

export const SidebarBasic = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onTitleBlur,
  onDescriptionBlur
}: SidebarBasicProps) => {
  return (
    <div className="space-y-2 p-2">
      <TitleField
        value={title}
        onChange={onTitleChange}
        onBlur={onTitleBlur}
        label="タイトル"
        placeholder="タイトルを入力"
      />
      <DescriptionField
        value={description}
        onChange={onDescriptionChange}
        onBlur={onDescriptionBlur}
        label="説明"
        placeholder="説明を入力"
        rows={3}
      />
    </div>
  );
};
