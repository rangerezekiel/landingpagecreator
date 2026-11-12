import { handleActivityLog } from '@/lib/activity-log/server'

export async function POST(req: Request) {
  return handleActivityLog(req)
}
