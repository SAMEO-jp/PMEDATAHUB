interface DeleteButtonProps {
  onDelete: () => void;
  label?: string;
}

export const DeleteButton = ({ onDelete, label = "削除" }: DeleteButtonProps) => {
  return (
    <button
      onClick={onDelete}
      className="w-full px-3 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      {label}
    </button>
  );
};