import React, { useState } from 'react';
import { Button } from './button';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
  onSelect?: (node: TreeNode) => void;
}

const TreeViewNode = ({ 
  node, 
  onSelect, 
  level = 0 
}: { 
  node: TreeNode; 
  onSelect?: (node: TreeNode) => void; 
  level?: number;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div 
        className="flex items-center py-1 hover:bg-gray-100 cursor-pointer"
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          }
          onSelect?.(node);
        }}
      >
        {hasChildren && (
          <span className="mr-1 text-gray-400">
            {isExpanded ? '▼' : '▶'}
          </span>
        )}
        {!hasChildren && <span className="mr-1 w-4"></span>}
        <span className="text-sm">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeViewNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({ data, onSelect }) => {
  return (
    <div className="border border-gray-200 rounded p-2 max-h-96 overflow-y-auto">
      {data.map((node) => (
        <TreeViewNode
          key={node.id}
          node={node}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};