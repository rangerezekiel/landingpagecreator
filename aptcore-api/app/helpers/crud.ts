import type { LucidModel, LucidRow } from '@adonisjs/lucid/types/model'
import type { VineValidator } from '@vinejs/vine'
import { softQuery, softQueryFindOrFail } from '#helpers/soft_query'
import { getQueryOptions } from '#helpers/request'
import { applySearch } from '#helpers/query'
import { getCachedUser } from '#helpers/user_cache'
import { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'
import User from '#models/user'
import { Acl } from '@holoyan/adonisjs-permissions'

type SoftDeletableRow = LucidRow & {
  forceDelete(): Promise<void>
}

type SoftRestorableRow = LucidRow & {
  restore(): Promise<void>
}

// sort Helper Function
export function sortHFn(...rules: Array<[string, 'asc' | 'desc']>) {
  return rules
}

const invalidUser = { message: 'Invalid user' }

export async function isSuper(jWtId: string) {
  const user = await User.findOrFail(jWtId)
  return await Acl.model(user).hasAnyRole('superadmin', 'superdev')
}

export async function isSuperDev(jWtId: string) {
  const user = await User.findOrFail(jWtId)
  return await Acl.model(user).hasAnyRole('superdev')
}

export async function indexFn(
  thisModel: LucidModel,
  moduleName: string,
  ctx: any,
  select: string[],
  searchFields: string[],
  orderData: Array<[string, 'asc' | 'desc']> = [],
  conditions?: (query: ReturnType<typeof softQuery>) => void,
  orderRaw?: string[] // ✅ Tambahan optional
): Promise<SimplePaginatorContract<any>> {
  const { page, perPage, search, withTrashed, onlyTrashed, unreadOnly } = getQueryOptions(
    ctx.request
  )

  const query = softQuery(thisModel).select(select)

  if (orderRaw && orderRaw.length > 0) {
    for (const raw of orderRaw) {
      query.orderByRaw(raw)
    }
  }

  if (orderData.length > 0) {
    for (const [column, order] of orderData) {
      query.orderBy(column, order)
    }
  }

  applySearch(query, search, searchFields)

  const checkUser = (await getCachedUser(ctx.jwtUser?.id ?? '')) ?? null
  if (!checkUser) return ctx.response.forbidden(invalidUser)

  // Trashed
  const trashedMode = withTrashed
    ? `${moduleName}-index-with-trash`
    : onlyTrashed
      ? `${moduleName}-index-only-trash`
      : null

  if (trashedMode) {
    const hasPermission = await checkUser.hasPermission(trashedMode)
    if (!hasPermission) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }
    query[withTrashed ? 'withTrashed' : 'onlyTrashed']()
  }

  if (conditions) {
    conditions(query)
  }

  // Filter unread only based on read_at == NULL
  if (unreadOnly) {
    query.whereNull('read_at')
  }

  const data = await query.paginate(page, perPage)

  if (data.length === 0) {
    return ctx.response.status(404).json({ messages: 'No data found' })
  }

  return data
}

export async function storeFn(
  thisModel: LucidModel,
  validator: VineValidator<any, any>,
  request: Record<string, any>
): Promise<InstanceType<typeof thisModel>> {
  const payload = await validator.validate(request)
  const record = await thisModel.create(payload)
  return record
}

export async function showFn(
  thisModel: LucidModel,
  id: string,
  select: string[] = [],
  conditions?: (query: ReturnType<typeof softQuery>) => void
): Promise<InstanceType<typeof thisModel>> {
  const query = softQuery(thisModel).select(select)
  if (conditions) {
    conditions(query)
  }
  return await query.where('id', id).select(select).firstOrFail()
}

export async function deleteFn(
  thisModel: LucidModel,
  moduleName: string,
  id: string,
  ctx: any
): Promise<boolean> {
  const { permanent } = ctx.request.body()

  if (permanent) {
    const user = await getCachedUser(ctx.jwtUser?.id ?? '')
    if (!user) {
      return ctx.response.unauthorized(invalidUser)
    }

    const hasPermission = await user.hasPermission(`${moduleName}-delete-permanently`)
    if (!hasPermission) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }
  }

  const data = await (permanent ? softQueryFindOrFail(thisModel, id) : thisModel.findOrFail(id))

  await (permanent ? (data as SoftDeletableRow).forceDelete() : data.delete())

  return true
}

export async function updateFn(
  thisModel: LucidModel,
  moduleName: string,
  validator: Function,
  id: string,
  ctx: Record<string, any>,
  req: any
): Promise<InstanceType<typeof thisModel>> {
  const { restore } = ctx.request.body()
  const data = await (restore ? softQueryFindOrFail(thisModel, id) : thisModel.findOrFail(id))

  if (restore) {
    const user = await getCachedUser(ctx.jwtUser?.id ?? '')
    if (!user) {
      return ctx.response.unauthorized(invalidUser)
    }

    const hasPermission = await user.hasPermission(`${moduleName}-update-restore`)
    if (!hasPermission) {
      return ctx.response.forbidden({ message: 'You shall not pass' })
    }
    await (data as SoftRestorableRow).restore()
    return data
  }

  const updateValidator = validator(id)
  const payload = await updateValidator.validate(req)

  data.merge(payload)

  return await data.save()
}

export function hasWebsiteId(raw: unknown, targetId: string): boolean {
  if (!raw || !targetId) return false

  if (Array.isArray(raw)) {
    return raw.includes(targetId)
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.includes(targetId)
      return raw.trim() === targetId
    } catch {
      return raw.trim() === targetId
    }
  }

  return false
}
