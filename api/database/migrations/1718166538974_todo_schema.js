'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateTodoSchema extends Schema {
  up () {
    this.create('todos', (table) => {
      table.increments()
      table.string('todo', 254).notNullable()
      table.string('description', 512).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('todos')
  }
}

module.exports = CreateTodoSchema
