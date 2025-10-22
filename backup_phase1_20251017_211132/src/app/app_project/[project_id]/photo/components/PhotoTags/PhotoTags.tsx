'use client';

import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';

interface PhotoTagsProps {
  photoId: number;
  currentTags: string[];
  availableTags: string[];
  onTagsUpdate: (tags: string[]) => void;
}

export default function PhotoTags({
  photoId,
  currentTags,
  availableTags,
  onTagsUpdate,
}: PhotoTagsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      onTagsUpdate([...currentTags, newTag.trim()]);
      setNewTag('');
      setIsAdding(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsUpdate(currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewTag('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">タグ</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-2 py-1 text-xs text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-3 h-3 mr-1" />
          追加
        </button>
      </div>

      {/* 現在のタグ */}
      <div className="flex flex-wrap gap-1">
        {currentTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
          >
            <Tag className="w-2 h-2 mr-1" />
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              <X className="w-2 h-2" />
            </button>
          </span>
        ))}
      </div>

      {/* タグ追加フォーム */}
      {isAdding && (
        <div className="flex items-center space-x-1">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいタグ"
            className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleAddTag}
            className="px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            追加
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewTag('');
            }}
            className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            キャンセル
          </button>
        </div>
      )}

      {/* 利用可能なタグ */}
      {availableTags.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-700 mb-1">利用可能なタグ</h4>
          <div className="flex flex-wrap gap-1">
            {availableTags
              .filter(tag => !currentTags.includes(tag))
              .map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagsUpdate([...currentTags, tag])}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <Tag className="w-2 h-2 mr-1" />
                  {tag}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 