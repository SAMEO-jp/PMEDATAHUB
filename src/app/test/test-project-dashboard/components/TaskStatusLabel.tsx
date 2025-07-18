import { TaskStatusLabelProps } from '../types';

const TaskStatusLabel = ({ status, deadline }: TaskStatusLabelProps) => {
  const baseClasses = "text-xs font-bold px-2 py-1 rounded-full";
  let statusClass = "";
  const deadlineClass = "ml-auto text-sm text-gray-600";
  
  if (status === "依頼済") {
    statusClass = "bg-blue-100 text-blue-800";
  } else if (status === "納期") {
    statusClass = "bg-red-100 text-red-800";
  }
  
  return (
    <div className="flex items-center">
      <span className={`${baseClasses} ${statusClass}`}>{status}</span>
      <span className={deadlineClass}>納期: {deadline}</span>
    </div>
  );
};

export default TaskStatusLabel; 