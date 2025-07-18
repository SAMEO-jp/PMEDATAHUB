import { useState, useCallback } from 'react';
import { obsidianApi } from '@/lib/obsidianApi';
import type {
  ObsidianApiConfig,
  NoteJson,
  SearchQuery,
  SearchResult,
  VaultFile,
  Command,
  PeriodicNoteParams,
} from '@/types/obsidian';

export interface UseObsidianApiState {
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

export interface UseObsidianApiReturn extends UseObsidianApiState {
  // 設定関連
  updateConfig: (config: Partial<ObsidianApiConfig>) => void;
  getConfig: () => ObsidianApiConfig;
  
  // システム
  testConnection: () => Promise<boolean>;
  getServerInfo: () => Promise<Record<string, unknown> | null>;
  
  // アクティブファイル
  getActiveFile: () => Promise<NoteJson | null>;
  updateActiveFile: (content: string) => Promise<boolean>;
  appendToActiveFile: (content: string) => Promise<boolean>;
  patchActiveFile: (content: string) => Promise<boolean>;
  deleteActiveFile: () => Promise<boolean>;
  
  // コマンド
  getCommands: () => Promise<Command[] | null>;
  executeCommand: (commandId: string) => Promise<boolean>;
  
  // ファイル操作
  openFile: (filename: string) => Promise<boolean>;
  
  // 定期ノート
  getPeriodicNote: (params: PeriodicNoteParams) => Promise<NoteJson | null>;
  updatePeriodicNote: (params: PeriodicNoteParams, content: string) => Promise<boolean>;
  appendToPeriodicNote: (params: PeriodicNoteParams, content: string) => Promise<boolean>;
  patchPeriodicNote: (params: PeriodicNoteParams, content: string) => Promise<boolean>;
  deletePeriodicNote: (params: PeriodicNoteParams) => Promise<boolean>;
  
  // 検索
  search: (query: SearchQuery) => Promise<SearchResult | null>;
  simpleSearch: (query: string) => Promise<SearchResult | null>;
  
  // ボルト操作
  listVaultFiles: (path?: string) => Promise<VaultFile[] | null>;
  getVaultFile: (filename: string) => Promise<NoteJson | null>;
  createVaultFile: (filename: string, content: string) => Promise<boolean>;
  updateVaultFile: (filename: string, content: string) => Promise<boolean>;
  appendToVaultFile: (filename: string, content: string) => Promise<boolean>;
  patchVaultFile: (filename: string, content: string) => Promise<boolean>;
  deleteVaultFile: (filename: string) => Promise<boolean>;
  
  // 状態管理
  clearError: () => void;
  resetState: () => void;
}

export function useObsidianApi(): UseObsidianApiReturn {
  const [state, setState] = useState<UseObsidianApiState>({
    isLoading: false,
    error: null,
    isConnected: false,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setConnected = useCallback((connected: boolean) => {
    setState(prev => ({ ...prev, isConnected: connected }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isConnected: false,
    });
  }, []);

  // 設定関連
  const updateConfig = useCallback((config: Partial<ObsidianApiConfig>) => {
    obsidianApi.updateConfig(config);
  }, []);

  const getConfig = useCallback(() => {
    return obsidianApi.getConfig();
  }, []);

  // システム
  const testConnection = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.getServerInfo();
      setConnected(true);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Connection failed');
      setConnected(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setConnected]);

  const getServerInfo = useCallback(async (): Promise<Record<string, unknown> | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const info = await obsidianApi.getServerInfo();
      return info;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get server info');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // アクティブファイル
  const getActiveFile = useCallback(async (): Promise<NoteJson | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const file = await obsidianApi.getActiveFile();
      return file;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get active file');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateActiveFile = useCallback(async (content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.updateActiveFile(content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update active file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const appendToActiveFile = useCallback(async (content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.appendToActiveFile(content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to append to active file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const patchActiveFile = useCallback(async (content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.patchActiveFile(content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to patch active file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteActiveFile = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.deleteActiveFile();
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete active file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // コマンド
  const getCommands = useCallback(async (): Promise<Command[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const commands = await obsidianApi.getCommands();
      return commands;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get commands');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const executeCommand = useCallback(async (commandId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.executeCommand(commandId);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to execute command');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // ファイル操作
  const openFile = useCallback(async (filename: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.openFile(filename);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to open file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // 定期ノート
  const getPeriodicNote = useCallback(async (params: PeriodicNoteParams): Promise<NoteJson | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const note = await obsidianApi.getPeriodicNote(params);
      return note;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get periodic note');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updatePeriodicNote = useCallback(async (params: PeriodicNoteParams, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.updatePeriodicNote(params, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update periodic note');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const appendToPeriodicNote = useCallback(async (params: PeriodicNoteParams, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.appendToPeriodicNote(params, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to append to periodic note');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const patchPeriodicNote = useCallback(async (params: PeriodicNoteParams, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.patchPeriodicNote(params, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to patch periodic note');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deletePeriodicNote = useCallback(async (params: PeriodicNoteParams): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.deletePeriodicNote(params);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete periodic note');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // 検索
  const search = useCallback(async (query: SearchQuery): Promise<SearchResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await obsidianApi.search(query);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to search');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const simpleSearch = useCallback(async (query: string): Promise<SearchResult | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await obsidianApi.simpleSearch(query);
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to perform simple search');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // ボルト操作
  const listVaultFiles = useCallback(async (path?: string): Promise<VaultFile[] | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const files = await obsidianApi.listVaultFiles(path);
      return files;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to list vault files');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const getVaultFile = useCallback(async (filename: string): Promise<NoteJson | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const file = await obsidianApi.getVaultFile(filename);
      return file;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to get vault file');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const createVaultFile = useCallback(async (filename: string, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.createVaultFile(filename, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create vault file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateVaultFile = useCallback(async (filename: string, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.updateVaultFile(filename, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update vault file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const appendToVaultFile = useCallback(async (filename: string, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.appendToVaultFile(filename, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to append to vault file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const patchVaultFile = useCallback(async (filename: string, content: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.patchVaultFile(filename, content);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to patch vault file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const deleteVaultFile = useCallback(async (filename: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await obsidianApi.deleteVaultFile(filename);
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete vault file');
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  return {
    ...state,
    updateConfig,
    getConfig,
    testConnection,
    getServerInfo,
    getActiveFile,
    updateActiveFile,
    appendToActiveFile,
    patchActiveFile,
    deleteActiveFile,
    getCommands,
    executeCommand,
    openFile,
    getPeriodicNote,
    updatePeriodicNote,
    appendToPeriodicNote,
    patchPeriodicNote,
    deletePeriodicNote,
    search,
    simpleSearch,
    listVaultFiles,
    getVaultFile,
    createVaultFile,
    updateVaultFile,
    appendToVaultFile,
    patchVaultFile,
    deleteVaultFile,
    clearError,
    resetState,
  };
} 