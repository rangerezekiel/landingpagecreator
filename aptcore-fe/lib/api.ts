import { FetchApiResponse, FetchOptions } from "@/app/_types/fetch";
import { toSnake } from "@/app/_utils/objectTransformers";

export async function fetchApi<T>(
  endpoint: string,
  options: FetchOptions = {},
  explicitToken?: string
): Promise<FetchApiResponse<T>> {
  const { method = 'GET', body, headers = {}, cache = 'default' } = options;
  const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  const combinedHeaders: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
    ...headers,
  };

  if (explicitToken) {
    (combinedHeaders as Record<string, string>).Authorization = `Bearer ${explicitToken}`;
  }

  const payload: RequestInit = {
    method,
    cache,
    headers: combinedHeaders,
    ...(body
      ? {
          body: isFormData ? body : JSON.stringify(toSnake(body as Record<string, unknown>)),
        }
      : {}),
  };

  const res = await fetch(url, payload);
  const responseText = await res.text();

  try {
    const parsed = JSON.parse(responseText);

    if (res.status === 422) {
      return {
        status: res.status,
        data: null,
        error: parsed,
      };
    }

    return {
      status: res.status,
      data: parsed,
      error: '',
    };
  } catch (error: unknown) {
    return {
      status: res.status,
      data: null,
      error: responseText + error,
    };
  }
}
