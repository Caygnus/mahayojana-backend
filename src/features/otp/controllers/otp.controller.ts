import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import { OtpService } from '../services/otp.service';
import { CreateOtpDTO } from '../dtos/create-otp.dto';
import { OtpValidation } from '../validations/otp.validation';
import { SuccessMsgResponse } from '../../../core/ApiResponse';
export class OtpController {
  private service: OtpService;

  constructor() {
    this.service = new OtpService();
  }

  create = [
    validator(OtpValidation.create),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreateOtpDTO(req.body);
      await this.service.createOtp(data);

      new SuccessMsgResponse('Otp sent successfully').send(res);
    })
  ];
  

}