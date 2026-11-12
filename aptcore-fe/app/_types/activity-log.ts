export interface ActivityLog {
  id: string
  websiteId: string
  userId: string
  action: string
  module: string
  note: string
  ipAddress: string | null
  userAgent: string | null
  url: string | null
  method: string
  status: string
  payload: Record<string, unknown> | null
  createdAt: string
  website?: {
    id: string
    title: string
    domain: string
  } | null
  user?: {
    id: string
    fullName: string
    username: string
  } | null
}

export interface ActivityLogIndexResponse {
  meta: Record<string, unknown>
  data: ActivityLog[]
}
