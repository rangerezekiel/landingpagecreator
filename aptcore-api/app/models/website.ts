import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, hasMany } from '@adonisjs/lucid/orm'
import { SoftDeletes } from 'adonis-lucid-soft-deletes'
import { compose } from '@adonisjs/core/helpers'
import { randomUUID } from 'node:crypto'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import FormSubmission from './form_submission.js'

export default class Website extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  declare id: string

  @beforeCreate()
  static assignUuid(website: Website) {
    website.id = randomUUID()
  }

  @column()
  declare title: string

  @column()
  declare domain: string

  @column()
  declare theme: string

  @column()
  declare favicon: string | null

  @column()
  declare logo: string | null

  @column()
  declare metaTitle: string | null

  @column()
  declare metaDescription: string | null

  @column()
  declare apiKey: string | null

  @column()
  declare active: boolean

  @column()
  declare createdBy: string | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // The SoftDeletes mixin filters deleted rows through beforeFind/beforeFetch hooks, which
  // never run on the sub queries built by withCount/whereHas. Excluding them here keeps every
  // use of this relation (counts, preloads, existence checks) off the trashed submissions.
  @hasMany(() => FormSubmission, {
    foreignKey: 'websiteId',
    onQuery: (query) => {
      query.whereNull('form_submissions.deleted_at')
    },
  })
  declare formSubmissions: HasMany<typeof FormSubmission>
}
