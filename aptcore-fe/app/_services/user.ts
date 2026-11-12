'use server';

import { ApiResponseIndex, FetchApiResponse } from "@/app/_types/fetch";
import { User, UserField, UserIndex } from "@/app/_types/user";
import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { base64ToFile, toSnake } from "@/app/_utils/objectTransformers";

const prefixUrl = '/user';

async function getCookies(){
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
}

export async function indexData(parmas: string) : Promise<FetchApiResponse<ApiResponseIndex<UserIndex>>> {
    const token = await getCookies();
    const responseData = await fetchApi(`${prefixUrl+parmas}`, {
        method: 'GET',
    }, token);

    return responseData as FetchApiResponse<ApiResponseIndex<UserIndex>>;
}

export async function showData(id: string) : Promise<FetchApiResponse<User>> {
    const token = await getCookies();
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'GET',
    }, token);

    return responseData as FetchApiResponse<User>;
}

export async function createData(payload: UserField) {
  const token = await getCookies();

  const [countryCode = "", phoneCode = ""] = payload.countryPhoneCode?.split("-") || [];
  payload.countryCode = countryCode;
  payload.phoneCode = phoneCode;
  payload.phone = `${phoneCode}${payload.phoneNumber || ""}`;

  const snakePayload = toSnake(payload as unknown as Record<string, unknown>);

  const formData = new FormData();

  for (const [key, value] of Object.entries(snakePayload)) {
    if (value === undefined || value === null) continue;

    if (key === "avatar" && typeof value === "string" && value.startsWith("data:image/")) {
      const file = base64ToFile(value, "avatar.webp");
      formData.append("avatar", file);
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
        formData.append(`${key}[]`, val);
      });
    } else {
      formData.append(key, value.toString());
    }
  }

  const responseData = await fetchApi(`${prefixUrl}`, {
    method: "POST",
    body: formData,
    headers: {}, // don't set Content-Type becaouse wont to set Form Data
  }, token);

  return responseData;
}

export async function deleteData(id: string) {
    const token = await getCookies();
    
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'DELETE',
    }, token);

    return responseData;
}

export async function deletePermanentlyDataApi(id: string) {
    const token = await getCookies();
    
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'DELETE',
        body: {
            "permanent" : true
        }
    }, token);

    return responseData;
}


export async function updateData(id: string, payload: UserField) {
  const token = await getCookies();

  const [countryCode = '', phoneCode = ''] = payload.countryPhoneCode?.split('-') || [];
  payload.countryCode = countryCode;
  payload.phoneCode = phoneCode;
  payload.phone = `${phoneCode}${payload.phoneNumber || ''}`;

  const snakePayload = toSnake(payload as unknown as Record<string, unknown>);
  const formData = new FormData();

  for (const [key, value] of Object.entries(snakePayload)) {
    if (value === undefined || value === null) continue;

    if (key === "avatar" && typeof value === "string" && value.startsWith("data:image/")) {
      const file = base64ToFile(value, "avatar.webp");
      formData.append("avatar", file);
    } else if (Array.isArray(value)) {
      // For array (roles), Send as format: roles[]=admin&roles[]=editor
      value.forEach((val) => {
        formData.append(`${key}[]`, val);
      });
    } else {
      formData.append(key, value.toString());
    }
  }

  const responseData = await fetchApi(`${prefixUrl}/${id}`, {
    method: "PATCH",
    body: formData,
    headers: {}, // don't set Content-Type becaouse wont to set Form Data
  }, token);

  return responseData;
}


export async function restoreData(id: string) {
    const token = await getCookies();
    
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'PATCH',
        body: {
            "restore" : true
        }
    }, token);

    return responseData;
}