import Joi from 'joi';

export class OtpValidation {
  static create = Joi.object({
    phone: Joi.string().required(),
  });
}