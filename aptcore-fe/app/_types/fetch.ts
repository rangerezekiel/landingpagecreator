export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface FetchOptions {
  method?: Method;
  body?: Record<string, unknown> | string | object;
  headers?: HeadersInit;
  cache?: RequestCache;
}

export type ValidationErrorInfo = {
  field: string;
  message: string;
  rule: string;
};

export type ValidationError = {
  errors: ValidationErrorInfo[];
};

export interface FetchApiResponse<U> {
  status: number;
  message?: string;
  data: U | null;
  error?: ValidationError | string;
}

export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path?: string;
  firstPage?: number;
  firstPageUrl?: string;
  lastPageUrl?: string;
  nextPageUrl?: string | null;
  previousPageUrl?: string | null;
}

export interface ApiResponseIndex<T> {
  data: T[];
  meta: PaginationMeta;
}
