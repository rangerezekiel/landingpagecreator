'use server'

import { NextResponse } from 'next/server'
import { fetchApi } from '@/lib/api'
import { cookies } from 'next/headers'

export async function getClientMeta(req: Request): Promise<{
  ip: string | null
  userAgent: string | null
}> {
  const forwarded = req.headers.get('x-forwarded-for')
  const headerIp = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip')
  const ip = headerIp || null
  const userAgent = req.headers.get('user-agent') || null
  return { ip, userAgent }
}

async function getCookies() {
  const cookieStore = cookies()
  return (await cookieStore).get('token')?.value
}

/**
 * Server handler untuk menyisipkan IP, user-agent, dan JWT sebelum kirim ke AdonisJS
 */
export async function handleActivityLog(req: Request) {
  const token = await getCookies()

  try {
    const body = await req.json()
    const clientMeta = await getClientMeta(req)
    const { ip, userAgent } = clientMeta
    const method = req.method

    const log = {
      ...body,
      ip_address: ip,
      user_agent: userAgent,
      method,
    }

    const apiUrl = '/activity-log' + (body.postFix ?? '')
    const result = await fetchApi(apiUrl, {
      method: 'POST',
      body: log,
    }, token)

    return NextResponse.json({ success: true, status: result.status })
  } catch (error) {
    console.error('Failed to handle activity log:', error)
    return NextResponse.json({ success: false, error: 'Logging failed' }, { status: 500 })
  }
}
