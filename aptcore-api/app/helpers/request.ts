import { HttpContext } from '@adonisjs/core/http'

export function getQueryOptions(request: HttpContext['request']) {
  const {
    page = 1,
    perPage = 40,
    search = null,
    withTrashed = 'false',
    onlyTrashed = 'false',
    unreadOnly = 'false',
  } = request.qs()

  return {
    page: Number(page),
    perPage: Number(perPage),
    search,
    withTrashed: withTrashed === 'true',
    onlyTrashed: onlyTrashed === 'true',
    unreadOnly: unreadOnly === 'true',
  }
}
