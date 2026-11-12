import type { HttpContext } from '@adonisjs/core/http'
import FormSubmission from '#models/form_submission'
import User from '#models/user'
import {
  cFormSubmissionValidator as cValidator,
  uFormSubmissionValidator as uValidator,
} from '#validators/form_submission'
import {
  sortHFn,
  indexFn,
  storeFn,
  showFn,
  updateFn,
  deleteFn,
  isSuper,
  isSuperDev,
} from '#helpers/crud'
import { hasWebsiteAccess } from '#helpers/user_cache'
import { pushLeadToPrivyr } from '#helpers/privyr'

const thisModel = FormSubmission
const moduleName = 'form_submission'

export default class FormSubmissionsController {
  async index(ctx: HttpContext) {
    const select = [
      'id',
      'website_id',
      'name',
      'email',
      'phone',
      'message',
      'created_by',
      'read_by',
      'read_at',
      'created_at',
      'status',
    ]
    const searchFields = [
      'website_id',
      'name',
      'email',
      'phone',
      'message',
      'created_by',
      'read_by',
      'read_at',
      'created_at',
      'status',
    ]
    const orderRaw = ['read_at IS NOT NULL']

    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'readAt',
      ctx.request.input('sortOrder') ?? 'DESC',
    ])

    const isSuperDevUser = ctx.jwtUser ? await isSuperDev(ctx.jwtUser.id) : false
    let conditions

    if (isSuperDevUser) {
      conditions = (query: any) => {
        query.preload('website')
      }
    } else {
      const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
      if (isSuperUser) {
        // Super user can see all form submissions
        conditions = (query: any) => {
          query.preload('website').preload('readByUser')
        }
      } else {
        // Non-super user can only see form submissions from websites assigned to them
        conditions = async (query: any) => {
          // Get fresh websiteId from database for real-time data
          const user = await User.find(ctx.jwtUser!.id)
          let freshWebsiteIds: string[] = []

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

          if (freshWebsiteIds.length > 0) {
            query.whereIn('websiteId', freshWebsiteIds)
          } else {
            // If no websites assigned, show only submissions from websites they created
            query.whereHas('website', (websiteQuery: any) => {
              websiteQuery.where('createdBy', ctx.jwtUser!.id)
            })
          }

          query.preload('website').preload('readByUser')
        }
      }
    }

    return await indexFn(
      thisModel,
      moduleName,
      ctx,
      select,
      searchFields,
      orderData,
      conditions,
      orderRaw
    )
  }

  async store(ctx: HttpContext) {
    const req = ctx.request.body()

    const record = (await storeFn(thisModel, cValidator, req)) as FormSubmission

    // Best-effort: the lead is already saved above, which stays the source of
    // truth, so a Privyr failure is logged but never fails the submission.
    // pushLeadToPrivyr no-ops unless the website has Privyr enabled.
    if (record.websiteId) {
      const privyr = await pushLeadToPrivyr(record.websiteId, {
        name: record.name ?? '',
        email: record.email,
        phone: record.phone,
        // Source/Website are added by pushLeadToPrivyr from the website record.
        otherFields: {
          ...(record.message ? { Message: record.message } : {}),
        },
      })

      if (!privyr.success && !privyr.skipped) {
        ctx.logger.error(
          { err: privyr.error, websiteId: record.websiteId },
          '[privyr] lead push failed'
        )
      }
    }

    return record
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const data = (await showFn(thisModel, id)) as FormSubmission

    // Check if user has access to this form submission
    if (ctx.jwtUser) {
      const isSuperUser = await isSuper(ctx.jwtUser.id)
      if (!isSuperUser) {
        const hasAccess = await hasWebsiteAccess(ctx.jwtUser.id, data.websiteId)
        if (!hasAccess) {
          return ctx.response.forbidden({ message: 'You shall not pass' })
        }
      }
    }

    // Mark as read if not already read
    if (ctx?.jwtUser?.id && data.readBy === null) {
      const payload = {
        readBy: ctx.jwtUser.id,
        readAt: new Date(),
      }

      data.merge(payload)
      data.save()
    }

    return data
  }

  async update(ctx: HttpContext) {
    const req = ctx.request.body()
    const id = ctx.params.id

    // Check if user has access to this form submission
    if (ctx.jwtUser) {
      const data = await FormSubmission.findOrFail(id)
      const isSuperUser = await isSuper(ctx.jwtUser.id)
      if (!isSuperUser) {
        const hasAccess = await hasWebsiteAccess(ctx.jwtUser.id, data.websiteId)
        if (!hasAccess) {
          return ctx.response.forbidden({ message: 'You shall not pass' })
        }
      }
    }

    return await updateFn(thisModel, moduleName, uValidator, id, ctx, req)
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    // Check if user has access to this form submission
    if (ctx.jwtUser) {
      const data = await FormSubmission.findOrFail(id)
      const isSuperUser = await isSuper(ctx.jwtUser.id)
      if (!isSuperUser) {
        const hasAccess = await hasWebsiteAccess(ctx.jwtUser.id, data.websiteId)
        if (!hasAccess) {
          return ctx.response.forbidden({ message: 'You shall not pass' })
        }
      }
    }

    return await deleteFn(thisModel, moduleName, id, ctx)
  }
}
