interface SidebarEmptyProps {
  message: string;
}

export const SidebarEmpty = ({ message }: SidebarEmptyProps) => {
  return (
    <div className="text-center text-gray-500 p-8">
      <p className="text-xs">{message}</p>
    </div>
  );
};
