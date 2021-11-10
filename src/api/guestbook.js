const { Router } = require('express');
const { validate } = require('uuid');

const Guestbook = require('../persistence/guestbooks');
const createGuestbookValidator = require('../middleware/guestbook/create.validator');
const ownerAuth = require('../middleware/guestbook/owner.middleware');
const authToken = require('../middleware/auth-token.middleware');

const router = new Router();

router.post('/', [authToken, createGuestbookValidator], async (request, response) => {
	try {
		const { message } = request.body;
		const { user } = request;

		const guestbook = await Guestbook.create(message, user.id);

		return response
			.status(201)
			.json(guestbook);
	} catch (error) {
		console.error(
			`Guestbook - create({ message: ${request.body.message} }) >> Error: ${error.stack}`
		);

		response.sendStatus(500);
	}
});

router.get('/', async (request, response) => {
	try {
		const guestbooks = await Guestbook.findAll();

		return response
			.status(200)
			.json(guestbooks);
	} catch (error) {
		console.error(
			`Guestbook - findAll() >> Error ${error.stack}`
		);

		response.sendStatus(500);
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

		const guestbook = await Guestbook.find(id);

		if (!guestbook) {
			return response
				.status(401)
				.json({
					message: `Guestbook #${id} not found`
				})
		}

		return response
			.status(200)
			.json(guestbook);
	} catch (error) {
		console.error(
			`Guestbook - find() >> Error ${error.stack}`
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

		const guestbook = await Guestbook.delete(id);
		if (guestbook < 1) {
			return response
				.status(401)
				.json({
					message: `Guestbook #${id} not found`
				})
		}

		response
			.status(200)
			.json({
				message: 'success'
			})
	} catch (error) {
		console.error(
			`Guestbook - delete() >> Error ${error.stack}`
		);

		response.sendStatus(500);
	}
});

module.exports = router;