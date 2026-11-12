import { isSuper } from '#helpers/crud'
import FormSubmission from '#models/form_submission'
import User from '#models/user'
import Website from '#models/website'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index(ctx: HttpContext) {
    const { jwtUser } = ctx
    const isSuperUser = jwtUser ? await isSuper(jwtUser.id) : false

    let totalUserResult
    let submissionTotalResult
    let submissionTotalUnreadResult
    let recentUnreadSubmissions: any[] = []
    let websiteSubmissionCounts: any[] = []
    let websiteTotalResult

    if (isSuperUser) {
      totalUserResult = await User.query().count('* as total').firstOrFail()
      submissionTotalResult = await FormSubmission.query().count('* as total').firstOrFail()
      submissionTotalUnreadResult = await FormSubmission.query()
        .whereNull('readBy')
        .count('* as total')
        .firstOrFail()

      // Get recent unread submissions (max 5)
      recentUnreadSubmissions = await FormSubmission.query()
        .whereNull('readBy')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .preload('website', (query) => {
          query.select('id', 'title', 'domain')
        })

      // Get submission count per website (trashed submissions are excluded by the relation)
      websiteSubmissionCounts = await Website.query()
        .select('id', 'title', 'domain')
        .withCount('formSubmissions', (query) => {
          query.as('total_submissions')
        })
        .withCount('formSubmissions', (query) => {
          query.whereNull('readBy').as('unread_submissions')
        })

      websiteTotalResult = await Website.query().count('* as total').firstOrFail()
    } else if (jwtUser) {
      // Always fetch fresh websiteId from database for real-time data
      let freshWebsiteIds: string[] = []
      const user = await User.find(jwtUser.id)
      if (user?.websiteId) {
        const current = user.websiteId
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
      }

      // Count users for websites the user has access to
      totalUserResult = await User.query()
        .where((query) => {
          if (freshWebsiteIds.length > 0) {
            query
              .whereIn('websiteId', freshWebsiteIds)
              .orWhere('websiteId', 'like', '%' + freshWebsiteIds.join('%') + '%')
          } else {
            query.whereRaw('1 = 0')
          }
        })
        .count('* as total')
        .firstOrFail()

      // Count submissions for websites the user has access to
      submissionTotalResult = await FormSubmission.query()
        .where((query) => {
          if (freshWebsiteIds.length > 0) {
            query.whereIn('websiteId', freshWebsiteIds)
          } else {
            query.whereRaw('1 = 0')
          }
        })
        .count('* as total')
        .firstOrFail()

      submissionTotalUnreadResult = await FormSubmission.query()
        .where((query) => {
          if (freshWebsiteIds.length > 0) {
            query.whereIn('websiteId', freshWebsiteIds)
          } else {
            query.whereRaw('1 = 0')
          }
        })
        .whereNull('readBy')
        .count('* as total')
        .firstOrFail()

      // Get recent unread submissions for websites the user has access to (max 5)
      recentUnreadSubmissions = await FormSubmission.query()
        .where((query) => {
          if (freshWebsiteIds.length > 0) {
            query.whereIn('websiteId', freshWebsiteIds)
          } else {
            query.whereRaw('1 = 0')
          }
        })
        .whereNull('readBy')
        .orderBy('createdAt', 'desc')
        .limit(5)
        .preload('website', (query) => {
          query.select('id', 'title', 'domain')
        })

      // Get submission count for websites the user has access to
      websiteSubmissionCounts = await Website.query()
        .where((query) => {
          if (freshWebsiteIds.length > 0) {
            query.whereIn('id', freshWebsiteIds).orWhere('createdBy', jwtUser.id)
          } else {
            query.where('createdBy', jwtUser.id)
          }
        })
        .select('id', 'title', 'domain')
        .withCount('formSubmissions', (query) => {
          query.as('total_submissions')
        })
        .withCount('formSubmissions', (query) => {
          query.whereNull('readBy').as('unread_submissions')
        })

      // Count websites the user has access to
      websiteTotalResult = await Website.query()
        .where((query) => {
          if (freshWebsiteIds.length > 0) {
            query.whereIn('id', freshWebsiteIds).orWhere('createdBy', jwtUser.id)
          } else {
            query.where('createdBy', jwtUser.id)
          }
        })
        .count('* as total')
        .firstOrFail()
    } else {
      totalUserResult = { $extras: { total: 0 } }
      submissionTotalResult = { $extras: { total: 0 } }
      submissionTotalUnreadResult = { $extras: { total: 0 } }
      websiteTotalResult = { $extras: { total: 0 } }
    }

    return {
      totalUser: Number(totalUserResult.$extras.total),
      totalWebsite: Number(websiteTotalResult.$extras.total),
      totalSubmission: Number(submissionTotalResult.$extras.total),
      totalSubmissionUnread: Number(submissionTotalUnreadResult.$extras.total),
      recentUnreadSubmissions: recentUnreadSubmissions.map((submission) => ({
        id: submission.id,
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        message: submission.message,
        status: submission.status,
        createdAt: submission.createdAt,
        website: {
          id: submission.website.id,
          title: submission.website.title,
          domain: submission.website.domain,
        },
      })),
      websiteSubmissionCounts: websiteSubmissionCounts.map((website) => ({
        id: website.id,
        title: website.title,
        domain: website.domain,
        totalSubmissions: Number(website.$extras.total_submissions),
        unreadSubmissions: Number(website.$extras.unread_submissions),
      })),
    }
  }
}
