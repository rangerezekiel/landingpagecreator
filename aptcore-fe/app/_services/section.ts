'use server';

import { ApiResponseIndex, FetchApiResponse } from '@/app/_types/fetch';
import {
  Section as ThisType,
} from '@/app/_types/section';
import { fetchApi } from '@/lib/api';
import { cookies } from 'next/headers';
import { base64ToFile, toSnake } from '../_utils/objectTransformers';

const prefixUrl = '/section';

async function getCookies() {
  const cookieStore = await cookies();
  return cookieStore.get('token')?.value;
}

export async function indexData(
  domain: string,
  section: string
): Promise<FetchApiResponse<ApiResponseIndex<ThisType>>> {
  const token = await getCookies();
  return await fetchApi(
    `${prefixUrl}/${domain}/${section}`,
    { method: 'GET' },
    token
  );
}

export async function listIndexData(
  domain: string
): Promise<FetchApiResponse<ApiResponseIndex<ThisType>>> {
  const token = await getCookies();
  return await fetchApi(
    `${prefixUrl}/${domain}?viewActive=true`,
    { method: 'GET' },
    token
  );
}

export async function updateDataActive(domain: string, section: string, active: boolean) {
    const token = await getCookies();
    
    const responseData = await fetchApi(`${prefixUrl}/${domain}/${section}/active`, {
        method: 'PATCH',
        body: {active}
    }, token);
    return responseData;
}

export async function showData(
  domain: string,
  section: string,
  id: string
): Promise<FetchApiResponse<ThisType>> {
  const token = await getCookies();
  return await fetchApi(
    `${prefixUrl}/${domain}/${section}/${id}`,
    { method: 'GET' },
    token
  );
}

export async function createDataApi<T extends { sectionType: string }>(
  domain: string,
  payload: T
): Promise<FetchApiResponse<T>> {
  return await sendFormData('POST', domain, payload.sectionType, payload);
}

export async function updateDataApi<T extends { sectionType: string }>(
  domain: string,
  payload: T,
  id: string | null = null
): Promise<FetchApiResponse<T>> {
  return await sendFormData('PATCH', domain, payload.sectionType, payload, id);
}

async function sendFormData<T>(
  method: 'POST' | 'PATCH',
  domain: string,
  section: string,
  payload: T,
  id: string | null = null
): Promise<FetchApiResponse<T>> {
  const token = await getCookies();
  const snakePayload = toSnake(payload as unknown as Record<string, unknown>);
  const formData = new FormData();
  for (const [key, value] of Object.entries(snakePayload)) {
    if (value === undefined || value === null) continue;

    if (typeof value === 'string' && value.startsWith('data:image/')) {
      const file = base64ToFile(value, `${key}.webp`);
      formData.append(key, file);
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        formData.append(`${key}[]`, val);
      });
    } else {
      formData.append(key, value.toString());
    }
  }

  let url = `${prefixUrl}/${domain}/${section}`;
  if (method === 'PATCH' && id) {
    url += `/${id}`;
  }

  return await fetchApi(
    url,
    {
      method,
      body: formData,
      headers: {},
    },
    token
  );
}

export async function deleteData(
  domain: string,
  section: string,
  id: string
): Promise<FetchApiResponse<unknown>> {
  const token = await getCookies();
  return await fetchApi(
    `${prefixUrl}/${domain}/${section}/${id}`,
    { method: 'DELETE' },
    token
  );
}
