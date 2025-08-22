import { Project, OnLocalChange, OnCommit } from '../ui/types';

interface ProjectSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  projects?: Project[];
  label?: string;
  placeholder?: string;
}

export const ProjectSelect = ({ 
  value, 
  onLocalChange, 
  onCommit,
  projects = [],
  label = "プロジェクト", 
  placeholder = "選択してください" 
}: ProjectSelectProps) => {
  return (
    <div>
      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label> */}
      <select
        value={value}
        onChange={(e) => onLocalChange(e.target.value)}
        onBlur={(e) => onCommit?.(e.target.value)}
        className="w-full p-2 border rounded text-sm"
      >
        <option value="">{placeholder}</option>
        {projects.map((project, index) => (
          <option key={index} value={project.code}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};
