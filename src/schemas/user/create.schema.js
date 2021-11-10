const Joi = require('joi');

const createSchema = Joi.object({
	email: Joi
		.string()
		.email()
		.empty()
		.required(),
	full_name: Joi
		.string()
		.empty()
		.required(),
	password: Joi
		.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
		.empty()
		.required(),
});

module.exports = createSchema;
