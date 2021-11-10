const { validate } = require('uuid');

const updateSchema = require('../../schemas/user/update.schema');

const updateValidator = async (request, response, next) => {
	const { id } = request.params;
	const { body } = request;

	if (!validate(id)) {
		return response
			.status(400)
			.json({
				message: 'id must be uuid.'
			});
	}

	const { error } = updateSchema.validate(body);
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

module.exports = updateValidator;
