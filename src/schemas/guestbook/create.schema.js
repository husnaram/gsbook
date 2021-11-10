const Joi = require('joi');

const createGuestbookSchema = Joi.object({
	message: Joi
		.string()
		.empty()
		.required()
});

module.exports = createGuestbookSchema;
