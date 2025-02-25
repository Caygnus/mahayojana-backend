import { Router } from 'express';
import { OtpController } from '../controllers/otp.controller';

const router = Router();

const controller = new OtpController();

router.post('/', controller.create);



export default router;