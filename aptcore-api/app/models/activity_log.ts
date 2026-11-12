import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import User from '#models/user'
import Website from './website.js'

export default class ActivityLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(activityLog: ActivityLog) {
    activityLog.id = randomUUID()
  }

  @column()
  declare userId: string | null

  @column()
  declare websiteId: string | null

  @column()
  declare action: string

  @column()
  declare module: string

  @column()
  declare note: string | null

  @column()
  declare ipAddress: string | null

  @column()
  declare userAgent: string | null

  @column()
  declare url: string | null

  @column()
  declare method: string | null

  @column()
  declare status: string | null

  @column()
  declare payload: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'userId',
    localKey: 'id',
    onQuery: (query) => {
      query.select('id', 'fullName', 'username')
    },
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Website, {
    foreignKey: 'websiteId',
    localKey: 'id',
    onQuery: (query) => {
      query.select('id', 'title', 'domain')
    },
  })
  declare website: BelongsTo<typeof Website>
}
