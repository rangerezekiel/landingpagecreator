import User from '#models/user'
import Website from '#models/website'

const userCache = new Map<string, { user: User; expiresAt: number }>()

export async function getCachedUser(userId: string): Promise<User | null> {
  const now = Date.now()
  const cached = userCache.get(userId)
  const ttl = 24 * 60 * 60 * 1000

  if (cached && cached.expiresAt > now) {
    cached.expiresAt = now + ttl
    userCache.set(userId, cached)
    return cached.user
  }

  const user = await User.find(userId)
  if (!user) return null

  userCache.set(userId, {
    user,
    expiresAt: now + ttl,
  })

  return user
}

/**
 * Check if user has access to a specific website
 * @param userId - User ID to check
 * @param websiteId - Website ID to check access for
 * @returns Promise<boolean> - True if user has access, false otherwise
 */
export async function hasWebsiteAccess(userId: string, websiteId: string): Promise<boolean> {
  const user = await User.find(userId)
  if (!user) return false

  if (user.websiteId) {
    const current = user.websiteId
    let freshWebsiteIds: string[] = []

    if (Array.isArray(current as unknown as any)) {
      freshWebsiteIds = current as unknown as string[]
    } else if (typeof current === 'string') {
      const t = current.trim()
      if (t.startsWith('[')) {
        try {
          const parsed = JSON.parse(t)
          freshWebsiteIds = Array.isArray(parsed) ? parsed : t ? [t] : []
        } catch {
          freshWebsiteIds = t ? [t] : []
        }
      } else {
        freshWebsiteIds = t ? [t] : []
      }
    }

    // Check if user has access to this website
    if (freshWebsiteIds.includes(websiteId)) {
      return true
    }
  }

  // Check if user created the website
  const website = await Website.find(websiteId)
  return website?.createdBy === userId
}
