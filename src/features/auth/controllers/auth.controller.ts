import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { AuthService } from '../services/auth.service';
import { AuthValidation } from '../validations/auth.validation';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
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
    }),
  ];

  loginAgent = [
    validator(AuthValidation.agentLogin, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new LoginAgentDTO(req.body);
      const agent = await this.service.loginAgent(data);
      const token = await this.service.generateToken(agent);

      new SuccessResponse('Agent logged in successfully', {
        agent,
        token,
      }).send(res);
    }),
  ];
}
