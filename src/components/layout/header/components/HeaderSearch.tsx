import React, { useState, useRef, useEffect } from 'react';

interface HeaderSearchProps {
  isOpen: boolean;
  placeholder?: string;
  onSearch: (query: string) => void;
  onToggle: () => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

/**
 * ヘッダーの検索機能を表示するコンポーネント
 */
export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  isOpen,
  placeholder = '検索...',
  onSearch,
  onToggle,
  searchQuery,
  onSearchQueryChange,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // 検索が開いたときにフォーカスを当てる
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 検索クエリが外部から変更されたときに同期
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearchQueryChange(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onToggle();
    }
  };

  const handleClear = () => {
    setInputValue('');
    onSearchQueryChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`header-search ${isOpen ? 'header-search-open' : ''}`}>
      {/* 検索ボタン */}
      <button
        className="header-search-toggle"
        onClick={onToggle}
        aria-label="検索を開く"
      >
        <span className="material-symbols-outlined">search</span>
      </button>

      {/* 検索フォーム */}
      {isOpen && (
        <form className="header-search-form" onSubmit={handleSubmit}>
          <div className="header-search-input-wrapper">
            <span className="material-symbols-outlined header-search-icon">
              search
            </span>
            <input
              ref={inputRef}
              type="text"
              className="header-search-input"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              aria-label="検索キーワード"
            />
            {inputValue && (
              <button
                type="button"
                className="header-search-clear"
                onClick={handleClear}
                aria-label="検索をクリア"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            )}
          </div>
          <button
            type="submit"
            className="header-search-submit"
            disabled={!inputValue.trim()}
            aria-label="検索を実行"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
        </form>
      )}
    </div>
  );
}; 