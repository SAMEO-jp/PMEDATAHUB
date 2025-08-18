interface TitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const TitleField = ({ 
  value, 
  onChange, 
  onBlur,
  label = "タイトル", 
  placeholder = "タイトルを入力" 
}: TitleFieldProps) => {
  return (
    <div>
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label> */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className="w-full p-2 border rounded text-sm"
        placeholder={placeholder}
      />
    </div>
  );
};