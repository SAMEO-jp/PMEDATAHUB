export interface Seiban {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeibanListResponse {
  seiban: Seiban[];
}

export interface SeibanDetailResponse {
  seiban: Seiban;
}
