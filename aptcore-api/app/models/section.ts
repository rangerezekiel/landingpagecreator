import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { randomUUID } from 'node:crypto'
import SectionDetail from './section_detail.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Section extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(section: Section) {
    section.id = randomUUID()
  }

  @column()
  declare websiteId: string

  @column()
  declare key: string

  @column()
  declare title: string | null

  @column()
  declare sortOrder: number

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

  @hasMany(() => SectionDetail)
  declare details: HasMany<typeof SectionDetail>
}
