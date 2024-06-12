'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PageSchema extends Schema {
  up () {
    this.create('pages', (table) => {
      table.increments()
      table.string('group', 254).notNullable().comment('page group')
      table.string('name', 254).notNullable().comment('page name')
      table.string('url', 254).notNullable().comment('page url')
      table.string('key', 254).notNullable().comment('page key')
      table.integer('sort').defaultTo(0)
      table.integer('created_by').unsigned().references('id').inTable('users')
      table.integer('updated_by').unsigned().references('id').inTable('users')
      table.timestamps()
    })

  }

  down () {
    this.drop('pages')
  }
}

module.exports = PageSchema
