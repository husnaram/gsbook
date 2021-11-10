const sql = require('sql-template-strings');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');

const User = require('./users');

module.exports = {
	async create(message, userId) {
		try {
			const { rows } = await db.query(sql`
			INSERT INTO guestbooks (id, message, user_id)
			VALUES(${uuidv4()}, ${message}, ${userId})
			RETURNING id, message, user_id, created_at;
			`);

			const [guestbook] = rows;
			return guestbook;
		} catch (error) {
			if (error.constraint === 'guestbooks_user_id_fkey') {
				return null;
			}

			throw error;
		}
	},
	async findAll() {
		const { rows } = await db.query(sql`
		SELECT id, message, user_id, created_at
		FROM guestbooks;
		`);

		return rows;
	},
	async find(id) {
		const { rows } = await db.query(sql`
		SELECT id, message, user_id, created_at
		FROM guestbooks WHERE id=${id}
		FETCH FIRST ROW ONLY;
		`);
		console.log(rows);

		return rows[0];
	},
	async delete(id) {
		const { rowCount } = await db.query(sql`
    DELETE FROM guestbooks
    WHERE id=${id};
    `);
    
		return rowCount;
	}
}