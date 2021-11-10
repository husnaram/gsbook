const createGuestbookSchema = require('../../schemas/guestbook/create.schema');

const createGuestbookValidator = async (request, response, next) => {
	const { body } = request;
	const { error } = createGuestbookSchema.validate(body);
	const valid = error == null;

	if (valid) {
		next()
	} else {
		const { details } = error;
		const message = details.map(i => i.message).join(',');

		response
			.status(422)
			.json({
				error: message
			})
	}
}

module.exports = createGuestbookValidator;
