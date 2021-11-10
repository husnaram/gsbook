const db = require('../persistence/db');

module.exports.up = async function (next) {
  const client = await db.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS guestbooks (
      id uuid PRIMARY KEY,
      message text,
      user_id uuid NOT NULL,
      updated_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT (now())
    )
  `);

  await client.query(`
    ALTER TABLE "guestbooks"
    ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id")
    ON DELETE CASCADE;
  `);

  await client.release(true);
  next()
}

module.exports.down = async function (next) {
  const client = await db.connect();

  await client.query(`
    DROP TABLE guestbooks;
  `);

  await client.release(true);
  next()
}
