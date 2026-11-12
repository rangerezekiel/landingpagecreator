import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.text('website_id').nullable()
      table.string('username').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.string('full_name').nullable()
      table.string('country_code').nullable()
      table.string('phone_code').nullable()
      table.string('phone_number').nullable()
      table.string('phone').nullable()
      table.string('avatar').nullable()

      table.timestamp('last_login').nullable()
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['full_name'], 'full_name_index')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
