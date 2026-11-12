export function applySearch<T extends any>(query: any, search: string | null, fields: string[]): T {
  if (!search) return query

  const like = `%${search}%`

  if (typeof query.where !== 'function') {
    throw new Error('applySearch: query does not support where()')
  }

  query.where((q: any) => {
    fields.forEach((field) => {
      q.orWhereILike(field, like)
    })
  })

  return query
}
