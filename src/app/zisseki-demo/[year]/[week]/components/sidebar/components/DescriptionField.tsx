interface DescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export const DescriptionField = ({ 
  value, 
  onChange, 
  onBlur,
  label = "説明", 
  placeholder = "説明を入力",
  rows = 3 
}: DescriptionFieldProps) => {
  return (
    <div>
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label> */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className="w-full p-2 border rounded text-sm"
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  );
};