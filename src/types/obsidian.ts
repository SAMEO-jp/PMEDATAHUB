// Obsidian Local REST API 型定義

export interface ObsidianError {
  errorCode: number;
  message: string;
}

export interface NoteJson {
  content: string;
  frontmatter: Record<string, any>;
  path: string;
  stat: {
    mtime: string;
    ctime: string;
    size: number;
  };
  tags: string[];
}

export interface SearchQuery {
  query: string;
  caseSensitive?: boolean;
  regex?: boolean;
}

export interface SearchResult {
  files: string[];
  matches: Array<{
    file: string;
    line: number;
    content: string;
  }>;
}

export interface VaultFile {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
}

export interface Command {
  id: string;
  name: string;
  description?: string;
}

export interface PeriodicNoteParams {
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  year?: number;
  month?: number;
  day?: number;
}

// API エンドポイントの型定義
export interface ObsidianApiEndpoints {
  // システム
  getServerInfo: () => Promise<Record<string, unknown>>;
  getCertificate: () => Promise<string>;
  getOpenApiSpec: () => Promise<string>;
  
  // アクティブファイル
  getActiveFile: () => Promise<NoteJson>;
  updateActiveFile: (content: string) => Promise<void>;
  appendToActiveFile: (content: string) => Promise<void>;
  patchActiveFile: (content: string) => Promise<void>;
  deleteActiveFile: () => Promise<void>;
  
  // コマンド
  getCommands: () => Promise<Command[]>;
  executeCommand: (commandId: string) => Promise<void>;
  
  // ファイル操作
  openFile: (filename: string) => Promise<void>;
  
  // 定期ノート
  getPeriodicNote: (params: PeriodicNoteParams) => Promise<NoteJson>;
  updatePeriodicNote: (params: PeriodicNoteParams, content: string) => Promise<void>;
  appendToPeriodicNote: (params: PeriodicNoteParams, content: string) => Promise<void>;
  patchPeriodicNote: (params: PeriodicNoteParams, content: string) => Promise<void>;
  deletePeriodicNote: (params: PeriodicNoteParams) => Promise<void>;
  
  // 検索
  search: (query: SearchQuery) => Promise<SearchResult>;
  simpleSearch: (query: string) => Promise<SearchResult>;
  
  // ボルト操作
  listVaultFiles: (path?: string) => Promise<VaultFile[]>;
  getVaultFile: (filename: string) => Promise<NoteJson>;
  createVaultFile: (filename: string, content: string) => Promise<void>;
  updateVaultFile: (filename: string, content: string) => Promise<void>;
  appendToVaultFile: (filename: string, content: string) => Promise<void>;
  patchVaultFile: (filename: string, content: string) => Promise<void>;
  deleteVaultFile: (filename: string) => Promise<void>;
}

// API設定
export interface ObsidianApiConfig {
  host: string;
  port: number;
  apiKey: string;
  useHttps: boolean;
}

export const DEFAULT_OBSIDIAN_CONFIG: ObsidianApiConfig = {
  host: '127.0.0.1',
  port: 27124,
  apiKey: '',
  useHttps: true,
}; 