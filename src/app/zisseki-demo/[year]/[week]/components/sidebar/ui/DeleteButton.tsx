interface DeleteButtonProps {
  onDelete: () => void;
  label?: string;
}

export const DeleteButton = ({ onDelete, label = "削除" }: DeleteButtonProps) => {
  return (
    <button
      onClick={onDelete}
      className="delete-button"
    >
      {label}
    </button>
  );
};