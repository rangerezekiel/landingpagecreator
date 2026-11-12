import { LucidModel } from '@adonisjs/lucid/types/model'
import type { SoftDeletesQueryBuilder } from '#contracts/lucid_soft_deletes'

export function softQuery<Model extends LucidModel>(model: Model): SoftDeletesQueryBuilder<Model> {
  return model.query() as SoftDeletesQueryBuilder<Model>
}

export async function softQueryFindOrFail<Model extends LucidModel>(
  model: Model,
  id: string
): Promise<InstanceType<Model>> {
  return softQuery(model).onlyTrashed().where('id', id).firstOrFail()
}
