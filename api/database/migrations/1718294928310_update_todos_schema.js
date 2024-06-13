'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateTodosSchema extends Schema {
  up () {
    this.table('todos', (table) => {
      table.timestamp('completed_date').nullable()
    })
  }

  down () {
    this.table('todos', (table) => {
      table.dropColumn('completed_date')
    })
  }
}

module.exports = UpdateTodosSchema
