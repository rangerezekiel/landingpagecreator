import { BaseSchema } from '@adonisjs/lucid/schema'
import { randomUUID } from 'node:crypto'

const PHOTO_KEY = 'PHOTO'

/**
 * Adds the PHOTO detail row to every existing FORM_SUBMISSION section.
 *
 * Optional image rendered above the text on the Privyr form. Left empty, so
 * existing pages keep their current text-only layout until an admin uploads one.
 */
export default class extends BaseSchema {
  async up() {
    const sections = await this.db.from('sections').where('key', 'FORM_SUBMISSION').select('id')
    if (sections.length === 0) return

    // Skip sections that already carry the row so a re-run stays a no-op.
    const existing = await this.db
      .from('section_details')
      .where('key', PHOTO_KEY)
      .whereIn(
        'section_id',
        sections.map((section) => section.id)
      )
      .select('section_id')

    const taken = new Set(existing.map((row) => row.section_id))
    const now = new Date()

    const rows = sections
      .filter((section) => !taken.has(section.id))
      .map((section) => ({
        id: randomUUID(),
        section_id: section.id,
        key: PHOTO_KEY,
        label: 'Photo',
        type: 'IMAGE',
        value: null,
        json_value: null,
        sort_order: 4,
        active: true,
        created_at: now,
        updated_at: now,
      }))

    if (rows.length > 0) {
      await this.db.table('section_details').multiInsert(rows)
    }
  }

  async down() {
    const sections = await this.db.from('sections').where('key', 'FORM_SUBMISSION').select('id')
    if (sections.length === 0) return

    await this.db
      .from('section_details')
      .whereIn(
        'section_id',
        sections.map((section) => section.id)
      )
      .where('key', PHOTO_KEY)
      .delete()
  }
}
