interface ActivityCodeFieldProps {
  value: string;
  label?: string;
}

export const ActivityCodeField = ({ 
  value, 
  label = "業務コード"
}: ActivityCodeFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="w-full p-2 border rounded text-sm bg-gray-50 text-gray-700">
        {value || "未設定"}
      </div>
    </div>
  );
};