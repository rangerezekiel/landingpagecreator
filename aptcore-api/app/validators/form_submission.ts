import vine from '@vinejs/vine'

export const cFormSubmissionValidator = vine.compile(
  vine.object({
    website_id: vine.string(),
    name: vine.string().minLength(3),
    email: vine.string().email(),
    country_code: vine.string().nullable(),
    phone_code: vine.string().nullable(),
    phone_number: vine.string().nullable(),
    phone: vine.string().mobile(),
    message: vine.string().minLength(6),
    created_by: vine.string().optional().nullable(),
    read_by: vine.string().optional().nullable(),
    status: vine.enum(['SUBMITED', 'IN_PROGRESS', 'DONE', 'REJECTED']).optional().nullable(),
  })
)

export function uFormSubmissionValidator() {
  return vine.compile(
    vine.object({
      website_id: vine.string(),
      name: vine.string().minLength(3),
      email: vine.string().email(),
      country_code: vine.string().nullable(),
      phone_code: vine.string().nullable(),
      phone_number: vine.string().nullable(),
      phone: vine.string().mobile(),
      message: vine.string().minLength(6),
      created_by: vine.string().optional().nullable(),
      read_by: vine.string().optional().nullable(),
      status: vine.enum(['SUBMITED', 'IN_PROGRESS', 'DONE', 'REJECTED']).optional().nullable(),
    })
  )
}
