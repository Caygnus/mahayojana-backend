import { Agent } from '../../../core/entities/agent.entity';
import { AgentSignupDTO } from '../../dto/agent/agent-signup.dto';
import { VerifyOTPDTO } from '../../dto/agent/verify-otp.dto';
import { OTPPurpose } from '../../../core/entities/otp.entity';

export interface IAgentService {
    // Registration flow
    initiateSignup(signupData: AgentSignupDTO): Promise<{ message: string; requestId: string }>;
    verifySignupOTP(verifyData: VerifyOTPDTO): Promise<{ agent: Agent; token: string }>;

    // Login flow
    initiateLogin(phone: string): Promise<{ message: string; requestId: string }>;
    verifyLoginOTP(verifyData: VerifyOTPDTO): Promise<{ agent: Agent; token: string }>;

    // Agent management
    getAgentByPhone(phone: string): Promise<Agent | null>;
    getAgentById(id: string): Promise<Agent | null>;
    updateAgent(id: string, data: Partial<Agent>): Promise<Agent>;

    // OTP management
    generateOTP(phone: string, purpose: OTPPurpose): Promise<string>;
    verifyOTP(phone: string, code: string, purpose: OTPPurpose): Promise<boolean>;
} 