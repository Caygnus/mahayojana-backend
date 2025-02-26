import express from 'express';
import otpRoutes from '../../features/otp/routes/otp.routes';
import authRoutes from '../../features/auth/routes/auth.routes';

const router = express.Router();

router.use('/otp', otpRoutes);

router.use('/auth', authRoutes);

export default router;
