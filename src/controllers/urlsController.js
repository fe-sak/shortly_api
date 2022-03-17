import { v4 as uuid } from 'uuid';
import { connection } from '../database.js';

export async function listUrls(req, res) {
  const { id: urlId } = req.params;
  try {
    const {
      rows: [url],
    } = await connection.query(`SELECT * FROM urls WHERE id=$1`, [urlId]);

    if (!url) {
      return res.sendStatus(404);
    }

    delete url.userId;
    return res.status(200).send(url);
  } catch (error) {
    return res.sendStatus(500);
  }
}

export async function shortenUrl(req, res) {
  const { id: userId } = res.locals.user;

  const { url } = req.body;
  try {
    const {
      rows: [urlExists],
    } = await connection.query(
      `SELECT * FROM urls WHERE "userId"=$1 AND "url"=$2`,
      [userId, url]
    );
    if (urlExists)
      return res
        .status(409)
        .send(`Url já cadastrada! shortUrl: ${urlExists.shortUrl}`);

    const shortUrl = uuid().slice(0, 8);

    await connection.query(
      `
    INSERT INTO
      urls ("userId", "url", "shortUrl")
    VALUES
      ($1, $2, $3);`,
      [userId, url, shortUrl]
    );
    res.status(201).send({ shortUrl });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
