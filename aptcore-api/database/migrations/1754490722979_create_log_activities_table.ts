import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.uuid('website_id').nullable().index()
      table.uuid('user_id').nullable().index()
      table.string('action').notNullable()
      table.string('module').notNullable()
      table.text('note').nullable()
      table.string('ip_address').nullable()
      table.text('user_agent').nullable()
      table.text('url').nullable()
      table.string('method').nullable()
      table.string('status').nullable()
      table.jsonb('payload').nullable()
      table.timestamp('created_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
