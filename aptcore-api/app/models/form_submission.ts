import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, belongsTo, column } from '@adonisjs/lucid/orm'
import { randomUUID } from 'node:crypto'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Website from './website.js'

import { MorphMap } from '@holoyan/adonisjs-permissions'
import { AclModelInterface } from '@holoyan/adonisjs-permissions/types'
import { hasPermissions } from '@holoyan/adonisjs-permissions'
import User from './user.js'

@MorphMap('form_submissions')
export default class FormSubmission
  extends compose(BaseModel, SoftDeletes, hasPermissions())
  implements AclModelInterface
{
  getModelId(): string {
    return this.id
  }

  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(formSubmissions: FormSubmission) {
    formSubmissions.id = randomUUID()
  }

  @column()
  declare websiteId: string

  @column()
  declare name: string | null

  @column()
  declare email: string

  @column()
  declare countryCode: string | null

  @column()
  declare phoneCode: string | null

  @column()
  declare phoneNumber: string | null

  @column()
  declare phone: string | null

  @column()
  declare message: string | null

  @column()
  declare createdBy: string | null

  @column()
  declare readBy: string | null

  @column()
  declare readAt: DateTime | null

  @column()
  declare status: string | null

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

  @belongsTo(() => User, {
    foreignKey: 'readBy',
    localKey: 'id',
    onQuery: (query) => {
      query.select('id', 'fullName', 'username')
    },
  })
  declare readByUser: BelongsTo<typeof User>
}
