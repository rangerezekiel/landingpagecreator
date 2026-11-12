/* eslint-disable prettier/prettier */
import type { HttpContext } from '@adonisjs/core/http'
import WebsiteSetting from '#models/website_setting'
import Website from '#models/website'
import {
  cWebsiteSettingValidator as cValidator,
  uWebsiteSettingValidator as uValidator,
} from '#validators/website_setting'
import { sortHFn, indexFn, storeFn, showFn, updateFn, deleteFn, isSuper, hasWebsiteId } from '#helpers/crud'
import { softQuery } from '#helpers/soft_query'

const thisModel = WebsiteSetting
const moduleName = 'website_setting'

export default class WebsiteSettingsController {
  async index(ctx: HttpContext) {
    const select = ['id', 'key', 'value']
    const searchFields = ['key', 'value']
    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'key',
      ctx.request.input('sortOrder') ?? 'asc',
    ])

    if (!ctx.jwtUser) {
      return ctx.response.unauthorized()
    }
    const isSuperUser = await isSuper(ctx.jwtUser.id)
    const conditions = isSuperUser
      ? undefined
      : (query: any) => {
          query.where('active', true).where('id', ctx.jwtUser?.websiteId)
        }

    return await indexFn(thisModel, moduleName, ctx, select, searchFields, orderData, conditions)
  }

  async store(ctx: HttpContext) {
    const req = ctx.request.body()

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
    if (!isSuperUser) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }

    return await storeFn(thisModel, cValidator, req)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
    const conditions = isSuperUser
      ? undefined
      : (query: any) => {
          query.where('active', true).where('id', ctx.jwtUser?.websiteId)
        }

    return await showFn(thisModel, id, [], conditions)
  }

  async update(ctx: HttpContext) {
    const req = ctx.request.body()
    const id = ctx.params.id

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false

    if (!isSuperUser && !hasWebsiteId(ctx.jwtUser?.websiteId, id)) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }

    return await updateFn(thisModel, moduleName, uValidator, id, ctx, req)
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false

    if (!isSuperUser && !hasWebsiteId(ctx.jwtUser?.websiteId, id)) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }
    return await deleteFn(thisModel, moduleName, id, ctx)
  }

  async keys(ctx: HttpContext) {
    const domain = ctx.params.domain
    const select = ['key', 'value']

    const website = await Website
      .query()
      .where('active', true)
      .where('domain', domain)
      .select(['id'])
      .firstOrFail()

    const query = await softQuery(thisModel).where('website_id', website.id).select(select)

    if (query.length === 0) {
      return ctx.response.status(404).json({
        messages: 'No data found',
      })
    }

    const keys = query.reduce(
      (acc, item) => {
        if (item.key !== null) {
          acc[item.key ?? ''] = item.value
        }
        return acc
      },
      {} as Record<string, string | null>
    )

    return keys
  }

  async keysUpdate(ctx: HttpContext) {
    const domain = ctx.params.domain

    const website = await Website
      .query()
      .where('active', true)
      .where('domain', domain)
      .select(['id'])
      .firstOrFail()

    const websiteId = website.id
    
    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
    if (!isSuperUser && !hasWebsiteId(ctx.jwtUser?.websiteId, websiteId)) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }

    const payload = ctx.request.body() as Record<string, string>


    const existingSettings = await WebsiteSetting
      .query()
      .where('website_id', websiteId)

    const existingMap = new Map(
      existingSettings.map(setting => [setting.key, setting])
    )

    const updates = Object.entries(payload).map(async ([key, value]) => {
      const setting = existingMap.get(key)
      if (setting) {
        setting.value = value
        return setting.save()
      // } else { ARCHIVE
      //   // Insert if not yet
      //   return WebsiteSetting.create({
      //     websiteId,
      //     key,
      //     value,
      //   })
      }
    })

    await Promise.all(updates)

    return ctx.response.ok({
      message: 'Website settings updated successfully',
    })
  }
}
