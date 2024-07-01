import Joi from "joi";


export const validationSchema = Joi.object({
  VERSION: Joi.number().default(1),
  PROJECT_NAME: Joi.string().required(),
  PORT: Joi.number().default(3000),
  STAGE: Joi.string().required(),
  LOG_PATH: Joi.string().required().default('/opt/logs'),
  ALLOWED_URL: Joi.string().required(),
  DB_URL: Joi.string().required(),
  DB_LOGGING: Joi.string().required(),
  ENABLE_DB_LOGGING: Joi.string().required(),
  BASIC_USER: Joi.string().required(),
  BASIC_PASS: Joi.string().required(),
});
