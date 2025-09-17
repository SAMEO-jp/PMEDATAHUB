import { OnLocalChange, OnCommit } from '../ui/types';

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
        {kounyuList.map((kounyu) => (
          <option key={kounyu.id} value={kounyu.code}>
            {kounyu.name} (管理番号: {kounyu.code})
          </option>
        ))}
      </select>
    </div>
  );
};
