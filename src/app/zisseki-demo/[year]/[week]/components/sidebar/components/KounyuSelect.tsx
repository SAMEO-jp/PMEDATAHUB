import { OnLocalChange, OnCommit } from '../ui/types';
import { CustomDropdown } from './CustomDropdown';

interface KounyuOption {
  id: number;
  code: string;
  name: string;
  assignmentId: number;
}

interface KounyuSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  kounyuList: KounyuOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const KounyuSelect = ({
  value,
  onLocalChange,
  onCommit,
  kounyuList = [],
  label = "担当購入品",
  placeholder = "購入品を選択してください",
  disabled = false
}: KounyuSelectProps) => {
  // カスタムドロップダウン用のオプションに変換
  const dropdownOptions = kounyuList.map((kounyu) => ({
    value: kounyu.code,
    label: kounyu.name,
    subLabel: `管理番号: ${kounyu.code}`,
    description: `ID: ${kounyu.id}`
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
      {kounyuList.map((kounyu) => (
        <option key={kounyu.id} value={kounyu.code}>
          {kounyu.name} (管理番号: {kounyu.code})
        </option>
      ))}
    </select>
  );
};
