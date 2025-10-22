import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { NextRequest } from 'next/server';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    console.error('API error:', error);
    if (error.response?.status === 401) {
      console.warn('401: 認証エラー');
    }
    return Promise.reject(error);
  }
);

export async function apiRequest<T = unknown>(
  url: string,
  method: Method,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await api.request<T>({
      url,
      method,
      data,
      ...config,
    });
    return res.data;
  } catch (err) {
    console.error('apiRequest error:', err);
    throw err;
  }
}

// NextRequest用のパース関数
export const parseQueryParams = (req: NextRequest) => {
  const url = new URL(req.url);
  const params: Record<string, string> = {};
  
  url.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

export const parseRequestBody = async <T>(req: NextRequest): Promise<T> => {
  try {
    return await req.json();
  } catch {
    throw new Error("リクエストボディの解析に失敗しました");
  }
};

export const validateRequiredFields = (
  data: Record<string, unknown>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(field => !data[field]);
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};
