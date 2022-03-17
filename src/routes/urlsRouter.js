import { Router } from 'express';
import { shortenUrl } from '../controllers/urlsController.js';
import { validateSchemaMiddleware } from '../middlewares/validateSchemaMiddleware.js';
import { validateTokenMiddleware } from '../middlewares/validateTokenMiddleware.js';
import urlSchema from '../schemas/urlSchema.js';

const urlsRouter = Router();

urlsRouter.post(
  '/urls/shorten',
  validateTokenMiddleware,
  validateSchemaMiddleware(urlSchema),
  shortenUrl
);

export default urlsRouter;
