import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/signup-agent', controller.signupAgent);

router.post('/login-agent', controller.loginAgent);

router.post('/signup-user', controller.signupUser);

router.post('/login-user', controller.loginUser);

export default router;
