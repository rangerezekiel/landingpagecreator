import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import { DateTime } from 'luxon'
import { Acl } from '@holoyan/adonisjs-permissions'

export default class AuthController {
  async login(ctx: HttpContext) {
    const { username, email, password } = ctx.request.only(['username', 'email', 'password'])

    try {
      const user = await User.query()
        .where((q) => {
          q.where('email', email).orWhere('username', username)
        })
        .firstOrFail()

      if (await hash.verify(user.password, password)) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            username: user.username,
            fullName: user.fullName,
            websiteId: user.websiteId,
          },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        )

        // update last login
        const now = DateTime.local()
        await User.query()
          .where('id', user.id)
          .update({ lastLogin: now.toSQL({ includeOffset: false })! })

        user.lastLogin = now
        const roles = await Acl.model(user)
          .roles()
          .then((role) => role.map((r) => r.slug))
        const permissions = await Acl.model(user)
          .permissions()
          .then((permission) => permission.map((p) => p.slug))

        return { token, user, roles, permissions }
      } else {
        return ctx.response.unauthorized({ message: 'Wrong password' })
      }
    } catch (error) {
      return ctx.response.unauthorized({ message: 'User not found' })
    }
  }

  async me(ctx: HttpContext) {
    if (!ctx.jwtUser) {
      return ctx.response.unauthorized()
    }

    const user = await User.query().where('id', ctx.jwtUser.id).preload('website').firstOrFail()

    const countryPhoneCode = user.countryCode + '-' + user.phoneCode
    const userData = {
      ...(user.toJSON?.() ?? user),
      countryPhoneCode,
    }

    const roles = await Acl.model(user)
      .roles()
      .then((r) => r.map((ra) => ra.slug))
    const permissions = await Acl.model(user)
      .permissions()
      .then((p) => p.map((pa) => pa.slug))

    // 🕒 Buat token baru dengan expiry baru
    const newToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        websiteId: user.websiteId,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' } // reset setiap kali hit /auth/me
    )

    // 🚀 Return juga expiry-nya agar bisa ditampilkan di frontend
    const decoded = jwt.decode(newToken) as { exp: number }
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : null

    return {
      user: userData,
      roles,
      permissions,
      token: newToken,
      expiresAt,
    }
  }
}
