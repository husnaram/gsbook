const createSchema = require('../../schemas/user/create.schema');

const createValidator = async (request, response, next) => {
	const { body } = request;
	const { error } = createSchema.validate(body);
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

module.exports = createValidator;
