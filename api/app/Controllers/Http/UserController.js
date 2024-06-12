"use strict";


const Hash = use('Hash');
const User = use('App/Models/User');
const { validate } = use('Validator');
const Database = use('Database');
const basePath = use('Helpers').appRoot(); 
const Env = use('Env')


class UserController {

  async users({ request, params, response, auth }) {
    try {
      const user = await auth.getUser();

      const queryParams = request.get();

      const page = queryParams.page;
      const per_page = queryParams.per_page;
      const search = queryParams.search ? queryParams.search.trim() : ''; 

      let orderBy = 'created_at';
      let order = 'asc';

      if(queryParams.name){
        orderBy = 'first_name';
        order = queryParams.name == 'ascend' ? 'asc' : 'desc';
      }
  
      if(queryParams.is_active){
        orderBy = 'is_active';
        order = queryParams.is_active == 'ascend' ? 'asc' : 'desc';
      }

      // return response.status(200).send({search});
      // Calculate offset based on page and per_page
      const offset = (page - 1) * per_page;
  
      let query = Database
        .select('id', 'username', 'first_name', 'middle_name', 'last_name', 'email', 'is_active')
        .from('users')
        .whereNot('is_deleted', true)
        .whereNot('id', user.id);

      if (checkManagedUser.length > 0){
        query = query.where(function () {
          this.whereIn('id', whereIDs)
        });
      }
  
      // Add search condition if search parameter is provided
      if (search) {
        query = query.where(function() {
          this.whereRaw("concat(first_name, ' ', last_name) like ?", [`%${search}%`])
            .orWhereRaw("concat(first_name, ' ', middle_name, ' ', last_name) like ?", [`%${search}%`])
            .orWhere('first_name', 'like', `%${search}%`)
            .orWhere('last_name', 'like', `%${search}%`)
            .orWhere('email', 'like', `%${search}%`);
        });
      }
  
      const [users, total] = await Promise.all([
        query
          .orderBy(orderBy, order)
          .limit(per_page)
          .offset(offset),
        Database
          .from('users')
          .whereNot('is_deleted', true)
          .whereNot('id', user.id)
          .modify((queryBuilder) => {
            // Apply search condition to count query as well
            if (search) {
              queryBuilder.where(function() {
                this.whereRaw("concat(first_name, ' ', last_name) like ?", [`%${search}%`])
                  .orWhereRaw("concat(first_name, ' ', middle_name, ' ', last_name) like ?", [`%${search}%`])
                  .orWhere('email', 'like', `%${search}%`);
              });
            }

            if (checkManagedUser.length > 0) {
              queryBuilder.where(function () {
                this.whereIn('id', whereIDs)
              });
            }
          })
          .count('id AS total')
          .then(count => count[0].total),
      ]);
      
  
      const total_pages = Math.ceil(total / per_page);

      let UpdatedUser = [];

      if(users.length > 0){
        for(let i = 0; i < users.length; i++){

          users[i].role = '';

          if(users[i].role_id != null){
            const role = await Database
            .select('id', 'name')
            .from('roles')
            .where('id', users[i].role_id)
            .first();
            if(role){
              users[i].role = role['name'];
            }

          }
          UpdatedUser.push(users[i]); 
        }
      }
  
      return response.status(200).send({
        page,
        per_page,
        total,
        total_pages,
        data: UpdatedUser
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return response.status(500).send({ message: 'An error occurred while fetching users.' });
    }
  }

  async login({ request, auth , response}) {

    const { email, password } = request.all();

    try {
      const user = await User.findBy('email', email);
      console.log(user)
      if (!user) {
        return response.status(400).send({ error: 'Invalid email.' });
      }

      const isSame = await Hash.verify(password, user.password);

      if (!isSame) {
        return response.status(400).send({ error: 'Invalid credentials.' });
      }

      const token = await auth.attempt(user.email, password);

      //insert pages here
      token.menu = [];
      token.user_id = user.id;
      token.first_name = user.first_name;
      token.last_name = user.last_name;
      token.email = user.email;
      token.file_name = '';
      token.role = user.role;
      token.access = [];
      return token;

    } catch (error) {
      console.log(error)
      return response.status(400).send({ error: 'An error occurred. Please try again later.', error });
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
    
    // Fetch user details
    const user = await Database
      .select('id', 'username', 'first_name', 'middle_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'job_description', 'file_name', 'is_active')
      .from('users')
      .where('is_deleted', 0)
      .where('id', params.id)
      .first();
  
    if (user) {
      // Fetch user profile image
      if (user.file_name) {
        user.file_name = user.file_name != null ? blobService.getUrl('images', user.file_name) : user.file_name;
      }

      // Fetch manager data for whom this user reports to (manager_to)
      const managerTo = await Database
        .select('manager_user_id', 'user_id')
        .from('manager_users')
        .where('manager_user_id', user.id);
  
      // Prepare an empty array to store manager data
      let manager_to = [];
  
      // Loop through each manager record and potentially enrich data (e.g., fetch full user details)
      for (let i = 0; i < managerTo.length; i++) {
        // Assuming `user_id` in `manager_users` references the `users` table
        let managerDetails = await Database.select('id', 'username', 'first_name', 'middle_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                                            .from('users')
                                            .where('id', managerTo[i].user_id)
                                            .first();
        managerDetails.file_name = blobService.getUrl('images', managerDetails.file_name)
        manager_to.push(managerDetails); // Include raw manager data if no details found
      }
  
      // Fetch users who report to this user (reports_to)
      const reportsTo = await Database
        .select('manager_user_id', 'user_id')
        .from('manager_users')
        .where('user_id', user.id);
  
      // Prepare an empty array to store reports data
      let reports_to = [];
  
      // Loop through each manager record and potentially enrich data (e.g., fetch full user details)
      for (let i = 0; i < reportsTo.length; i++) {
        // Assuming `user_id` in `manager_users` references the `users` table
        let reportsToDetails = await Database.select('id', 'username', 'first_name', 'middle_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                                            .from('users')
                                            .where('id', reportsTo[i].manager_user_id)
                                            .first();
        reportsToDetails.file_name = blobService.getUrl('images', reportsToDetails.file_name)
        reports_to.push(reportsToDetails); // Include raw manager data if no details found
      }

      const divisions = await User.query()
      .distinct('assigned_branch')
      .pluck('assigned_branch', 'assigned_branch');

      const division_options = divisions.map(branch => ({ value: branch, label: branch }));

      const roles = await User.query()
      .distinct('role_name')
      .pluck('role_name', 'role_name');
  
      const role_options = roles.map(role => ({ value: role, label: role }));

      return response.status(200).send({
        message: 'User data successfully fetched!',
        data: { user, manager_to, reports_to, division_options, role_options},
      });
    }
  
    return response.status(500).send({ message: 'User not found.' });
  }

  async getManagerUsers({ request, response }){

    let alluser = await Database
                .select('id', 'first_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                .from('users')
                .whereNot('id', user.id)
                .whereNot('is_deleted', true);

    let reports_to = [];
  
    // Loop through each manager record and potentially enrich data (e.g., fetch full user details)
    for (let i = 0; i < alluser.length; i++) {
      // Assuming `user_id` in `manager_users` references the `users` table

      alluser[i].file_name = alluser[i].file_name != null ? blobService.getUrl('images', alluser[i].file_name) :alluser[i].file_name;

      reports_to.push(alluser[i]); // Include raw manager data if no details found
    }

    return response.status(200).send({
      message: 'User data fetched!',
      data: { reports_to },
    });
    
  }

  async defaults({ response, auth }) {
    const user = await auth.getUser();

    let checkCreate = [];
    checkCreate = await utils.checkPermission(user, 'create-user');
    if (checkCreate.length == 1) {

      let alluser = await Database
                  .select('id', 'first_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                  .from('users')
                  .whereNot('id', user.id)
                  .whereNot('is_deleted', true);

      const divisions = await User.query()
      .distinct('assigned_branch')
      .pluck('assigned_branch', 'assigned_branch');

      const division_options = divisions.map(branch => ({ value: branch, label: branch }));

      const roles = await User.query()
      .distinct('role_name')
      .pluck('role_name', 'role_name');
  
      const role_options = roles.map(role => ({ value: role, label: role }));

      return response.status(200).send({
        message: 'defaults found',
        data: { alluser, division_options, role_options},
      });
    }
  
    return response.status(500).send({ message: 'Defaults not found.' });
  }
  
  async register({ request, response }) {

    const rules = {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required|min:6',
      first_name: 'required',
      last_name: 'required',
      role: 'required|in:hr,admin,manager,user'
    };

    const validation = await validate(request.all(), rules)

    if (validation.fails()) {
      return response.status(422).send(validation.messages());
    }


    const sanitizedData = {};
    for (const field in rules) {
      sanitizedData[field] = request.all()[field]
        .replace(/<[^>]+>/g, ''); // Remove HTML tags
    }


    try {
      // const User = use('App/Models/User');
      await User.create(sanitizedData);
      return response.status(201).send({ message: 'User created successfully!' });
    } catch (error) {
      response.status(402).send(error.detail);
    }
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

      const user = await auth.getUser();
      let checkUpdate = [];
      checkUpdate = await utils.checkPermission(user, 'update-user');

      if(checkUpdate.length > 0){

        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
          return response.status(422).send(validation.messages());
        }

        const user = await User.findOrFail(params.id);

        // Update user attributes directly
        //   user.username = request.input('username');
        //   user.email = request.input('email');
        user.first_name = request.input('first_name');
        user.middle_name = request.input('middle_name');
        user.last_name = request.input('last_name');
        user.email = request.input('email');
        user.role_name = request.input('role_name');
        user.assigned_branch = request.input('assigned_branch');
        user.job_description = request.input('job_description');

        // Optionally handle password updates (not included in the provided code)
        // if (request.input('password')) {
        //   user.password = await Hash.make(request.input('password'));
        // }

        await user.save();

        return response.status(200).send({ message: 'User updated successfully!' });
      } else {
        return response.status(500).send({ message: 'No permission for user update.' });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      return response.status(500).send({ message: 'An error occurred during update.' });
    }
  }

  async updateActive({ request, params, response, auth }) {
    try {
      const user = await auth.getUser();
      let checkUpdate = [];
      checkUpdate = await utils.checkPermission(user, 'update-user');

      if(checkUpdate.length > 0){
        const user = await User.findOrFail(params.id);
        user.is_active = request.input('is_active');
        await user.save();
        return response.status(200).send({ message: 'User updated to ' + (user.is_active == 1 ? 'ACTIVE' : 'INACTIVE') + ' Successfully!' });
      } else {
        return response.status(500).send({ message: 'No permission for user update.' });
      }
    } catch (error) {
      console.error(error); // Log the error for debugging
      return response.status(500).send({ message: 'An error occurred during update.' });
    }
  }

  async email(receiverEmail, full_name = '') {

    const connectionString = process.env.AZURE_MAIL_CONNECTION_STRING;
    const emailClient = new EmailClient(connectionString);

    const POLLER_WAIT_TIME = 10;
    try {

      const htmlString = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                }
                .header img {
                    width: 100px;
                }
                .content {
                    padding: 20px;
                }
                .content h1 {
                    color: #333;
                }
                .content p {
                    line-height: 1.6;
                }
                .button {
                    display: block;
                    width: 200px;
                    margin: 20px auto;
                    padding: 10px 0;
                    text-align: center;
                    background-color: #28a745;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    text-align: center;
                    padding: 10px 0;
                    font-size: 12px;
                    color: #999;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://todo-admin.azurewebsites.net/icon.png" alt="Company Logo">
                </div>
                <div class="content">
                    <h1>Welcome to Todo!</h1>
                    <p>Hi `+ full_name +`,</p>
                    <p>We are thrilled to have you on board. Thank you for joining us at Todo. We are committed to providing you with the best service possible.</p>
                    <p>To get started, please click the button below:</p>
                    <a href="https://todo-admin.azurewebsites.net/" class="button" style="color: white;">Get Started</a>
                    <p>If you have any questions or need assistance, feel free to reply to this email or contact our support team at support@todo.com.</p>
                    <p>Best regards,<br>The Todo Team</p>
                </div>
                <div class="footer">
                    <p>&copy; `+ 
                    // insert current whole year
                    new Date().getFullYear()
                    +` Todo. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `;

      
      const message = {
        senderAddress: "DoNotReply@thetodo.com",
        content: {
          subject: "Welcome to Todo!",
          plainText: "We are thrilled to have you on board. Thank you for joining us at Todo. We are committed to providing you with the best service possible.",
          html: htmlString,
        },
        recipients: {
          to: [
            {
              address: receiverEmail,
              displayName: full_name,
            },
          ],
        },
      };

      const poller = await emailClient.beginSend(message);

      if (!poller.getOperationState().isStarted) {
        throw "Poller was not started."
      }

      let timeElapsed = 0;
      while (!poller.isDone()) {
        poller.poll();
        console.log("Email send polling in progress");

        await new Promise(resolve => setTimeout(resolve, POLLER_WAIT_TIME * 1000));
        timeElapsed += 10;

        if (timeElapsed > 18 * POLLER_WAIT_TIME) {
          throw "Polling timed out.";
        }
      }
      console.log(poller.getResult().status);
      if (poller.getResult().status == 'Succeeded') {
        console.log(`Successfully sent the email (operation id: ${poller.getResult().id})`);
      }
      else {
        throw poller.getResult().error;
      }
    } catch (e) {
      console.log(e);
    }
  }

  async create({ request, response, auth }) {
    try {
      const rules = {
        first_name: 'required',
        middle_name: 'max:256',
        last_name: 'required',
        email: 'required',
        role_name: 'required',
        assigned_branch: 'required',
        job_description: 'required',
      };
      const user = await auth.getUser();
      let checkCreate = [];
      checkCreate = await utils.checkPermission(user, 'create-user');

      if (checkCreate.length > 0) {

        const validation = await validate(request.all(), rules);

        if (validation.fails()) {
          return response.status(422).send(validation.messages());
        }

        const sanitizedData = {};
        for (const field in rules) {
          sanitizedData[field] = request.all()[field]
        }
        sanitizedData['username'] = request.all()['first_name'] + request.all()['last_name']
        sanitizedData['password'] = 'password';
        const userNew = await User.create(sanitizedData);

        // userNew.username = userNew.first_name+userNew.last_name+userNew.id;
        userNew.role = 'user';
        // userNew.password = 'password';

        await userNew.save();

        let imageUrl = '';

        const file = request.file('file');
        if(file){
          const filename = `${Date.now()}-${file.clientName}`;
          const containerName = 'images'; 
          
          await new Promise((resolve, reject) => {
            blobService.createBlockBlobFromLocalFile(containerName, filename, file.tmpPath, (error, result, response) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });

          // Update user profile photo URL in database
          userNew.file_name = filename;
          await userNew.save();

          // imageUrl = `${Env.get('APP_URL')}/uploads/profile/${filename}`;

          imageUrl = blobService.getUrl('images', filename);
        }

        // call email function here
        console.log('email', userNew.email)
        this.email(userNew.email, userNew.first_name + ' ' + userNew.last_name);       

        return response.status(200).send({ message: 'User saved successfully!', imageUrl, id: userNew.id });

      } else {
        return response.status(400).send({ message: 'Invalid create access.' });
      }
    } catch (error) {

      console.error(error); // Log the error for debugging
      return response.status(500).send({ message: 'An error occurred during save.' });

    }
  }

  async updateImage({ request, response, auth, params }) {
    const user = await auth.getUser();
    let checkUpdate = await utils.checkPermission(user, 'update-user');

    if (checkUpdate.length > 0) {
      const file = request.file('file');
      if (file) {
        const filename = `${Date.now()}-${file.clientName}`;
        const containerName = 'images'; 

        try {
          // Upload file to Azure Blob Storage
          await new Promise((resolve, reject) => {
            blobService.createBlockBlobFromLocalFile(containerName, filename, file.tmpPath, (error, result, response) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });

          const imageUrl = blobService.getUrl(containerName, filename);

          // Update user profile photo URL in database
          const user = await User.findOrFail(params.id);
          user.file_name = filename;
          await user.save();

          // Handle successful update logic here
          return response.status(200).json({
            message: 'Profile photo uploaded successfully!',
            img_url: imageUrl
          });
        } catch (error) {
          console.error('Error uploading profile photo to Azure Blob Storage:', error);
          return response.status(500).json({
            message: 'An error occurred while uploading the profile photo to Azure Blob Storage.',
          });
        }
      } else {
        return response.status(500).json({
          message: 'Invalid upload the profile photo.',
        });
      }
    } else {
      return response.status(500).json({
        message: 'Unauthorized to update profile photo.',
      });
    }
  }

  async delete({ auth, params, response }) {

    try {

      const user = await auth.getUser();
      let checkDelete = [];
      checkDelete = await utils.checkPermission(user, 'delete-user');

      if (checkDelete.length > 0) {

        const { id } = params;
        const userDelete = await User.find(id);

        userDelete.is_deleted = 1;

        await userDelete.save();

        return response.status(200).send({ message: 'User has been deleted' });
      } else {
        return response.status(400).send({ message: "You don't have delete access." });
      }

    } catch (error) {
      return response.status(500).send({ message: 'An error occurred during delete.' });
    }
  }

  async managerUsers({ request, response, auth}){
    
    const logged_user = await auth.getUser();

    const rules = {
      id: 'number',
      type: 'number',
      value: 'string',
    };

    let allUsersExceptCurrentManaging = [];

    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).send(validation.messages());
    }

    const user = await User.findOrFail(request.input('id'));

    if(user){
      
      let type = request.input('type')
      let usersTo = [];

      if(type == "0"){
        usersTo = await Database
          .select('user_id')
          .from('manager_users')
          .where('manager_user_id', user.id);
      } else if (type == "1"){
        usersTo = await Database
          .select('manager_user_id')
          .from('manager_users')
          .where('user_id', user.id);
      }

      let userIds = (type == "0") ? usersTo.map(item => item.user_id) : usersTo.map(item => item.manager_user_id);


      if(type == "0"){
        userIds.push(logged_user.id)
        let reportsTo = await Database
                        .select('manager_user_id')
                        .from('manager_users')
                        .where('user_id', user.id);
        for(let i = 0; i < reportsTo.length; i++){
          userIds.push(reportsTo[i].manager_user_id)
        }
      } else if (type == "1"){
        let managersTo = await Database
                          .select('user_id')
                          .from('manager_users')
                          .where('manager_user_id', user.id);
        for(let i = 0; i < managersTo.length; i++){
          userIds.push(managersTo[i].user_id)
        }
      }

      userIds.push(user.id)
      let search = request.input('value')


      // Now, fetch users except those with the IDs obtained from the previous query
      allUsersExceptCurrentManaging = await Database
                                            .select('id', 'first_name', 'last_name', 'role_name', 'assigned_branch', 'role', 'email', 'file_name')
                                            .table('users')
                                            .whereNotIn('id', userIds)
                                            .whereNot('is_deleted', true)
                                            .modify((queryBuilder) => {
                                              // Apply search condition to count query as well
                                              if (search) {
                                                queryBuilder.where(function() {
                                                  this.whereRaw("concat(first_name, ' ', last_name) like ?", [`%${search}%`])
                                                    .orWhere('email', 'like', `%${search}%`)
                                                    .orWhere('assigned_branch', 'like', `%${search}%`)
                                                    .orWhere('role_name', 'like', `%${search}%`)
                                                    .orWhere('role', 'like', `%${search}%`);
                                                });
                                              }
                                            })
                                            .limit(6);

          
      let managers = [];
  
      // Loop through each manager record and potentially enrich data (e.g., fetch full user details)
      for (let i = 0; i < allUsersExceptCurrentManaging.length; i++) {
        // allUsersExceptCurrentManaging[i].file_name = `${Env.get('APP_URL')}${allUsersExceptCurrentManaging[i].file_name}`;

        allUsersExceptCurrentManaging[i].file_name = blobService.getUrl('images', allUsersExceptCurrentManaging[i].file_name);
        managers.push(allUsersExceptCurrentManaging[i]); // Include raw manager data if no details found
      }

      allUsersExceptCurrentManaging = managers; 

    }
      
    return allUsersExceptCurrentManaging
  }

  async setManagerUser({ request, response, auth}){
    
    const logged_user = await auth.getUser();
    let checkAccess = [];

    const rules = {
      id: 'number',
      set: 'string',
      set_id: 'number',
      type: 'number',
    };


    const validation = await validate(request.all(), rules);

    if (validation.fails()) {
      return response.status(422).send(validation.messages());
    }

    const userToUpdate = await User.findOrFail(request.input('id'));

    const type = request.input('type');
    const user_id = request.input('id');
    const set_id = request.input('set_id');
    const set = request.input('set');

    checkAccess = await utils.checkPermission(logged_user, (type == '0' ? 'add-manager-to-users' : 'add-reporting-to-users	'));
    
    if (userToUpdate){
      if (logged_user.id == userToUpdate.id){
        return response.status(500).send({ message: 'You cant set using your account' });
      }

      let checkUser = null;
      if (checkAccess.length > 0){
        if(set == 'add'){
          //if reports to
          if(type == '0'){
            
            checkUser = await Database
              .select('user_id')
              .from('manager_users')
              .where('manager_user_id', userToUpdate.id)
              .where('user_id', set_id)

          }
          //if managing
          else if(type == '1'){
            checkUser = await Database
              .select('user_id')
              .from('manager_users')
              .where('manager_user_id', set_id)
              .where('user_id', userToUpdate.id)

          }

          if(checkUser == null){

            return response.status(500).send({ message: 'data already exist, cannot add anymore' });

          }else{
            //if reports to
            if(type == '0'){
              let data = {
                user_id: set_id,
                manager_user_id: userToUpdate.id,
              };

              let saveData = await ManagerUser.create(data);
              return response.status(201).send({ message: 'User added as being managed successfully!' });
            }
            //if managing
            else if(type == '1'){
              let data = {
                user_id: userToUpdate.id,
                manager_user_id: set_id
              };

              let saveData = await ManagerUser.create(data);
              return response.status(201).send({ message: 'User added as reporting to successfully!' });
            }

          }
        }else if(set == 'remove'){
          //if reports to
          if(type == '0'){
            
            checkUser = await Database
              .select('user_id')
              .from('manager_users')
              .where('manager_user_id', userToUpdate.id)
              .where('user_id', set_id)

          }
          //if managing
          else if(type == '1'){
            checkUser = await Database
              .select('user_id')
              .from('manager_users')
              .where('manager_user_id', set_id)
              .where('user_id', userToUpdate.id)

          }

          if(checkUser){

            //if reports to
            if(type == '0'){

              await ManagerUser.query().where('user_id', set_id).where('manager_user_id', userToUpdate.id).delete();

              return response.status(201).send({ message: 'User removed as being managed successfully!' });
            }
            //if managing
            else if(type == '1'){

              await ManagerUser.query().where('user_id', userToUpdate.id).where('manager_user_id', set_id).delete();

              return response.status(201).send({ message: 'User removed as reporting to successfully!' });
            }

          }else{
            
            return response.status(500).send({ message: 'data not found' });
            

          }
        }
      }else{
        return response.status(400).send({ message: 'No Access found' });
      }

    }

    return response.status(500).send({ message: 'data not found or already deleted' });
      
  }
}

module.exports = UserController
