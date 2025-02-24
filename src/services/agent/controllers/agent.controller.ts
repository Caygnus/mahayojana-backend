import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { AgentService } from '../services/agent.service';
import { AgentSignupDTO } from '../../../domain/dto/agent/agent-signup.dto';
import { VerifyOTPDTO } from '../../../domain/dto/agent/verify-otp.dto';
import { ApiError } from '../../../core/entities/api-error';

@injectable()
export class AgentController {
  constructor(private agentService: AgentService) {}

  async initiateSignup(req: Request, res: Response) {
    const signupData: AgentSignupDTO = req.body;
    
    // Basic validation
    if (!signupData.phone || !signupData.email || !signupData.aadharNumber) {
      throw new ApiError(400, 'Phone, email, and Aadhar number are required');
    }

    const result = await this.agentService.initiateSignup(signupData);
    res.json(result);
  }

  async verifySignupOTP(req: Request, res: Response) {
    const verifyData: VerifyOTPDTO = req.body;
    
    if (!verifyData.phone || !verifyData.code) {
      throw new ApiError(400, 'Phone and OTP code are required');
    }

    const result = await this.agentService.verifySignupOTP(verifyData);
    res.json(result);
  }

  async initiateLogin(req: Request, res: Response) {
    const { phone } = req.body;
    
    if (!phone) {
      throw new ApiError(400, 'Phone number is required');
    }

    const result = await this.agentService.initiateLogin(phone);
    res.json(result);
  }

  async verifyLoginOTP(req: Request, res: Response) {
    const verifyData: VerifyOTPDTO = req.body;
    
    if (!verifyData.phone || !verifyData.code) {
      throw new ApiError(400, 'Phone and OTP code are required');
    }

    const result = await this.agentService.verifyLoginOTP(verifyData);
    res.json(result);
  }

  async getProfile(req: Request, res: Response) {
    const agentId = req.user?.id;
    
    if (!agentId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const agent = await this.agentService.getAgentById(agentId);
    
    if (!agent) {
      throw new ApiError(404, 'Agent not found');
    }

    res.json(agent);
  }

  async updateProfile(req: Request, res: Response) {
    const agentId = req.user?.id;
    
    if (!agentId) {
      throw new ApiError(401, 'Unauthorized');
    }

    const updateData = req.body;
    const agent = await this.agentService.updateAgent(agentId, updateData);
    res.json(agent);
  }
} 