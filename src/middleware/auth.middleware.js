const bcrypt = require('bcrypt');

const loginSchema = require('../schemas/login.schema');
const User = require('../persistence/users');

const loginAuth = async (request, response, next) => {
  try {
    const { body } = request;
    const { error } = loginSchema.validate(body);
    const valid = error == null;

    if (!valid) {
      const { details } = error;
      const message = details.map(i => i.message).join(',');

      response
        .status(422)
        .json({
          error: message
        })
    }

    const user = await User.findByEmail(body.email);
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return response
        .status(401)
        .json({
          message: 'Check again your email or password'
        });
    }

    request.user = user;
    next();
  } catch (error) {
    console.error(
      `AuthMiddleware(${request.session.id}) >> Error: ${error.stack}`
    );
    return response.sendStatus(500);
  }
};

module.exports = loginAuth;
