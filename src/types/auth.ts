/**
 * @file 認証関連の型定義
 * ログイン機能で使用する型を定義
 */

/**
 * USERテーブルの基本ユーザー情報
 */
export interface User {
  user_id: string;
  name_japanese: string;
  company: string;
  bumon: string;
  sitsu: string;
  ka: string;
  syokui: string;
}

/**
 * ユーザー検索結果の型（軽量版）
 * 検索結果一覧で表示するために最小限の情報のみ
 */
export interface UserSearchResult {
  user_id: string;
  name_japanese: string;
  bumon: string;
  syokui: string;
}

/**
 * ログイン済みユーザーの情報
 * ログイン時刻を追加したユーザー情報
 */
export interface LoginUser extends User {
  loginTime: string;
}

/**
 * 認証状態の管理
 */
export interface AuthState {
  user: LoginUser | null;
  isLoggedIn: boolean;
}

/**
 * ログインモーダルの状態管理
 */
export interface LoginModalState {
  isOpen: boolean;
  loginMethod: 'userid' | 'name';
  userIdInput: string;
  nameInput: string;
  searchResults: UserSearchResult[];
  selectedUser: UserSearchResult | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * ログインリクエストの型
 */
export interface LoginRequest {
  userId: string;
}

/**
 * ユーザー検索リクエストの型
 */
export interface UserSearchRequest {
  name: string;
}

/**
 * ユーザー検証結果の型
 */
export interface UserValidationResult {
  isValid: boolean;
  userId: string;
}

/**
 * API レスポンスの基本型
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * ログイン成功時のレスポンス型
 */
export type LoginResponse = ApiResponse<LoginUser>;

/**
 * ユーザー検索成功時のレスポンス型
 */
export type UserSearchResponse = ApiResponse<UserSearchResult[]>;

/**
 * ユーザー検証成功時のレスポンス型
 */
export type UserValidationResponse = ApiResponse<UserValidationResult>;

/**
 * ログアウト成功時のレスポンス型
 */
export type LogoutResponse = ApiResponse<{
  logoutTime: string;
  message: string;
}>;