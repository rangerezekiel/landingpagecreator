import { FieldContext } from '@vinejs/vine/types'
import vine from '@vinejs/vine'
import db from '@adonisjs/lucid/services/db'

/**
 * Options accepted by the unique rule
 */
type Options = {
  table: string
  column: string
  else_id?: string // <- optional ID to exclude (for edit/update)
}

/**
 * Implementation
 */
async function unique(value: unknown, options: Options, field: FieldContext) {
  if (!field.isDefined || !field.isValid || value === null || value === undefined || value === '') {
    return
  }

  if (typeof value !== 'string') {
    return
  }

  const query = db.from(options.table).select(options.column).where(options.column, value)

  if (options.else_id) {
    query.andWhereNot('id', options.else_id)
  }

  const row = await query.first()

  if (row) {
    field.report('The {{ field }} field is not unique', 'unique', field)
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const uniqueRule = vine.createRule(unique)
