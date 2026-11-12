import type { HttpContext } from '@adonisjs/core/http'
import { Permission } from '@holoyan/adonisjs-permissions'
import {
  cPermissionValidator as cValidator,
  uPermissionValidator as uValidator,
} from '#validators/permission'
import { sortHFn, indexFn, storeFn, showFn, updateFn, deleteFn } from '#helpers/crud'

const thisModel = Permission
const moduleName = 'permission'

export default class PermissionsController {
  async index(ctx: HttpContext) {
    const select = ['id', 'slug', 'title']
    const searchFields = ['slug', 'title']
    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'slug',
      ctx.request.input('sortOrder') ?? 'asc',
    ])

    return await indexFn(thisModel, moduleName, ctx, select, searchFields, orderData)
  }

  async store(ctx: HttpContext) {
    const req = ctx.request.body()

    return await storeFn(thisModel, cValidator, req)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id

    return await showFn(thisModel, id)
  }

  async update(ctx: HttpContext) {
    const req = ctx.request.body()
    const id = ctx.params.id

    return await updateFn(thisModel, moduleName, uValidator, id, ctx, req)
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id

    return await deleteFn(thisModel, moduleName, id, ctx)
  }
}
