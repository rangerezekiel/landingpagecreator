import type { HttpContext } from '@adonisjs/core/http'

export default class ApiKeyMiddleware {
  async handle(ctx: HttpContext, next: () => Promise<void>) {
    const apiKey = ctx.request.header('x-api-key')
    const validKey = process.env.API_KEY

    if (!apiKey || apiKey !== validKey) {
      return ctx.response.unauthorized({
        message: 'Invalid or missing API key',
      })
    }

    await next()
  }
}
