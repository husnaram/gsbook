const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY,
      email text UNIQUE NOT NULL,
      full_name text NOT NULL,
      password text NOT NULL,
      updated_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT (now())
    );
  `);

  await client.query(`
    CREATE INDEX users_email on users (email);
  `);

  await client.release(true);
  next();
};

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TABLE users;
  `);

  await client.release(true);
  next();
};
