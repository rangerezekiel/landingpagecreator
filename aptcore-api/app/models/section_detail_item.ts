import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { randomUUID } from 'node:crypto'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import SectionDetailItemContent from './section_detail_item_content.js'

export default class SectionDetailItem extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(sectionDetailItem: SectionDetailItem) {
    sectionDetailItem.id = randomUUID()
  }

  @column()
  declare sectionDetailId: string

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

  @hasMany(() => SectionDetailItemContent)
  declare contents: HasMany<typeof SectionDetailItemContent>
}
