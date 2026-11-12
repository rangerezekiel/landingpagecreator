import { BaseSchema } from '@adonisjs/lucid/schema'
import { randomUUID } from 'node:crypto'

const GOOGLE_TAG_KEY = 'GOOGLE_TAG_ID'

/**
 * Adds the GOOGLE_TAG_ID setting row to every existing website.
 *
 * The website-setting dashboard renders one input per row that already exists,
 * and keysUpdate only updates existing rows, so the row has to be seeded here
 * for the field to be editable on websites created before this migration.
 *
 * Value is left empty: no tag is injected until an admin fills it in.
 */
export default class extends BaseSchema {
  async up() {
    const websites = await this.db.from('websites').select('id')
    if (websites.length === 0) return

    // Skip websites that already carry the row so a re-run stays a no-op.
    const existing = await this.db
      .from('website_settings')
      .where('key', GOOGLE_TAG_KEY)
      .select('website_id')

    const taken = new Set(existing.map((row) => row.website_id))
    const now = new Date()

    const rows = websites
      .filter((website) => !taken.has(website.id))
      .map((website) => ({
        id: randomUUID(),
        website_id: website.id,
        key: GOOGLE_TAG_KEY,
        value: '',
        deleted_at: null,
        created_at: now,
        updated_at: now,
      }))

    if (rows.length > 0) {
      await this.db.table('website_settings').multiInsert(rows)
    }
  }

  async down() {
    await this.db.from('website_settings').where('key', GOOGLE_TAG_KEY).delete()
  }
}
