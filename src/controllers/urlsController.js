import { v4 as uuid } from 'uuid';
import { connection } from '../database.js';

export async function shortenUrl(req, res) {
  const { id: userId } = res.locals.user;

  const { url: longUrl } = req.body;
  try {
    const {
      rows: [longUrlExists],
    } = await connection.query(
      `SELECT * FROM urls WHERE "userId"=$1 AND "longUrl"=$2`,
      [userId, longUrl]
    );
    if (longUrlExists)
      return res
        .status(409)
        .send(`Url já cadastrada! shortUrl: ${longUrlExists.shortUrl}`);

    const shortUrl = uuid().slice(0, 6);

    await connection.query(
      `
    INSERT INTO
      urls ("userId", "longUrl", "shortUrl")
    VALUES
      ($1, $2, $3);`,
      [userId, longUrl, shortUrl]
    );
    res.status(201).send({ shortUrl });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
