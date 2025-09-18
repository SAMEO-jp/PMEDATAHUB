import { OnLocalChange, OnCommit } from '../ui/types';
import { CustomDropdown } from './CustomDropdown';

// プロジェクト型の統一（両方の型に対応）
interface UnifiedProject {
  code: string;
  name: string;
  description?: string;
  status?: string;
}

// 両方のProject型に対応する型定義
type ProjectVariant = 
  | { projectCode?: string; projectName?: string; name?: string; description?: string; status?: string }
  | { code: string; name: string; description?: string; status?: string };

interface ProjectSelectProps {
  value: string;
  onLocalChange: OnLocalChange;
  onCommit?: OnCommit;
  projects?: ProjectVariant[];
  label?: string;
  placeholder?: string;
}

// プロジェクトデータを統一形式に変換する関数
const normalizeProject = (project: ProjectVariant): UnifiedProject => {
  // types/index.tsのProject型の場合
  if ('projectCode' in project && project.projectCode) {
    return {
      code: project.projectCode,
      name: project.projectName || project.name || '',
      description: project.description,
      status: project.status
    };
  }
  // ui/types.tsのProject型の場合
  if ('code' in project) {
    return {
      code: project.code,
      name: project.name,
      description: project.description,
      status: project.status
    };
  }
  // フォールバック
  return {
    code: '',
    name: project.name || '',
    description: project.description,
    status: project.status
  };
};

export const ProjectSelect = ({
  value,
  onLocalChange,
  onCommit,
  projects = [],
  label = "プロジェクト",
  placeholder = "プロジェクト選択"
}: ProjectSelectProps) => {
  // プロジェクトデータを統一形式に変換
  const normalizedProjects = projects.map(normalizeProject);

  // カスタムドロップダウン用のオプションに変換
  const dropdownOptions = normalizedProjects.map((project) => ({
    value: project.code,
    label: project.name,
    subLabel: project.code ? `プロジェクトコード: ${project.code}` : undefined,
    description: project.description || project.status
  }));

  return (
    <div>
      <select
        value={value}
        onChange={(e) => onLocalChange(e.target.value)}
        onBlur={(e) => onCommit?.(e.target.value)}
        className="w-full p-1 border border-gray-300 rounded text-xs"
      >
        <option value="">{placeholder}</option>
        {normalizedProjects.map((project, index) => (
          <option key={index} value={project.code}>
            {project.name} ({project.code})
          </option>
        ))}
      </select>
    </div>
  );
};
