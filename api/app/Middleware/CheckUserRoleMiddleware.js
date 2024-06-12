'use strict'

const User = use('App/Models/User');

class CheckUserRoleMiddleware {
  async handle ({ auth, response }, next, allowedRoles) {
    // Get the authenticated user
    const user = await auth.getUser();

    // Retrieve the user's role from the database
    const userDetails = await User.query().where('id', user.id).first();

    if (!userDetails) {
        return response.status(403).json({ error: 'Unauthorized' });
    }

    // Continue with the next middleware or controller
    await next();
  }
}

module.exports = CheckUserRoleMiddleware
