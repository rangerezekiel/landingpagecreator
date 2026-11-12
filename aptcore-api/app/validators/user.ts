import vine from '@vinejs/vine'
import { uniqueRule } from '#rules/unique'

const table = 'users'

export const cUserValidator = vine.compile(
  vine.object({
    username: vine
      .string()
      .minLength(3)
      .use(uniqueRule({ table, column: 'username' })),
    email: vine
      .string()
      .email()
      .use(uniqueRule({ table, column: 'email' })),
    password: vine.string().minLength(8).maxLength(32).confirmed(),
    full_name: vine.string().minLength(3),
    country_code: vine.string().nullable(),
    phone_code: vine.string().nullable(),
    phone_number: vine.string().nullable(),
    website_id: vine.string().optional().nullable(),
    phone: vine
      .string()
      .mobile()
      .use(uniqueRule({ table, column: 'phone' })),
    avatar: vine.string().optional().nullable(),
  })
)

export function uUserValidator(else_id: string) {
  return vine.compile(
    vine.object({
      username: vine
        .string()
        .minLength(3)
        .use(uniqueRule({ table, column: 'username', else_id })),
      email: vine
        .string()
        .email()
        .use(uniqueRule({ table, column: 'email', else_id })),
      password: vine.string().minLength(8).maxLength(32).confirmed().optional().nullable(),
      full_name: vine.string().minLength(3),
      country_code: vine.string().nullable(),
      phone_code: vine.string().nullable(),
      phone_number: vine.string().nullable(),
      website_id: vine.string().optional().nullable(),
      phone: vine
        .string()
        .use(uniqueRule({ table, column: 'phone', else_id }))
        .mobile(),
      avatar: vine.string().optional().nullable(),
    })
  )
}

export const rolesValidator = vine.compile(
  vine.object({
    roles: vine.array(vine.string()),
  })
)

export const updateAvatarValidator = vine.compile(
  vine.object({
    avatar: vine
      .file({
        size: '2mb',
        extnames: ['jpg', 'png', 'webp'],
      })
      .optional(),
  })
)
