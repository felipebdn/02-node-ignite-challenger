import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id')
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.integer('is_on_diet').notNullable()
    table.text('created_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}
