import Joi from 'joi';

export class OtpValidation {
  static create = Joi.object({
    phone: Joi.string().required(),
  });

  static login = Joi.object({
    phone: Joi.string().required(),
    otp: Joi.string().required(),
  });
}
