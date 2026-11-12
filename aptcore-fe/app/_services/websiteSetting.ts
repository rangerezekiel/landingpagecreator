'use server';

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers";
import { FetchApiResponse } from "../_types/fetch";

const prefixUrl = '/website-setting';

async function getCookies(){
    const cookieStore = await cookies();
    return cookieStore.get('token')?.value;
}

export async function keyData(domain: string) : Promise<FetchApiResponse<string[]>> {
    const token = await getCookies();
    const responseData = await fetchApi(`${prefixUrl}/${domain}/keys`, {
        method: 'GET',
    }, token);
    
    return responseData as unknown as FetchApiResponse<string[]>;
}

export async function keyDataUpdate(domain: string, payload: { [key: string]: string } ){
    const token = await getCookies();
    const responseData = await fetchApi(`${prefixUrl}/${domain}/keys`, {
        method: 'PATCH',
        body: payload as object
    }, token);

    return responseData as unknown as FetchApiResponse<string>;
}