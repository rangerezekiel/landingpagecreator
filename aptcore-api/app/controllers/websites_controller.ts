import type { HttpContext } from '@adonisjs/core/http'
import Website from '#models/website'
import User from '#models/user'
import {
  cWebsiteValidator as cValidator,
  updateFaviconValidator,
  updateLogoValidator,
  uWebsiteValidator as uValidator,
} from '#validators/website'
import { sortHFn, indexFn, storeFn, showFn, updateFn, deleteFn, isSuper } from '#helpers/crud'
import { createSections, createWebsiteSettings } from '#helpers/sections'
import { uploadFile } from '#helpers/upload_file'

const thisModel = Website
const moduleName = 'website'

export default class WebsitesController {
  async index(ctx: HttpContext) {
    const select = ['id', 'domain', 'title', 'logo', 'active', 'theme', 'deleted_at']
    const searchFields = ['domain', 'title', 'active']
    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'domain',
      ctx.request.input('sortOrder') ?? 'asc',
    ])

    if (!ctx.jwtUser) {
      return ctx.response.unauthorized()
    }

    const isSuperUser = await isSuper(ctx.jwtUser.id)

    // Always fetch fresh websiteId from database for real-time data
    let freshWebsiteIds: string[] = []
    if (!isSuperUser) {
      const user = await User.find(ctx.jwtUser!.id)
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
    }

    const conditions = isSuperUser
      ? undefined
      : (query: any) => {
          // query.where('active', true)
          // Include websites created by the current user as fallback access
          query.where((q: any) => {
            if (freshWebsiteIds.length > 0) {
              q.whereIn('id', freshWebsiteIds).orWhere('createdBy', ctx.jwtUser!.id)
            } else {
              q.where('createdBy', ctx.jwtUser!.id)
            }
          })
        }

    return await indexFn(thisModel, moduleName, ctx, select, searchFields, orderData, conditions)
  }

  async store(ctx: HttpContext) {
    const req = ctx.request.body()

    // Check permission instead of role - admin role also has website-store permission
    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
    if (!isSuperUser) {
      // For non-super users, check if they have website-store permission
      const user = await User.findOrFail(ctx.jwtUser!.id)
      const hasPermission = await user.hasPermission('website-store')
      if (!hasPermission) {
        return ctx.response.forbidden({ message: 'You shall not pass' })
      }
    }

    const website = (await storeFn(thisModel, cValidator, req)) as Website

    // Robust optional file handling: only process if actual file is sent
    const logoFile = ctx.request.file('logo')
    if (logoFile) {
      const logoPath = await uploadFile(logoFile, {
        moduleName: moduleName + '/LOGO',
        previousPath: null,
      })
      await website.merge({ logo: logoPath as string }).save()
    }

    const faviconFile = ctx.request.file('favicon')
    if (faviconFile) {
      const faviconPath = await uploadFile(faviconFile, {
        moduleName: moduleName + '/FAVICON',
        previousPath: null,
      })
      await website.merge({ favicon: faviconPath as string }).save()
    }

    await createWebsiteSettings(website.id)
    await createSections(website.id, ctx.jwtUser!.id)

    // Append new website ID to creator's websiteId (safely, with length check)
    if (ctx.jwtUser?.id) {
      const creator = await User.find(ctx.jwtUser.id)
      if (creator) {
        const current = creator.websiteId
        let websiteIds: string[] = []

        // Parse existing websiteId (JSON array or single string)
        if (Array.isArray(current as unknown as any)) {
          websiteIds = current as unknown as string[]
        } else if (typeof current === 'string' && current) {
          const t = current.trim()
          if (t.startsWith('[')) {
            try {
              const parsed = JSON.parse(t)
              websiteIds = Array.isArray(parsed) ? parsed : t ? [t] : []
            } catch {
              websiteIds = t ? [t] : []
            }
          } else {
            websiteIds = t ? [t] : []
          }
        }

        // Add new website ID if not already present
        if (!websiteIds.includes(website.id)) {
          websiteIds.push(website.id)

          await creator.merge({ websiteId: JSON.stringify(websiteIds) }).save()
        }
      }
    }

    return website
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false

    if (!isSuperUser) {
      // Always fetch fresh websiteId from database for real-time data
      let freshWebsiteIds: string[] = []
      const user = await User.find(ctx.jwtUser!.id)
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

      // Check if user has access to this website
      if (!freshWebsiteIds.includes(id)) {
        // allow if this user created the website
        const owned = await Website.query()
          .where('id', id)
          .andWhere('createdBy', ctx.jwtUser!.id)
          .first()
        if (!owned) {
          return ctx.response.forbidden({ message: 'You shall not pass' })
        }
      }
    }

    return await showFn(thisModel, id, [], undefined)
  }

  async showDomain(ctx: HttpContext) {
    const domain = ctx.params.domain
    const select: string[] = [
      'id',
      'title',
      'domain',
      'theme',
      'favicon',
      'logo',
      'metaTitle',
      'metaDescription',
      'active',
    ]

    return await thisModel.query().where('domain', domain).select(select).firstOrFail()
  }

  async domain(ctx: HttpContext) {
    const domain = ctx.params.domain
    const select = [
      'id',
      'domain',
      'title',
      'theme',
      'favicon',
      'logo',
      'metaTitle',
      'metaDescription',
    ]

    return await thisModel
      .query()
      .where('active', true)
      .where('domain', domain)
      .select(select)
      .firstOrFail()
  }

  async update(ctx: HttpContext) {
    const req = ctx.request.body()
    const id = ctx.params.id

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false

    if (!isSuperUser) {
      // Always fetch fresh websiteId from database for real-time data
      let freshWebsiteIds: string[] = []
      const user = await User.find(ctx.jwtUser!.id)
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

      if (!freshWebsiteIds.includes(id)) {
        // allow if this user created the website
        const owned = await Website.query()
          .where('id', id)
          .andWhere('createdBy', ctx.jwtUser!.id)
          .first()
        if (!owned) {
          return ctx.response.forbidden({ message: 'You shall not pass' })
        }
      }
    }

    const website = await updateFn(thisModel, moduleName, uValidator, id, ctx, req)
    const { logo } = await ctx.request.validateUsing(updateLogoValidator)
    if (logo) {
      const logoPath = await uploadFile(logo, {
        moduleName: moduleName + '/LOGO',
        previousPath: website.$original.logo,
      })

      await website.merge({ logo: logoPath as string }).save()
    }

    const { favicon } = await ctx.request.validateUsing(updateFaviconValidator)
    if (favicon) {
      const faviconPath = await uploadFile(favicon, {
        moduleName: moduleName + '/FAVICON',
        previousPath: website.$original.favicon,
      })

      await website.merge({ favicon: faviconPath as string }).save()
    }

    return website
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false

    if (!isSuperUser) {
      // Always fetch fresh websiteId from database for real-time data
      let freshWebsiteIds: string[] = []
      const user = await User.find(ctx.jwtUser!.id)
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

      if (!freshWebsiteIds.includes(id)) {
        // allow if this user created the website
        const owned = await Website.query()
          .where('id', id)
          .andWhere('createdBy', ctx.jwtUser!.id)
          .first()
        if (!owned) {
          return ctx.response.forbidden({ message: 'You shall not pass' })
        }
      }
    }
    return await deleteFn(thisModel, moduleName, id, ctx)
  }
}
