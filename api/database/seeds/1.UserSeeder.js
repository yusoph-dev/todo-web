'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User');  


class UserSeeder {
    async run() {
        // Insert multiple users
        await User.createMany([
            {
                username: 'testuser',
                first_name: 'test',
                middle_name: '',
                last_name: 'user',
                email: 'test@email.com',
                password: 'password',
                file_name: '',
                is_active: true,
            }
        ]);

    }
}

module.exports = UserSeeder