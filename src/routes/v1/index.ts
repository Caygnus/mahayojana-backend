import express from 'express';
import otpRoutes from '../../features/otp/routes/otp.routes';

const router = express.Router();

router.use('/otp', otpRoutes);

export default router;
