import type { HttpContext } from '@adonisjs/core/http'
import { Role } from '@holoyan/adonisjs-permissions'
import { cRoleValidator as cValidator, uRoleValidator as uValidator } from '#validators/role'
import { sortHFn, indexFn, storeFn, showFn, updateFn, deleteFn, isSuperDev } from '#helpers/crud'
import { Acl } from '@holoyan/adonisjs-permissions'

const thisModel = Role
const moduleName = 'role'

export default class RolesController {
  async index(ctx: HttpContext) {
    const select = ['id', 'slug', 'title']
    const searchFields = ['slug', 'title']
    const orderData = sortHFn([
      ctx.request.input('sortBy') ?? 'slug',
      ctx.request.input('sortOrder') ?? 'asc',
    ])

    const isSuperDevUser = ctx.jwtUser ? await isSuperDev(ctx.jwtUser.id) : false
    let conditions
    if (!isSuperDevUser) {
      conditions = (query: any) => {
        query.where('slug', '!=', 'superdev')
      }
    }
    return await indexFn(thisModel, moduleName, ctx, select, searchFields, orderData, conditions)
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

  async rolePermissions(ctx: HttpContext) {
    const { id } = ctx.params

    const role = await thisModel.findOrFail(id)
    const permissionRequest: string[] = ctx.request.body().permissions

    const permissions = await Acl.role(role).sync(permissionRequest)
    const data = {
      role,
      permissions,
    }

    return data
  }

  async getRolePermissions(ctx: HttpContext) {
    const { id } = ctx.params

    const role = await thisModel.findOrFail(id)

    const permissions = await Acl.role(role)
      .permissions()
      .then((permission) => permission.map((p) => p.slug))

    return permissions
  }

  async getAllRolesWithPermissions() {
    const roles = await Role.query().select('slug').exec()

    const result: Record<string, Record<string, string[]>> = {}

    await Promise.all(
      roles.map(async (role) => {
        const permissions = await Acl.role(role).permissions()

        const sortedPermissions = permissions.sort((a, b) => a.slug.localeCompare(b.slug))

        const grouped: Record<string, string[]> = {}

        sortedPermissions.forEach((p) => {
          const [prefix] = p.slug.split('-')
          if (!grouped[prefix]) {
            grouped[prefix] = []
          }
          grouped[prefix].push(p.title!)
        })

        result[role.slug] = grouped
      })
    )

    // Sort role slug ASC di hasil akhir
    const sortedResult: Record<string, Record<string, string[]>> = {}
    Object.keys(result)
      .sort((a, b) => a.localeCompare(b))
      .forEach((key) => {
        sortedResult[key] = result[key]
      })

    return sortedResult
  }
}
