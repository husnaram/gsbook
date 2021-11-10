const Joi = require('joi');

const updateSchema = Joi.object({
	email: Joi
		.string()
		.email(),
	full_name: Joi
		.string(),
	password: Joi
		.string()
		.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
});

module.exports = updateSchema;
