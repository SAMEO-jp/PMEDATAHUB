import { OnLocalChange, OnCommit } from '../ui/types';
import { CustomDropdown } from './CustomDropdown';

interface ProjectSetsubiOption {
  projectId: string;
  projectName: string;
  setsubiId: number;
  setsubiCode: string;
  setsubiName: string;
  assignmentId: number;
  displayText: string;
}

interface ProjectSetsubiSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  combinations: ProjectSetsubiOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const ProjectSetsubiSelect = ({
  value,
  onLocalChange,
  onCommit,
  combinations = [],
  label = "プロジェクト-担当装置",
  placeholder = "プロジェクト-担当装置を選択してください",
  disabled = false
}: ProjectSetsubiSelectProps) => {
  // カスタムドロップダウン用のオプションに変換
  const dropdownOptions = combinations.map((combination) => ({
    value: `${combination.projectId}|${combination.setsubiCode}`,
    label: combination.projectName,
    subLabel: `装置: ${combination.setsubiName}`,
    description: `プロジェクトID: ${combination.projectId} | 製番: ${combination.setsubiCode}`
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
        <option key={`${combination.projectId}-${combination.setsubiId}`} value={`${combination.projectId}|${combination.setsubiCode}`}>
          {combination.projectName} - {combination.setsubiName}
        </option>
      ))}
    </select>
  );
};
