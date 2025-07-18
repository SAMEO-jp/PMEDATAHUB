import {
  ObsidianApiConfig,
  ObsidianApiEndpoints,
  ObsidianError,
  NoteJson,
  SearchQuery,
  SearchResult,
  VaultFile,
  Command,
  PeriodicNoteParams,
  DEFAULT_OBSIDIAN_CONFIG,
} from '../types/obsidian';

export class ObsidianApiClient implements ObsidianApiEndpoints {
  private config: ObsidianApiConfig;
  private baseUrl: string;

  constructor(config: Partial<ObsidianApiConfig> = {}) {
    this.config = { ...DEFAULT_OBSIDIAN_CONFIG, ...config };
    this.baseUrl = `${this.config.useHttps ? 'https' : 'http'}://${this.config.host}:${this.config.port}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      
      if (!response.ok) {
        const errorData: ObsidianError = await response.json();
        throw new Error(`Obsidian API Error ${errorData.errorCode}: ${errorData.message}`);
      }

      // テキストレスポンスの場合
      if (response.headers.get('content-type')?.includes('text/')) {
        return response.text() as T;
      }

      return response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Network error: ${String(error)}`);
    }
  }

  // システム
  async getServerInfo(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>('/');
  }

  async getCertificate(): Promise<string> {
    return this.request<string>('/obsidian-local-rest-api.crt');
  }

  async getOpenApiSpec(): Promise<string> {
    return this.request<string>('/openapi.yaml');
  }

  // アクティブファイル
  async getActiveFile(): Promise<NoteJson> {
    return this.request<NoteJson>('/active/');
  }

  async updateActiveFile(content: string): Promise<void> {
    await this.request<void>('/active/', {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async appendToActiveFile(content: string): Promise<void> {
    await this.request<void>('/active/', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async patchActiveFile(content: string): Promise<void> {
    await this.request<void>('/active/', {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteActiveFile(): Promise<void> {
    await this.request<void>('/active/', {
      method: 'DELETE',
    });
  }

  // コマンド
  async getCommands(): Promise<Command[]> {
    return this.request<Command[]>('/commands/');
  }

  async executeCommand(commandId: string): Promise<void> {
    await this.request<void>(`/commands/${commandId}/`, {
      method: 'POST',
    });
  }

  // ファイル操作
  async openFile(filename: string): Promise<void> {
    await this.request<void>(`/open/${encodeURIComponent(filename)}`, {
      method: 'POST',
    });
  }

  // 定期ノート
  async getPeriodicNote(params: PeriodicNoteParams): Promise<NoteJson> {
    const { period, year, month, day } = params;
    let endpoint = `/periodic/${period}/`;
    
    if (year && month && day) {
      endpoint = `/periodic/${period}/${year}/${month}/${day}/`;
    }
    
    return this.request<NoteJson>(endpoint);
  }

  async updatePeriodicNote(params: PeriodicNoteParams, content: string): Promise<void> {
    const { period, year, month, day } = params;
    let endpoint = `/periodic/${period}/`;
    
    if (year && month && day) {
      endpoint = `/periodic/${period}/${year}/${month}/${day}/`;
    }
    
    await this.request<void>(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async appendToPeriodicNote(params: PeriodicNoteParams, content: string): Promise<void> {
    const { period, year, month, day } = params;
    let endpoint = `/periodic/${period}/`;
    
    if (year && month && day) {
      endpoint = `/periodic/${period}/${year}/${month}/${day}/`;
    }
    
    await this.request<void>(endpoint, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async patchPeriodicNote(params: PeriodicNoteParams, content: string): Promise<void> {
    const { period, year, month, day } = params;
    let endpoint = `/periodic/${period}/`;
    
    if (year && month && day) {
      endpoint = `/periodic/${period}/${year}/${month}/${day}/`;
    }
    
    await this.request<void>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deletePeriodicNote(params: PeriodicNoteParams): Promise<void> {
    const { period, year, month, day } = params;
    let endpoint = `/periodic/${period}/`;
    
    if (year && month && day) {
      endpoint = `/periodic/${period}/${year}/${month}/${day}/`;
    }
    
    await this.request<void>(endpoint, {
      method: 'DELETE',
    });
  }

  // 検索
  async search(query: SearchQuery): Promise<SearchResult> {
    return this.request<SearchResult>('/search/', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async simpleSearch(query: string): Promise<SearchResult> {
    return this.request<SearchResult>('/search/simple/', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });
  }

  // ボルト操作
  async listVaultFiles(path?: string): Promise<VaultFile[]> {
    const endpoint = path ? `/vault/${encodeURIComponent(path)}/` : '/vault/';
    return this.request<VaultFile[]>(endpoint);
  }

  async getVaultFile(filename: string): Promise<NoteJson> {
    return this.request<NoteJson>(`/vault/${encodeURIComponent(filename)}`);
  }

  async createVaultFile(filename: string, content: string): Promise<void> {
    await this.request<void>(`/vault/${encodeURIComponent(filename)}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async updateVaultFile(filename: string, content: string): Promise<void> {
    await this.request<void>(`/vault/${encodeURIComponent(filename)}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async appendToVaultFile(filename: string, content: string): Promise<void> {
    await this.request<void>(`/vault/${encodeURIComponent(filename)}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async patchVaultFile(filename: string, content: string): Promise<void> {
    await this.request<void>(`/vault/${encodeURIComponent(filename)}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async deleteVaultFile(filename: string): Promise<void> {
    await this.request<void>(`/vault/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    });
  }

  // 設定更新
  updateConfig(newConfig: Partial<ObsidianApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.baseUrl = `${this.config.useHttps ? 'https' : 'http'}://${this.config.host}:${this.config.port}`;
  }

  // 設定取得
  getConfig(): ObsidianApiConfig {
    return { ...this.config };
  }
}

// シングルトンインスタンス
export const obsidianApi = new ObsidianApiClient(); 