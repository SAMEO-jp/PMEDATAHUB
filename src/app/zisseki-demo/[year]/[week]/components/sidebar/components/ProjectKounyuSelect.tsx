import { OnLocalChange, OnCommit } from '../ui/types';

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
  return (
    <div className="flex-1">
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onLocalChange(e.target.value)}
        onBlur={(e) => onCommit?.(e.target.value)}
        disabled={disabled}
        className="w-full p-1.5 border border-gray-300 rounded text-xs disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {combinations.map((combination) => (
          <option key={`${combination.projectId}-${combination.kounyuId}`} value={`${combination.projectId}|${combination.kounyuCode}`}>
            {combination.displayText}
          </option>
        ))}
      </select>
    </div>
  );
};
