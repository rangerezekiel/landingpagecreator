'use server'

import { fetchApi } from "@/lib/api";
import { cookies } from "next/headers"
import { redirect, RedirectType } from "next/navigation";
import { AuthResponseData, AuthApiResponse } from "@/app/_types/user";

export async function loginProcess(payload: {
  username: string
  password: string;
}): Promise<AuthApiResponse> {

    const userResponse = await fetchApi('/auth/login', {
        method: 'POST',
        body : {
          "email" : payload.username,
          "username" : payload.username,
          "password" : payload.password
        },
    })
    
  if (userResponse.status === 200 && userResponse.data) {
    const { token, user, roles, permissions } = userResponse.data as AuthResponseData;

    const cookieStore = await cookies()
    cookieStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    })

    return {
      status: userResponse.status,
      data: {
        user: user,
        roles: roles,
        permissions: permissions,
        token: token
      },
      error: null
    };
  }

  return {
    status: userResponse.status,
    data: null,
    error: String(userResponse.error)
  };
}

export async function logoutProcess() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  redirect('/login', RedirectType.push);
  return true
}

export async function getAuthSession(): Promise<AuthResponseData | null> {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetchApi<AuthResponseData>('/auth/me', {
      method: 'GET',
      cache: 'no-store'
    }, token); 

    if (response.status === 200 && response.data) {
      return response.data;
    } else {
     (await cookies()).delete('token');
    }
  } catch (error) {
    console.error('getAuthSession (Server Action): Error during API call to AdonisJS:', error);
    (await cookies()).delete('token');
  }

  return null;
}