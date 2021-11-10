const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../persistence/users');
const loginAuth = require('../middleware/auth.middleware');

const router = new Router();

router.post('/login', loginAuth, async (request, response) => {
  try {
    const { id, email } = request.user;

    const accessToken = jwt.sign(
      { id, email },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES }
    );

    response
      .status(201)
      .json({
        access_token: accessToken
      });
  } catch (error) {
    console.error(
      `POST session ({ email: ${request.body.email} }) >> ${error.stack})`
    );
    response.status(500).json();
  }
});

module.exports = router;
