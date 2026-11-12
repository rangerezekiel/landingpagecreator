import vine from '@vinejs/vine'

export const activityLogValidator = vine.compile(
  vine.object({
    website_id: vine.string().uuid().optional(),
    user_id: vine.string().uuid().optional(),
    action: vine.string().minLength(3),
    module: vine.string().minLength(2),
    note: vine.string().optional(),
    status: vine.enum(['SUCCESS', 'FAILED']).optional(),
    ip_address: vine.string(),
    user_agent: vine.string(),
    url: vine.string().optional(),
    method: vine.string().minLength(3).optional(),
    payload: vine.any().optional(),
  })
)
