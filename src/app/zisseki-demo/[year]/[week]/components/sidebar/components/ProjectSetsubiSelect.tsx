import { OnLocalChange, OnCommit } from '../ui/types';

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
          <option key={`${combination.projectId}-${combination.setsubiId}`} value={`${combination.projectId}|${combination.setsubiCode}`}>
            {combination.displayText}
          </option>
        ))}
      </select>
    </div>
  );
};
