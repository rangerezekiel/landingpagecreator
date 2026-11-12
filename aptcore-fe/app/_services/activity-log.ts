'use server';

import { ApiResponseIndex, FetchApiResponse } from "@/app/_types/fetch";
import { ActivityLog as ThisType } from "@/app/_types/activity-log";
import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";

const prefixUrl = '/activity-log';

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

export async function deleteData(id: string) {
    const token = await getCookies();
    
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'DELETE',
    }, token);

    return responseData;
}