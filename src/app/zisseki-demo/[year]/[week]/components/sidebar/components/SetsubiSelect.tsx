import { OnLocalChange, OnCommit } from '../ui/types';

interface SetsubiOption {
  id: number;
  code: string;
  name: string;
  assignmentId: number;
}

interface SetsubiSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  setsubiList: SetsubiOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const SetsubiSelect = ({
  value,
  onLocalChange,
  onCommit,
  setsubiList = [],
  label = "担当装備",
  placeholder = "装備を選択してください",
  disabled = false
}: SetsubiSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onLocalChange(e.target.value)}
        onBlur={(e) => onCommit?.(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border rounded text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {setsubiList.map((setsubi) => (
          <option key={setsubi.id} value={setsubi.code}>
            {setsubi.name} (製番: {setsubi.code})
          </option>
        ))}
      </select>
      {setsubiList.length === 0 && !disabled && (
        <p className="text-xs text-gray-500 mt-1">
          このプロジェクトには担当装備がありません
        </p>
      )}
    </div>
  );
};
