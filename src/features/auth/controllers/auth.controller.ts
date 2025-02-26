import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { AuthService } from '../services/auth.service';
import { AuthValidation } from '../validations/auth.validation';
import { CreateAgentDTO } from '../dtos/agent.dto';
import { SuccessResponse } from '../../../core/ApiResponse';
export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  signupAgent = [
    validator(AuthValidation.agentSignup, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreateAgentDTO(req.body);
      console.log(data);
      const result = await this.service.signupAgent(data);
      new SuccessResponse('Agent created successfully', result).send(res);
    })
  ];

}