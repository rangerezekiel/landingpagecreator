'use server';

import { ApiResponseIndex, FetchApiResponse } from "@/app/_types/fetch";
import { FormSubmission as ThisType } from "@/app/_types/form-submission";
import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";

const prefixUrl = '/form-submission';

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
    
    const responseData = await fetchApi(`${prefixUrl}`, {
        method: 'POST',
        body: payload as object
    }, token);

    return responseData;
}

// Client-side form submission function (no authentication required)
export async function submitFormData(payload: {
    name: string;
    email: string;
    phone: string;
    countryCode: string;
    phoneCode: string;
    phoneNumber: string;
    message?: string;
    interest?: string;
    websiteId?: string | null;
}) {
    // The API forwards the lead to Privyr itself when the website has it
    // enabled, so the webhook URL never has to reach the frontend.
    const responseData = await fetchApi(`${prefixUrl}`, {
        method: 'POST',
        body: payload as object
    });

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
    
    const responseData = await fetchApi(`${prefixUrl}/${id}`, {
        method: 'PATCH',
        body: payload as object
    }, token);

    return responseData;
}