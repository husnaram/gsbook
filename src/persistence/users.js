const sql = require('sql-template-strings');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const db = require('./db');

const queryUserUpdate = (id, cols) => {
  const query = ['UPDATE users'];
  query.push('SET');

  const set = [];
  Object.keys(cols).forEach(function (key, i) {
    set.push(key + ' = ($' + (i + 1) + ')'); 
  });
  query.push(set.join(', ') + ',');

  query.push('updated_at = now()')
  query.push('WHERE id = ' + `'${id}'`);
  query.push('RETURNING id, email, full_name, updated_at, created_at;')

  return query.join(' ');
}

module.exports = {
  async create(email, fullname, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const { rows } = await db.query(sql`
      INSERT INTO users (id, email, full_name, password)
        VALUES (${uuidv4()}, ${email}, ${fullname}, ${hashedPassword})
        RETURNING id, email, full_name, created_at;
      `);

      const [user] = rows;
      return user;
    } catch (error) {
      if (error.constraint === 'users_email_key') {
        return null;
      }

      throw error;
    }
  },
  async findAll() {
    const { rows } = await db.query(sql`
      SELECT id, email, full_name, updated_at, created_at
      FROM users;
    `);

    return rows;
  },
  async findUserGuestbooks(userId) {
    const { rows } = await db.query(sql`
      SELECT guestbooks.id, email, full_name, user_id, message, guestbooks.created_at
      FROM guestbooks
      JOIN users ON (guestbooks.user_id = users.id)
      WHERE users.id=${userId};
    `);

    return rows;
  },
  async findById(id) {
    const { rows } = await db.query(sql`
    SELECT id, email, full_name, updated_at, created_at
    FROM users WHERE id=${id}
    FETCH FIRST ROW ONLY;
    `);

    return rows[0];
  },
  async findByEmail(email) {
    const { rows } = await db.query(sql`
    SELECT id, email, full_name, password
    FROM users WHERE email=${email}
    FETCH FIRST ROW ONLY;
    `);
    
    return rows[0];
  },
  async update(id, fields) {
    const query = queryUserUpdate(id, fields);

    // Turn fields into an array of values
    const colValues = Object.keys(fields).map((key) => {
      return fields[key];
    });
    if (!colValues.length) {
      return {};
    }

    const row = db
      .query(query, colValues)
      .then(res => {
        return res.rows[0];
      })
      .catch(e => console.error(e.stack));

    return row;
  },
  async delete(id) {
    const { rowCount } = await db.query(sql`
    DELETE FROM users
    WHERE id=${id};
    `);
    
    return rowCount;
  }
};
