import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../core/ApiError';
import { Types } from 'mongoose';
import Logger from '../core/Logger';

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid');
    return value;
  }, 'Object Id Validation');

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes('://')) return helpers.error('any.invalid');
    return value;
  }, 'Url Endpoint Validation');

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid');
    if (!value.split(' ')[1]) return helpers.error('any.invalid');
    return value;
  }, 'Authorization Header Validation');

export default (
  schema: Joi.AnySchema,
  source: ValidationSource = ValidationSource.BODY,
) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      Logger.info(`validating ${source}`);

      let dataToValidate: any;

      if (source === ValidationSource.HEADER) {
        // For headers, only validate the specific fields we care about
        dataToValidate = {
          authorization: req.headers.authorization || req.headers.Authorization
        };
        Logger.info(`Validating headers with: ${JSON.stringify(dataToValidate)}`);
      } else {
        dataToValidate = req[source];
      }

      const validationOptions = {
        allowUnknown: true, // Allow unknown fields
        abortEarly: false, // Return all errors
      };

      const { error } = schema.validate(dataToValidate, validationOptions);
      Logger.info(`Validation error: ${JSON.stringify(error)}`);

      if (!error) return next();

      const { details } = error;
      const message = details
        .map((i) => i.message.replace(/['"]+/g, ''))
        .join(',');

      next(new BadRequestError(message));
    } catch (error) {
      next(error);
    }
  };
