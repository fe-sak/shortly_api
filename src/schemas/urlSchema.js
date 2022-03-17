import Joi from 'joi';
import urlRegEx from '../utils/urlRegEx.js';

const urlSchema = Joi.object({
  url: Joi.string().pattern(urlRegEx).required(),
});

export default urlSchema;
