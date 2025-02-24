import { injectable } from 'tsyringe';
import { IAgentService } from '../../../domain/interfaces/services/agent.service.interface';
import { Agent } from '../../../core/entities/agent.entity';
import { AgentSignupDTO } from '../../../domain/dto/agent/agent-signup.dto';
import { VerifyOTPDTO } from '../../../domain/dto/agent/verify-otp.dto';
import { OTPPurpose } from '../../../core/entities/otp.entity';
import { AgentModel } from '../../../infrastructure/database/models/agent.model';
import { OTPModel } from '../../../infrastructure/database/models/otp.model';
import { JWTService } from '../../../infrastructure/security/jwt/jwt.service';
import { ApiError } from '../../../core/entities/api-error';

@injectable()
export class AgentService implements IAgentService {
    constructor(private jwtService: JWTService) { }

    async initiateSignup(signupData: AgentSignupDTO): Promise<{ message: string; requestId: string }> {
        // Check if agent already exists
        const existingAgent = await AgentModel.findOne({
            $or: [
                { phone: signupData.phone },
                { email: signupData.email },
                { aadharNumber: signupData.aadharNumber }
            ]
        });

        if (existingAgent) {
            throw new ApiError(400, 'Agent already exists with given phone, email, or Aadhar number');
        }

        // Generate and store OTP
        const requestId = await this.generateOTP(signupData.phone, OTPPurpose.SIGNUP);

        return {
            message: 'OTP sent successfully',
            requestId
        };
    }

    async verifySignupOTP(verifyData: VerifyOTPDTO): Promise<{ agent: Agent; token: string }> {
        const isValid = await this.verifyOTP(verifyData.phone, verifyData.code, verifyData.purpose);

        if (!isValid) {
            throw new ApiError(400, 'Invalid or expired OTP');
        }

        // Create new agent
        const agent = await AgentModel.create({
            ...verifyData,
            isVerified: true
        });

        // Generate JWT token
        const token = this.jwtService.generateToken({
            id: agent.id,
            phone: agent.phone,
            roles: ['agent']
        });

        return { agent, token };
    }

    async initiateLogin(phone: string): Promise<{ message: string; requestId: string }> {
        const agent = await this.getAgentByPhone(phone);

        if (!agent) {
            throw new ApiError(404, 'Agent not found');
        }

        if (!agent.isActive) {
            throw new ApiError(403, 'Agent account is inactive');
        }

        // Generate and store OTP
        const requestId = await this.generateOTP(phone, OTPPurpose.LOGIN);

        return {
            message: 'OTP sent successfully',
            requestId
        };
    }

    async verifyLoginOTP(verifyData: VerifyOTPDTO): Promise<{ agent: Agent; token: string }> {
        const isValid = await this.verifyOTP(verifyData.phone, verifyData.code, verifyData.purpose);

        if (!isValid) {
            throw new ApiError(400, 'Invalid or expired OTP');
        }

        const agent = await this.getAgentByPhone(verifyData.phone);

        if (!agent) {
            throw new ApiError(404, 'Agent not found');
        }

        // Update last login
        agent.lastLoginAt = new Date();
        await agent.save();

        // Generate JWT token
        const token = this.jwtService.generateToken({
            id: agent.id,
            phone: agent.phone,
            roles: ['agent']
        });

        return { agent, token };
    }

    async getAgentByPhone(phone: string): Promise<Agent | null> {
        return AgentModel.findOne({ phone });
    }

    async getAgentById(id: string): Promise<Agent | null> {
        return AgentModel.findById(id);
    }

    async updateAgent(id: string, data: Partial<Agent>): Promise<Agent> {
        const agent = await AgentModel.findByIdAndUpdate(id, data, { new: true });
        if (!agent) {
            throw new ApiError(404, 'Agent not found');
        }
        return agent;
    }

    async generateOTP(phone: string, purpose: OTPPurpose): Promise<string> {
        // Generate 6 digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry to 10 minutes
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        // Store OTP
        const otp = await OTPModel.create({
            phone,
            code,
            purpose,
            expiresAt
        });

        // TODO: Integrate with SMS service to send OTP
        console.log(`OTP for ${phone}: ${code}`);

        return otp.id;
    }

    async verifyOTP(phone: string, code: string, purpose: OTPPurpose): Promise<boolean> {
        const otp = await OTPModel.findOne({
            phone,
            code,
            purpose,
            isUsed: false,
            expiresAt: { $gt: new Date() }
        });

        if (!otp) {
            return false;
        }

        // Mark OTP as used
        otp.isUsed = true;
        await otp.save();

        return true;
    }
} 