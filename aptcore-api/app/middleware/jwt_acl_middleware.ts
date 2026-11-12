import jwt from 'jsonwebtoken'
import { AclManager, Scope } from '@holoyan/adonisjs-permissions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { getCachedUser } from '#helpers/user_cache'
import { JwtUserType } from '#type/jwt_user'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    user: import('#models/user').default
    acl: AclManager
  }
}

export default class JwtAclMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options?: { permission?: string }) {
    const scope = new Scope()
    ctx.acl = new AclManager(true).scope(scope)

    const token = ctx.request.header('authorization')?.replace('Bearer ', '')
    if (!token) return ctx.response.unauthorized({ message: 'Token not provided' })

    try {
      ctx.jwtUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtUserType
    } catch {
      return ctx.response.unauthorized({ message: 'Token invalid' })
    }

    // ✅ Ambil dari cache dulu
    const user = await getCachedUser(ctx.jwtUser.id)
    if (!user) return ctx.response.unauthorized({ message: 'User not found' })

    // Optional permission check
    if (options?.permission) {
      const hasPermission = await user.hasPermission(options.permission)
      if (!hasPermission) {
        return ctx.response.forbidden({ message: 'You shall not pass' })
      }
    }

    return await next()
  }
}
