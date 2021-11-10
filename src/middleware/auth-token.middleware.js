const jwt = require('jsonwebtoken');

const authToken = (request, response, next) => {
	const authHeader = request.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) {
		return response
			.sendStatus(401);
	}

	jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
		if (error) {
			return response
				.sendStatus(403);
		}

		request.user = user;
		next();
	});
}

module.exports = authToken;