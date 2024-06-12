'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 254).notNullable().unique()
      table.string('first_name', 254).notNullable()
      table.string('middle_name', 254).nullable()
      table.string('last_name', 254).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 254).notNullable()
      table.string('file_name', 254).nullable().comment('profile image file name')
      table.boolean('is_active').defaultTo(true).comment('false = inactive, true = active')
      table.boolean('is_deleted').defaultTo(false).comment('false = default, true = deleted')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
