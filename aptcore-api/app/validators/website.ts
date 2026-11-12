import vine from '@vinejs/vine'

import { uniqueRule } from '#rules/unique'

const table = 'websites'

export const cWebsiteValidator = vine.compile(
  vine.object({
    title: vine.string().minLength(3),
    domain: vine
      .string()
      .minLength(3)
      .use(uniqueRule({ table, column: 'domain' })),
    theme: vine.string().minLength(2).optional().nullable(),
    meta_title: vine.string().optional().nullable(),
    meta_description: vine.string().optional().nullable(),
    api_key: vine.string().optional().nullable(),
    active: vine.boolean().optional().nullable(),
    created_by: vine.string().optional().nullable(),
  })
)

export function uWebsiteValidator(else_id: string) {
  return vine.compile(
    vine.object({
      title: vine.string().minLength(3),
      domain: vine
        .string()
        .minLength(3)
        .use(uniqueRule({ table, column: 'domain', else_id })),
      theme: vine.string().minLength(2),
      meta_title: vine.string().optional().nullable(),
      meta_description: vine.string().optional().nullable(),
      api_key: vine.string().optional().nullable(),
      active: vine.boolean().optional().nullable(),
      created_by: vine.string().optional().nullable(),
    })
  )
}

export const updateLogoValidator = vine.compile(
  vine.object({
    logo: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'webp'],
      })
      .optional(),
  })
)

export const updateFaviconValidator = vine.compile(
  vine.object({
    favicon: vine
      .file({
        size: '1mb',
        extnames: ['jpg', 'png', 'jpeg'],
      })
      .optional(),
  })
)
