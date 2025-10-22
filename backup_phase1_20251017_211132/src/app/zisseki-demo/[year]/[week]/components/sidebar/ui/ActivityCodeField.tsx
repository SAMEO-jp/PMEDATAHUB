interface ActivityCodeFieldProps {
  value: string;
  label?: string;
  show?: boolean;
}

export const ActivityCodeField = ({ 
  value, 
  label = "業務コード",
  show = true
}: ActivityCodeFieldProps) => {
  if (!show) return null;

  return (
    <div>
      <label className="field-label">
        {label}
      </label>
      <div className="activity-code-field">
        {value || "未設定"}
      </div>
    </div>
  );
};