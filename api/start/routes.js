'use strict'

const Route = use('Route')
const Helpers = use('Helpers');

Route.group(() => {
  Route.get('/', () => {
    return { greeting: 'Hello world in JSON' }
  })

  // General user endpoints (auth required, but no role check)
  Route.post('register', 'UserController.register')
  Route.post('login', 'UserController.login')
  Route.post('sso-login', 'UserController.ssoLogin')
  Route.post('logout', 'UserController.logout').middleware(['auth'])  // Typically requires authentication
  
}).prefix('v1')

// Role-based endpoints
Route.group(() => {
  Route.get('todos', 'TodoController.todos')
  Route.get('todo/:id', 'TodoController.show')
  Route.post('todo', 'TodoController.create')
  Route.put('todo/update/:id', 'TodoController.update')
  Route.post('todo/create', 'TodoController.create')
  Route.delete('todo/:id', 'TodoController.delete')
  
}).middleware(['auth', 'checkUserRole:admin,hr']).prefix('v1') // Here, checkUserRole should be able to handle checking multiple roles

