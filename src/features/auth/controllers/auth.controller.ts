import { Request, Response } from 'express';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import { AuthService } from '../services/auth.service';
import { AuthValidation } from '../validations/auth.validation';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
import { SuccessResponse } from '../../../core/ApiResponse';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';

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

  signupUser = [
    validator(AuthValidation.userSignup, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new CreateUserDTO(req.body);
      const result = await this.service.signupUser(data);
      new SuccessResponse('User created successfully', result).send(res);
    }),
  ];

  loginUser = [
    validator(AuthValidation.userLogin, ValidationSource.BODY),
    asyncHandler(async (req: Request, res: Response) => {
      const data = new LoginUserDTO(req.body);
      const result = await this.service.loginUser(data);
      new SuccessResponse('User logged in successfully', result).send(res);
    }),
  ];
}
