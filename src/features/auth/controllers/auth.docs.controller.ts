import { Route, Tags, Post, Body, Response } from 'tsoa';
import { CreateAgentDTO, LoginAgentDTO } from '../dtos/agent.dto';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dto';

@Route('auth')
@Tags('Auth')
export class AuthDocsController {
    /**
     * Register a new agent
     */
    @Post('signup-agent')
    @Response(201, 'Agent created successfully')
    public async signupAgent(@Body() data: CreateAgentDTO): Promise<any> {
        return {} as any; // This is just for documentation
    }

    /**
     * Login an existing agent
     */
    @Post('login-agent')
    @Response(200, 'Agent logged in successfully')
    public async loginAgent(@Body() data: {
        phone: string;
        otp: string;
    }): Promise<any> {
        return {} as any; // This is just for documentation
    }

    /**
     * Register a new user
     */
    @Post('signup-user')
    @Response(201, 'User created successfully')
    public async signupUser(@Body() data: CreateUserDTO): Promise<any> {
        return {} as any; // This is just for documentation
    }

    /**
     * Login an existing user
     */
    @Post('login-user')
    @Response(200, 'User logged in successfully')
    public async loginUser(@Body() data: LoginUserDTO): Promise<any> {
        return {} as any; // This is just for documentation
    }
} 