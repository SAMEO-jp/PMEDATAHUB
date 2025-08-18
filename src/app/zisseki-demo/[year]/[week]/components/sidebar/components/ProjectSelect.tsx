interface Project {
  projectCode?: string;
  projectName?: string;
  name?: string;
  [key: string]: any;
}

interface ProjectSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  projects: Project[];
  label?: string;
  placeholder?: string;
}

export const ProjectSelect = ({ 
  value, 
  onChange, 
  onBlur,
  projects,
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
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className="w-full p-2 border rounded text-sm"
      >
        <option value="">{placeholder}</option>
        {projects.map((project, index) => (
          <option key={index} value={project.projectCode || project.name || ""}>
            {project.projectName || project.name || project.projectCode}
          </option>
        ))}
      </select>
    </div>
  );
};