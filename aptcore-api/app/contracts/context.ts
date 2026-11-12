import { JwtUserType } from '#type/jwt_user'

declare module '@adonisjs/core/http' {
  interface HttpContext {
    jwtUser?: JwtUserType
  }
}
