import vine from '@vinejs/vine'

export const cWebsiteSettingValidator = vine.compile(
  vine.object({
    key: vine.string().minLength(2),
    value: vine.string().nullable(),
    website_id: vine.string(),
  })
)

export function uWebsiteSettingValidator() {
  return vine.compile(
    vine.object({
      key: vine.string().minLength(2),
      value: vine.string().nullable(),
      website_id: vine.string(),
    })
  )
}
