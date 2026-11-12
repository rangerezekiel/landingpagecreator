import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { randomUUID } from 'node:crypto'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import SectionDetailItem from './section_detail_item.js'

export default class SectionDetail extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(sectionDetail: SectionDetail) {
    sectionDetail.id = randomUUID()
  }

  @column()
  declare sectionId: string

  @column()
  declare key: string

  @column()
  declare label: string | null

  @column()
  declare type: string | null

  @column()
  declare value: string | null

  @column()
  declare jsonValue: Record<string, any> | null | string

  public static casts = {
    jsonValue: 'jsonb',
  }

  @column()
  declare sortOrder: number | null

  @column()
  declare active: boolean

  @column()
  declare createdBy: string | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => SectionDetailItem)
  declare items: HasMany<typeof SectionDetailItem>
}
