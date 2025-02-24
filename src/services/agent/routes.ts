import { Router } from 'express';
import { container } from 'tsyringe';
import { AgentController } from './controllers/agent.controller';
import { authMiddleware } from '../../interfaces/http/middlewares/auth.middleware';
import { asyncHandler } from '../../utils/async-handler';

const router = Router();
const agentController = container.resolve(AgentController);

// Auth routes
router.post('/signup', asyncHandler(agentController.initiateSignup.bind(agentController)));
router.post('/signup/verify', asyncHandler(agentController.verifySignupOTP.bind(agentController)));
router.post('/login', asyncHandler(agentController.initiateLogin.bind(agentController)));
router.post('/login/verify', asyncHandler(agentController.verifyLoginOTP.bind(agentController)));

// Protected routes
router.use(authMiddleware(['agent']));
router.get('/profile', asyncHandler(agentController.getProfile.bind(agentController)));
router.put('/profile', asyncHandler(agentController.updateProfile.bind(agentController)));

export default router; 