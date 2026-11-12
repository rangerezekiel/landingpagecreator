import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { randomUUID } from 'node:crypto'

export default class WebsiteSetting extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(websiteSetting: WebsiteSetting) {
    websiteSetting.id = randomUUID()
  }

  @column()
  declare websiteId: string | null

  @column()
  declare key: string | null

  @column()
  declare value: string | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
