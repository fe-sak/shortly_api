import bcrypt from 'bcrypt';
import { connection } from '../database.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query(
      'SELECT * FROM users WHERE email=$1',
      [user.email]
    );
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(
      `
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `,
      [user.name, user.email, passwordHash]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserUrls(req, res) {
  const { id: userId } = req.params;
  try {
    const {
      rows: [userExists],
    } = await connection.query(`SELECT * FROM users WHERE id=$1`, [userId]);
    if (!userExists) return res.sendStatus(404);

    const {
      rows: [user],
    } = await connection.query(
      `
      SELECT
        users.id AS id,
        users.name AS name,
        SUM(urls.views) AS "visitCount"
      FROM
        users
        LEFT JOIN urls ON users.id = urls."userId"
      WHERE
        users.id = $1
      GROUP BY
        users.id`,
      [userId]
    );

    const { rows: shortenedUrls } = await connection.query(
      `
      SELECT
        id,
        "shortUrl",
        "url",
        views AS "visitCount"
      FROM
        urls
      WHERE
        "userId" = $1`,
      [userId]
    );

    user.shortenedUrls = shortenedUrls;
    console.log(user);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
