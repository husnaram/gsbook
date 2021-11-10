const Guestbook = require('../../persistence/guestbooks');

const ownerAuth = async (request, response, next) => {
	const userId = request.user.id;
	const guestbookId = request.params.id;

	const guestbook = await Guestbook.find(guestbookId);
	if (!guestbook) {
		return response
			.status(401)
			.json({
				message: `Guestbook #${id} not found`
			})
	}

	if (guestbook.user_id !== userId) {
		return response.sendStatus(401);
	}

	next();
}

module.exports = ownerAuth;