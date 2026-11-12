'use server';

import { ApiResponseIndex, FetchApiResponse } from "@/app/_types/fetch";
import { Website as ThisType } from "@/app/_types/website";
import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { base64ToFile, toSnake } from "../_utils/objectTransformers";

const prefixUrl = '/website';

async function getCookies(){
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
}

export async function indexData(parmas: string) : Promise<FetchApiResponse<ApiResponseIndex<ThisType>>> {
    const token = await getCookies();
    const responseData = await fetchApi(`${prefixUrl+parmas}`, {
        method: 'GET',
    }, token);
    
    return responseData as FetchApiResponse<ApiResponseIndex<ThisType>>;
}

export async function showData(id: string) : Promise<FetchApiResponse<ThisType>> {
    const token = await getCookies();
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'GET',
    }, token);

    return responseData as FetchApiResponse<ThisType>;
}

export async function createData(payload: ThisType) {
    const token = await getCookies();
    
    const snakePayload = toSnake(payload as unknown as Record<string, unknown>);

    const formData = new FormData();

    for (const [key, value] of Object.entries(snakePayload)) {
        if (value === undefined || value === null) continue;

        if (key === "logo" && typeof value === "string" && value.startsWith("data:image/")) {
            const file = base64ToFile(value, "logo.webp");
            formData.append("logo", file);
        }else if (key === "favicon" && typeof value === "string" && value.startsWith("data:image/")) {
            const file = base64ToFile(value, "favicon.png");
            formData.append("favicon", file);
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
        headers: {},
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

export async function updateData(id: string, payload: ThisType) {
    const token = await getCookies();
    const snakePayload = toSnake(payload as unknown as Record<string, unknown>);

    const formData = new FormData();

    for (const [key, value] of Object.entries(snakePayload)) {
        if (value === undefined || value === null) continue;

        if (key === "logo" && typeof value === "string" && value.startsWith("data:image/")) {
            const file = base64ToFile(value, "logo.webp");
            formData.append("logo", file);
        }else if (key === "favicon" && typeof value === "string" && value.startsWith("data:image/")) {
            const file = base64ToFile(value, "favicon.png");
            formData.append("favicon", file);
        } else if (Array.isArray(value)) {
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
        headers: {},
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