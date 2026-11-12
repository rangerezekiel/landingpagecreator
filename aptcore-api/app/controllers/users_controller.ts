import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {
  cUserValidator as cValidator,
  uUserValidator as uValidator,
  rolesValidator,
  updateAvatarValidator,
} from '#validators/user'
import {
  sortHFn,
  indexFn,
  storeFn,
  showFn,
  updateFn,
  deleteFn,
  isSuper,
  isSuperDev,
} from '#helpers/crud'
import { Acl } from '@holoyan/adonisjs-permissions'
import { uploadFile } from '#helpers/upload_file'

const thisModel = User
const moduleName = 'user'

export default class UsersController {
  async index(ctx: HttpContext) {
    const select = [
      'id',
      'websiteId',
      'fullName',
      'email',
      'username',
      'phone',
      'avatar',
      'deletedAt',
      'createdAt',
      'updatedAt',
    ]

    const searchFields = ['fullName', 'email', 'username']

    const orderData = sortHFn([
      ctx.request.input('fullName') ?? 'fullName',
      ctx.request.input('sortOrder') ?? 'asc',
    ])

    const isSuperDevUser = ctx.jwtUser ? await isSuperDev(ctx.jwtUser.id) : false
    let conditions

    if (isSuperDevUser) {
      conditions = (query: any) => {
        query.preload('website')
      }
    } else {
      const isSuperUser = ctx.jwtUser ? await isSuper(ctx.jwtUser.id) : false
      conditions = isSuperUser
        ? (query: any) => {
            query.preload('website').where('username', '!=', 'superdev')
          }
        : (query: any) => {
            query.where('websiteId', ctx.jwtUser?.websiteId).preload('website')
          }
    }
    const paginatedUsers = await indexFn(
      User,
      'user',
      ctx,
      select,
      searchFields,
      orderData,
      conditions
    )

    const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
    select.push('website')
    const modifiedUsers = await Promise.all(
      paginatedUsers.all().map(async (user) => {
        const roles = await user.roles()

        const base = Object.fromEntries(select.map((key) => [key, user[snakeToCamel(key)]]))

        // Convert websiteId string -> array for response compatibility
        let websiteParsed: string[] = []
        const websiteVal = (base as any).websiteId
        if (Array.isArray(websiteVal)) {
          websiteParsed = websiteVal
        } else if (typeof websiteVal === 'string') {
          const trimmed = websiteVal.trim()
          if (trimmed.startsWith('[')) {
            try {
              const parsed = JSON.parse(trimmed)
              websiteParsed = Array.isArray(parsed) ? parsed : websiteVal ? [websiteVal] : []
            } catch {
              websiteParsed = websiteVal ? [websiteVal] : []
            }
          } else {
            websiteParsed = websiteVal ? [websiteVal] : []
          }
        }

        return {
          ...base,
          websiteId: websiteParsed,
          roles: roles.map((r: { title: string }) => r.title),
        }
      })
    )

    const { meta } = paginatedUsers.toJSON()

    return {
      meta,
      data: modifiedUsers,
    }
  }

  async store(ctx: HttpContext) {
    const raw = ctx.request.body()

    // Normalize website input: accept array and store as JSON string to fit existing column
    const websiteInput =
      (raw as any).website_ids ?? (raw as any).websiteId ?? (raw as any).website_id
    if (Array.isArray(websiteInput)) {
      raw.website_id = JSON.stringify(websiteInput)
    }

    raw.phone = (raw.phone_code ?? '') + (raw.phone_number ?? '')

    const { roles } = await rolesValidator.validate(raw)
    const { avatar } = await ctx.request.validateUsing(updateAvatarValidator)
    raw.avatar = null

    const user = (await storeFn(thisModel, cValidator, raw)) as User

    if (avatar) {
      const avatarPath = await uploadFile(avatar, {
        moduleName,
        previousPath: null,
      })

      await user.merge({ avatar: avatarPath }).save()
    }

    await Acl.model(user as User).syncRoles(roles)

    const roleSlugs = await Acl.model(user as User)
      .roles()
      .then((role) => role.map((r) => r.slug))

    return {
      ...(user.toJSON?.() ?? user),
      roles: roleSlugs,
    }
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    const conditions = (query: any) => {
      query.preload('website')
    }

    const user = (await showFn(thisModel, id, [], conditions)) as User

    const roleSlugs = await Acl.model(user as User)
      .roles()
      .then((role) => role.map((r) => r.slug))

    const countryPhoneCode = user.countryCode + '-' + user.phoneCode

    const data = user.toJSON?.() ?? user

    // Convert websiteId string -> array for response
    let websiteParsed: string[] = []
    const websiteVal = (data as any).websiteId
    if (Array.isArray(websiteVal)) {
      websiteParsed = websiteVal
    } else if (typeof websiteVal === 'string') {
      const trimmed = websiteVal.trim()
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed)
          websiteParsed = Array.isArray(parsed) ? parsed : websiteVal ? [websiteVal] : []
        } catch {
          websiteParsed = websiteVal ? [websiteVal] : []
        }
      } else {
        websiteParsed = websiteVal ? [websiteVal] : []
      }
    }

    return {
      ...data,
      websiteId: websiteParsed,
      roles: roleSlugs,
      countryPhoneCode,
    }
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const raw = ctx.request.body()

    // Normalize website input: accept array and store as JSON string to fit existing column
    const websiteInput =
      (raw as any).website_ids ?? (raw as any).websiteId ?? (raw as any).website_id
    if (Array.isArray(websiteInput)) {
      raw.website_id = JSON.stringify(websiteInput)
    }

    const { avatar } = await ctx.request.validateUsing(updateAvatarValidator)
    if (avatar) {
      const user = await User.findOrFail(ctx.params.id)
      raw.avatar = await uploadFile(avatar, {
        moduleName,
        previousPath: user.avatar,
      })
    }

    raw.phone = (raw.phone_code ?? '') + (raw.phone_number ?? '')

    let user

    if (raw.roles) {
      const { roles } = await rolesValidator.validate(raw)
      user = await updateFn(thisModel, moduleName, uValidator, id, ctx, raw)
      await Acl.model(user as User).syncRoles(roles)
    } else {
      user = await updateFn(thisModel, moduleName, uValidator, id, ctx, raw)
    }

    const roleSlugs = await Acl.model(user as User)
      .roles()
      .then((r) => r.map((item) => item.slug))

    return {
      ...(user.toJSON?.() ?? user),
      roles: roleSlugs,
    }
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    return await deleteFn(thisModel, moduleName, id, ctx)
  }
}
