const express = require('express');

const { Router } = express;
const router = new Router();

const auth = require('./auth');
const user = require('./user');
const guestbook = require('./guestbook');

router.use('/api/auth', auth);
router.use('/api/users', user);
router.use('/api/guestbooks', guestbook);

module.exports = router;
