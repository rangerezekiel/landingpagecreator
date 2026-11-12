import type { HttpContext } from '@adonisjs/core/http'
import ActivityLog from '#models/activity_log'
import { activityLogValidator as cValidator } from '#validators/activity_log'
import { sortHFn, indexFn, storeFn, showFn, deleteFn, isSuper } from '#helpers/crud'

const thisModel = ActivityLog
const moduleName = 'activity_log'

export default class ActivityLogController {
  async index(ctx: HttpContext) {
    const select = ['*']
    const searchFields = ['user_id', 'action', 'created_at']
    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'created_at',
      ctx.request.input('sortOrder') ?? 'desc',
    ])

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
    let conditions

    if (isSuperUser) {
      conditions = (query: any) => {
        query.preload('user').preload('website')
      }
    } else {
      conditions = (query: any) => {
        query.preload('user').preload('website').where('websiteId', ctx.jwtUser?.websiteId)
      }
    }

    return await indexFn(thisModel, moduleName, ctx, select, searchFields, orderData, conditions)
  }

  async storeLogin(ctx: HttpContext) {
    const req = ctx.request.body()

    req.website_id = req.website_id || ctx.jwtUser?.websiteId
    req.user_id = req.user_id || ctx.jwtUser?.id

    return await storeFn(thisModel, cValidator, req)
  }

  async store(ctx: HttpContext) {
    const req = ctx.request.body()

    req.website_id = req.website_id || ctx.jwtUser?.websiteId
    req.user_id = req.user_id || ctx.jwtUser?.id

    return await storeFn(thisModel, cValidator, req)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const conditions = (query: any) => {
      query.preload('user').preload('website')
    }
    return await showFn(thisModel, id, [], conditions)
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    return await deleteFn(thisModel, moduleName, id, ctx)
  }
}
