import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { BaseModel, beforeCreate, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { randomUUID } from 'node:crypto'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Website from './website.js'

import { MorphMap } from '@holoyan/adonisjs-permissions'
import { AclModelInterface } from '@holoyan/adonisjs-permissions/types'
import { hasPermissions } from '@holoyan/adonisjs-permissions'
@MorphMap('users')
export default class User
  extends compose(BaseModel, SoftDeletes, hasPermissions())
  implements AclModelInterface
{
  getModelId(): string {
    return this.id
  }

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(user: User) {
    user.id = randomUUID()
  }

  @column()
  declare username: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare fullName: string | null

  @beforeSave()
  static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  @column()
  declare countryCode: string | null

  @column()
  declare phoneCode: string | null

  @column()
  declare phoneNumber: string | null

  @column()
  declare phone: string | null

  @column()
  declare avatar: string | null

  @column()
  declare websiteId: string | null

  @column.dateTime()
  declare lastLogin: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Website, {
    foreignKey: 'websiteId',
    localKey: 'id',
    onQuery: (query) => {
      query.select('id', 'title', 'domain')
    },
  })
  declare website: BelongsTo<typeof Website>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
