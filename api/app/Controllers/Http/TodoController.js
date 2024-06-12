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

  async show({ response, params }) {
    
    // Fetch todo details
    const todo = await Database
      .select('id', 'todoname', 'first_name', 'middle_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'job_description', 'file_name', 'is_active')
      .from('todos')
      .where('is_deleted', 0)
      .where('id', params.id)
      .first();
  
    if (todo) {
      // Fetch todo profile image
      if (todo.file_name) {
        todo.file_name = todo.file_name != null ? blobService.getUrl('images', todo.file_name) : todo.file_name;
      }

      // Fetch manager data for whom this todo reports to (manager_to)
      const managerTo = await Database
        .select('manager_todo_id', 'todo_id')
        .from('manager_todos')
        .where('manager_todo_id', todo.id);
  
      // Prepare an empty array to store manager data
      let manager_to = [];
  
      // Loop through each manager record and potentially enrich data (e.g., fetch full todo details)
      for (let i = 0; i < managerTo.length; i++) {
        // Assuming `todo_id` in `manager_todos` references the `todos` table
        let managerDetails = await Database.select('id', 'todoname', 'first_name', 'middle_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                                            .from('todos')
                                            .where('id', managerTo[i].todo_id)
                                            .first();
        managerDetails.file_name = blobService.getUrl('images', managerDetails.file_name)
        manager_to.push(managerDetails); // Include raw manager data if no details found
      }
  
      // Fetch todos who report to this todo (reports_to)
      const reportsTo = await Database
        .select('manager_todo_id', 'todo_id')
        .from('manager_todos')
        .where('todo_id', todo.id);
  
      // Prepare an empty array to store reports data
      let reports_to = [];
  
      // Loop through each manager record and potentially enrich data (e.g., fetch full todo details)
      for (let i = 0; i < reportsTo.length; i++) {
        // Assuming `todo_id` in `manager_todos` references the `todos` table
        let reportsToDetails = await Database.select('id', 'todoname', 'first_name', 'middle_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                                            .from('todos')
                                            .where('id', reportsTo[i].manager_todo_id)
                                            .first();
        reportsToDetails.file_name = blobService.getUrl('images', reportsToDetails.file_name)
        reports_to.push(reportsToDetails); // Include raw manager data if no details found
      }

      const divisions = await Todo.query()
      .distinct('assigned_branch')
      .pluck('assigned_branch', 'assigned_branch');

      const division_options = divisions.map(branch => ({ value: branch, label: branch }));

      const roles = await Todo.query()
      .distinct('role_name')
      .pluck('role_name', 'role_name');
  
      const role_options = roles.map(role => ({ value: role, label: role }));

      return response.status(200).send({
        message: 'Todo data successfully fetched!',
        data: { todo, manager_to, reports_to, division_options, role_options},
      });
    }
  
    return response.status(500).send({ message: 'Todo not found.' });
  }

  async update({ request, params, response, auth }) {
    try {
      const rules = {
        first_name: 'required',
        // middle_name: 'nullable',
        last_name: 'required',
        email: 'required',
        role_name: 'required',
        assigned_branch: 'required',
        job_description: 'required',
      };

      const todo = await auth.getTodo();
      let checkUpdate = [];
      checkUpdate = await utils.checkPermission(todo, 'update-todo');

      if(checkUpdate.length > 0){

        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
          return response.status(422).send(validation.messages());
        }

        const todo = await Todo.findOrFail(params.id);

        // Update todo attributes directly
        //   todo.todoname = request.input('todoname');
        //   todo.email = request.input('email');
        todo.first_name = request.input('first_name');
        todo.middle_name = request.input('middle_name');
        todo.last_name = request.input('last_name');
        todo.email = request.input('email');
        todo.role_name = request.input('role_name');
        todo.assigned_branch = request.input('assigned_branch');
        todo.job_description = request.input('job_description');

        // Optionally handle password updates (not included in the provided code)
        // if (request.input('password')) {
        //   todo.password = await Hash.make(request.input('password'));
        // }

        await todo.save();

        return response.status(200).send({ message: 'Todo updated successfully!' });
      } else {
        return response.status(500).send({ message: 'No permission for todo update.' });
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


      if (auth) {

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

      const todo = await auth.getTodo();
      let checkDelete = [];
      checkDelete = await utils.checkPermission(todo, 'delete-todo');

      if (checkDelete.length > 0) {

        const { id } = params;
        const todoDelete = await Todo.find(id);

        todoDelete.is_deleted = 1;

        await todoDelete.save();

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
