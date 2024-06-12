"use strict";


const Hash = use('Hash');
const Todo = use('App/Models/Todo');
const { validate } = use('Validator');
const Database = use('Database');
const basePath = use('Helpers').appRoot(); 
const Env = use('Env')


class TodoController {

  async todos({ request, params, response, auth }) {
    try {

      const queryParams = request.get();

      const page = queryParams.page;
      const per_page = queryParams.per_page;
      const search = queryParams.search ? queryParams.search.trim() : ''; 

      let orderBy = 'created_at';
      let order = 'asc';

      if(queryParams.todo){
        orderBy = 'todo';
        order = queryParams.todo == 'ascend' ? 'asc' : 'desc';
      }
  
      if(queryParams.description){
        orderBy = 'description';
        order = queryParams.description == 'ascend' ? 'asc' : 'desc';
      }

      // Calculate offset based on page and per_page
      const offset = (page - 1) * per_page;
  
      let query = Database
        .select('id', 'todo', 'description')
        .from('todos');
  
      // Add search condition if search parameter is provided
      if (search) {
        query = query.where(function() {
          this.whereRaw("concat(todo) like ?", [`%${search}%`])
            .orWhereRaw("concat(description) like ?", [`%${search}%`]);
        });
      }
  
      const [todos, total] = await Promise.all([
        query
          .orderBy(orderBy, order)
          .limit(per_page)
          .offset(offset),
        Database
          .from('todos')
          .modify((queryBuilder) => {
            // Apply search condition to count query as well
            if (search) {
              queryBuilder.where(function() {
                this.whereRaw("concat(todo) like ?", [`%${search}%`])
                  .orWhereRaw("concat(description) like ?", [`%${search}%`]);
              });
            }
          })
          .count('id AS total')
          .then(count => count[0].total),
      ]);
      
  
      const total_pages = Math.ceil(total / per_page);
  
      return response.status(200).send({
        page,
        per_page,
        total,
        total_pages,
        data: todos
      });
    } catch (error) {
      console.error('Error fetching todos:', error);
      return response.status(500).send({ message: 'An error occurred while fetching todos.' });
    }
  }

  async logout({ request, auth }) {
    try {
      const { token } = request.all();
      // const refreshToken = request.input('refreshToken');
      // return refreshToken;
      if (!token) {
        return { message: 'Refresh token is missing'};
      }
  
      await auth.authenticator('jwt').revokeTokens([token], true); // Revoke the refresh token
  
      return { message: 'Successfully logged out.' };
    } catch (error) {
      return { message: 'Error logging out'};
    }
  }

  async show({ response, params , auth}) {

    if (auth) {
      // Fetch todo details
      const todo = await Database
        .select('id', 'todo', 'description')
        .from('todos')
        .where('id', params.id)
        .first();
    
      if (todo) {

        return response.status(200).send({
          message: 'Todo data successfully fetched!',
          data: { todo, },
        });
      }
    }
  
    return response.status(500).send({ message: 'Todo not found.' });
  }

  async update({ request, params, response, auth }) {
    try {
      const rules = {
        todo: 'required',
        description: 'required'
      };

      const user = await auth.getUser();
      if(user){
        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
          return response.status(422).send(validation.messages());
        }

        const todo = await Todo.findOrFail(params.id);
        
        todo.todo = request.input('todo');
        todo.description = request.input('description');

        await todo.save();

        return response.status(200).send({ message: 'Todo updated successfully!' });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      return response.status(500).send({ message: 'An error occurred during update.' });
    }
  }

  async create({ request, response, auth }) {
    try {
      const rules = {
        todo: 'required',
        description: 'required',
      };

      const user = await auth.getUser();

      if (user) {

        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
          return response.status(422).send(validation.messages());
        }

        const sanitizedData = {};
        for (const field in rules) {
          sanitizedData[field] = request.all()[field]
        }
        const todoNew = await Todo.create(sanitizedData);

        return response.status(200).send({ message: 'Todo saved successfully!', id: todoNew.id });

      } else {
        return response.status(400).send({ message: 'Invalid create access.' });
      }
    } catch (error) {

      console.error(error); // Log the error for debugging
      return response.status(500).send({ message: 'An error occurred during save.' });

    }
  }

  async delete({ auth, params, response }) {

    try {

      if (auth) {

        const { id } = params;
        // delete todo by id
        await Todo.query().where('id', id).delete();

        return response.status(200).send({ message: 'Todo has been deleted' });
      } else {
        return response.status(400).send({ message: "You don't have delete access." });
      }

    } catch (error) {
      return response.status(500).send({ message: 'An error occurred during delete.' });
    }
  }
}

module.exports = TodoController
