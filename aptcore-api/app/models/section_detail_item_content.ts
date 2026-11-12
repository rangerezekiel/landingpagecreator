import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { randomUUID } from 'node:crypto'

export default class SectionDetailItemContent extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(sectionDetailItemContent: SectionDetailItemContent) {
    sectionDetailItemContent.id = randomUUID()
  }

  @column()
  declare sectionDetailItemId: string

  @column()
  declare key: string

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
}
