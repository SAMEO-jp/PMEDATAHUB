import { OnLocalChange, OnCommit } from '../ui/types';
import { CustomDropdown } from './CustomDropdown';

interface ProjectKounyuOption {
  projectId: string;
  projectName: string;
  kounyuId: number;
  kounyuCode: string;
  kounyuName: string;
  assignmentId: number;
  displayText: string;
}

interface ProjectKounyuSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  combinations: ProjectKounyuOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const ProjectKounyuSelect = ({
  value,
  onLocalChange,
  onCommit,
  combinations = [],
  label = "プロジェクト-購入品",
  placeholder = "プロジェクト-購入品を選択してください",
  disabled = false
}: ProjectKounyuSelectProps) => {
  // カスタムドロップダウン用のオプションに変換
  const dropdownOptions = combinations.map((combination) => ({
    value: `${combination.projectId}|${combination.kounyuCode}`,
    label: combination.projectName,
    subLabel: `購入品: ${combination.kounyuName}`,
    description: `プロジェクトID: ${combination.projectId} | 購入品コード: ${combination.kounyuCode}`
  }));

  return (
    <select
      value={value}
      onChange={(e) => onLocalChange(e.target.value)}
      onBlur={(e) => onCommit?.(e.target.value)}
      disabled={disabled}
      className="w-full p-1 border border-gray-300 rounded text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {combinations.map((combination) => (
        <option key={`${combination.projectId}-${combination.kounyuId}`} value={`${combination.projectId}|${combination.kounyuCode}`}>
          {combination.projectName} - {combination.kounyuName}
        </option>
      ))}
    </select>
  );
};
