import { OnLocalChange, OnCommit } from '../ui/types';
import { CustomDropdown } from './CustomDropdown';

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
  label = "担当装置",
  placeholder = "装置を選択してください",
  disabled = false
}: SetsubiSelectProps) => {
  // カスタムドロップダウン用のオプションに変換
  const dropdownOptions = setsubiList.map((setsubi) => ({
    value: setsubi.code,
    label: setsubi.name,
    subLabel: `製番: ${setsubi.code}`,
    description: `ID: ${setsubi.id}`
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
      {setsubiList.map((setsubi) => (
        <option key={setsubi.id} value={setsubi.code}>
          {setsubi.name} (製番: {setsubi.code})
        </option>
      ))}
    </select>
  );
};
