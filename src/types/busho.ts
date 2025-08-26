export interface Busho {
  id: string;
  name: string;
  description: string;
  category: 'seisen' | 'renchu'; // 製銑・精錬 or 連鋳・圧延プラント設計
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BushoListResponse {
  busho: Busho[];
}

export interface BushoDetailResponse {
  busho: Busho;
}
