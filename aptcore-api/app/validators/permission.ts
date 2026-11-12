import vine from '@vinejs/vine'
import { uniqueRule } from '#rules/unique'

const table = 'permissions'

export const cPermissionValidator = vine.compile(
  vine.object({
    slug: vine
      .string()
      .minLength(3)
      .use(uniqueRule({ table, column: 'slug' })),
    title: vine
      .string()
      .minLength(3)
      .use(uniqueRule({ table, column: 'title' })),
  })
)

export function uPermissionValidator(else_id: string) {
  return vine.compile(
    vine.object({
      slug: vine
        .string()
        .minLength(3)
        .use(uniqueRule({ table, column: 'slug', else_id })),
      title: vine
        .string()
        .minLength(3)
        .use(uniqueRule({ table, column: 'title', else_id })),
    })
  )
}
