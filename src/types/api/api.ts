// types/api.ts
export type ApiSuccess<T> = {
    success: true;
    data: T;
  };

  export type ApiError = {
    success: false;
    error: {
      code: string;
      message: string;
      status?: number;
    };
  };

  export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// DAL層の統一戻り値型
export type DALResponse<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: {
    code: string;
    message: string;
  };
};
  