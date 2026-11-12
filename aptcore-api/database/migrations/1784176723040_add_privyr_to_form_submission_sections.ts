import { BaseSchema } from '@adonisjs/lucid/schema'
import { randomUUID } from 'node:crypto'

const PRIVYR_KEYS = ['PRIVYR_ENABLED', 'PRIVYR_WEBHOOK_URL']

/**
 * Adds the Privyr detail rows to every existing FORM_SUBMISSION section.
 *
 * PRIVYR_ENABLED     - picks which form the landing page renders.
 * PRIVYR_WEBHOOK_URL - secret; its path doubles as the Privyr auth token, so it
 *                      is stripped from the public section read.
 */
export default class extends BaseSchema {
  async up() {
    const sections = await this.db.from('sections').where('key', 'FORM_SUBMISSION').select('id')
    if (sections.length === 0) return

    // Skip sections that already carry the rows so a re-run stays a no-op.
    const existing = await this.db
      .from('section_details')
      .whereIn('key', PRIVYR_KEYS)
      .select('section_id', 'key')

    const taken = new Set(existing.map((row) => `${row.section_id}:${row.key}`))
    const now = new Date()
    const rows: Record<string, unknown>[] = []

    for (const section of sections) {
      if (!taken.has(`${section.id}:PRIVYR_ENABLED`)) {
        rows.push({
          id: randomUUID(),
          section_id: section.id,
          key: 'PRIVYR_ENABLED',
          label: 'Use Privyr Form',
          type: 'BOOLEAN',
          value: 'false',
          json_value: null,
          sort_order: 2,
          active: true,
          created_at: now,
          updated_at: now,
        })
      }

      if (!taken.has(`${section.id}:PRIVYR_WEBHOOK_URL`)) {
        rows.push({
          id: randomUUID(),
          section_id: section.id,
          key: 'PRIVYR_WEBHOOK_URL',
          label: 'Privyr Webhook URL',
          type: 'TEXT',
          value: null,
          json_value: null,
          sort_order: 3,
          active: true,
          created_at: now,
          updated_at: now,
        })
      }
    }

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
      .whereIn('key', PRIVYR_KEYS)
      .delete()
  }
}
