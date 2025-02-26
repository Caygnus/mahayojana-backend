import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();
const controller = new AuthController();

router.post('/signup-agent', controller.signupAgent);
// router.post('/login-agent', controller.loginAgent);

export default router;