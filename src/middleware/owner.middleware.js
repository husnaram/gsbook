const User = require('../persistence/users');

const ownerAuth = async (request, response, next) => {
	const userLoginId = request.user.id;
	const userParamId = request.params.id;

	const user = await User.findById(userParamId);
	if (!user) {
		return response
			.status(404)
			.json({
				message: `User #${userParamId} not found`
			})
	}
	if (user.id !== userLoginId) {
		return response.sendStatus(401);
	}

	next();
}

module.exports = ownerAuth;