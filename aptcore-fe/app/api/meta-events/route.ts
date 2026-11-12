import { handleMetaEvent } from '@/lib/meta-conversions-server'

export async function POST(req: Request) {
  return handleMetaEvent(req)
}
