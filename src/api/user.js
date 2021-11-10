const { Router } = require('express');
const { validate } = require('uuid');
const Joi = require('joi');

const User = require('../persistence/users');
const updateValidator = require('../middleware/user/update.validator');
const createValidator = require('../middleware/user/create.validator');
const ownerAuth = require('../middleware/owner.middleware');
const authToken = require('../middleware/auth-token.middleware');

const router = new Router();

router.post('/', createValidator, async (request, response) => {
  try {
    const { email, full_name, password } = request.body;
    const fullName = full_name;

    const user = await User.create(email, fullName, password);
    if (!user) {
      return response.status(400).json({ message: 'User already exists' });
    }

    return response
      .status(201)
      .json(user); // TODO: add response filed such as status, code, data (for wrap the data)
  } catch (error) {
    console.error(
      `User - create({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );

    response.sendStatus(500)
  }
});

router.get('/', async (request, response) => {
  try {
    const users = await User.findAll();
    
    return response
      .status(200)
      .json(users);
  } catch (error) {
    console.error(
      `User - findAll() >> Error ${error.stack}`
    );

    response.sendStatus(500)
  }
});

router.get('/:id/guestbooks', async (request, response) => {
  try {
    const { id } = request.params;
    if (!validate(id)) {
      return response
        .status(400)
        .json({
          message: 'id must be uuid.'
        });
    }

    const guestbooks = await User.findUserGuestbooks(id);
    if (!guestbooks) {
      return response
        .status(404)
        .json({
          message: `User #${id} not found`
        })
    }
    
    return response
      .status(200)
      .json(guestbooks);
  } catch (error) {
    console.error(
      `User - findUserGuestbooks() >> Error ${error.stack}`
    );

    response.sendStatus(500)
  }
});

router.get('/:id', async (request, response) => {
  try {
    const { id } = request.params;
    if (!validate(id)) {
      return response
        .status(400)
        .json({
          message: 'id must be uuid.'
        });
    }

    const user = await User.findById(id);

    if (!user) {
      return response
        .status(404)
        .json({
          message: `User #${id} not found`
        })
    }

    return response
      .status(200)
      .json(user);
  } catch (error) {
    console.error(
      `User - find() >> Error ${error.stack}`
    );

    response.sendStatus(500);
  }
});

router.patch('/:id', [updateValidator, authToken, ownerAuth], async (request, response) => {
  try {
    const { id } = request.params;
    const { body } = request;
    
    const user = await User.update(id, body);
    if (Object.keys(user).length === 0) {
      return response.sendStatus(204);
    }
    if (!user) {
      return response
        .status(404)
        .json({
          message: `User #${id} not found`
        })
    }

    response
      .status(200)
      .json({
        message: 'success'
      })
  } catch (error) {
    console.error(
      `User - update() >> Error ${error.stack}`
    );

    response.sendStatus(500);
  }
});

router.delete('/:id', [authToken, ownerAuth], async (request, response) => {
  try {
    const { id } = request.params;
    if (!validate(id)) {
      return response
        .status(400)
        .json({
          message: 'id must be uuid.'
        });
    }

    const user = await User.delete(id);
    if (user < 1) {
      return response
        .status(404)
        .json({
          message: `User #${id} not found`
        })
    }

    response
      .status(200)
      .json({
        message: 'success'
      })
  } catch (error) {
    console.error(
      `User - delete() >> Error ${error.stack}`
    );

    response.sendStatus(500);
  }
});

module.exports = router;
