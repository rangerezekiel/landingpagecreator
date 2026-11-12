import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import Section from '#models/section'
import Website from '#models/website'
import * as SectionHandlers from '#handlers/section_handlers/index'
import { indexFn, sortHFn } from '#helpers/crud'

const thisModel = Section
const moduleName = 'section'

/**
 * Detail keys that must never reach the public landing page. `index` is served
 * to unauthenticated visitors, so these are only included for a signed-in
 * backside user editing the config.
 */
const SECRET_DETAIL_KEYS = ['PRIVYR_WEBHOOK_URL']

/**
 * `index` is a public route, so there is no jwtAcl middleware to populate
 * ctx.jwtUser. Verify the token by hand to tell a backside reader apart from a
 * public visitor. An invalid or absent token is simply treated as public.
 */
function isAuthenticatedReader(ctx: HttpContext): boolean {
  const token = ctx.request.header('authorization')?.replace('Bearer ', '')
  if (!token) return false

  try {
    jwt.verify(token, process.env.JWT_SECRET!)
    return true
  } catch {
    return false
  }
}
export default class SectionsController {
  async index(ctx: HttpContext) {
    const qDomain = ctx.params.domain
    const qSection = ctx.params.section

    const website = await Website.query()
      // .where('active', true)
      .where('domain', qDomain)
      .select(['id'])
      .firstOrFail()

    const section = await Section.query()
      .select(['id', 'key', 'title', 'active'])
      .where('websiteId', website.id)
      .where('key', qSection)
      .preload('details', (detail) => {
        detail
          .select('id', 'key', 'label', 'type', 'value', 'jsonValue')
          .orderBy('sortOrder')
          .preload('items', (item) => {
            item
              .select('id', 'sectionDetailId', 'sortOrder')
              .orderBy('sortOrder')
              .preload('contents', (content) => {
                content
                  .select('id', 'sectionDetailItemId', 'key', 'type', 'value', 'jsonValue')
                  .orderBy('sortOrder')
              })
          })
      })
      .firstOrFail()

    const serialized = section.serialize()

    // transform item.contents => object by key
    serialized.details.forEach((detail: any) => {
      detail.items.forEach((item: any) => {
        item.contents = Object.fromEntries(item.contents.map((c: { key: any }) => [c.key, c]))
      })
    })

    const details = Object.fromEntries(
      serialized.details.map((detail: any) => [detail.key, detail])
    )

    if (!isAuthenticatedReader(ctx)) {
      for (const key of SECRET_DETAIL_KEYS) {
        delete details[key]
      }
    }

    return {
      ...serialized,
      details,
    }
  }

  async delete(ctx: HttpContext) {
    const sectionKey = ctx.params.section

    const handler = (SectionHandlers as any)[sectionKey]
    if (handler?.destroy) {
      return handler.destroy(ctx)
    }

    return ctx.response.badRequest({ message: `Section '${sectionKey}' is not deletable.` })
  }

  async store(ctx: HttpContext) {
    const sectionKey = ctx.params.section
    const handler = (SectionHandlers as Record<string, any>)[sectionKey]

    if (handler?.store) {
      return handler.store(ctx)
    }

    return ctx.response.badRequest({ message: `Section '${sectionKey}' is not handled.` })
  }

  async show(ctx: HttpContext) {
    const sectionKey = ctx.params.section as keyof typeof SectionHandlers
    const handler = SectionHandlers[sectionKey]

    if ('show' in handler && typeof handler.show === 'function') {
      return handler.show(ctx)
    }

    return ctx.response.badRequest({
      message: `Section '${sectionKey}' is not handled for show`,
    })
  }

  async update(ctx: HttpContext) {
    const sectionKey = ctx.params.section
    const handler = (SectionHandlers as any)[sectionKey]

    if (handler?.update) {
      return handler.update(ctx)
    }

    return ctx.response.badRequest({
      message: `Section '${sectionKey}' is not handled for update`,
    })
  }

  async listIndex(ctx: HttpContext) {
    const qDomain = ctx.params.domain
    const viewActive = ctx.request.qs().viewActive

    const website = await Website.query()
      .where('active', true)
      .where('domain', qDomain)
      .select(['id'])
      .firstOrFail()
    const select = ['id', 'key', 'title', 'active']
    const searchFields = ['key', 'title']
    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'key',
      ctx.request.input('sortOrder') ?? 'asc',
    ])

    if (!ctx.jwtUser) {
      return ctx.response.unauthorized()
    }

    const conditions = (query: any) => {
      query.where('website_id', website.id)
    }

    const paginated = await indexFn(
      thisModel,
      moduleName,
      ctx,
      select,
      searchFields,
      orderData,
      conditions
    )

    if (viewActive) {
      const result = paginated.toJSON().data.reduce((acc, item) => {
        acc[item.key] = item.active
        return acc
      }, {})
      return result
    }

    return paginated
  }

  async activeSection(ctx: HttpContext) {
    const qDomain = ctx.params.domain
    const qSection = ctx.params.section
    const iActive = ctx.request.input('active')

    const website = await Website.query()
      .where('active', true)
      .where('domain', qDomain)
      .select(['id'])
      .firstOrFail()

    const section = await Section.query()
      .where('websiteId', website.id)
      .where('key', qSection)
      .firstOrFail()
    section.active = iActive
    await section.save()

    return section
  }
}
