import type { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export interface SoftDeletesQueryBuilder<Model extends LucidModel, Result = InstanceType<Model>>
  extends ModelQueryBuilderContract<Model, Result> {
  withTrashed(): this
  onlyTrashed(): this
  restore(): Promise<number>
}
