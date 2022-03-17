import { Router } from 'express';
import { shortenUrl, listUrls } from '../controllers/urlsController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import { validateTokenMiddleware } from '../middlewares/validateTokenMiddleware.js';
import urlSchema from '../schemas/urlSchema.js';

const urlsRouter = Router();

urlsRouter.get('/urls/:id', listUrls);

urlsRouter.post(
  '/urls/shorten',
  validateTokenMiddleware,
  validateSchemaMiddleware(urlSchema),
  shortenUrl
);

export default urlsRouter;
