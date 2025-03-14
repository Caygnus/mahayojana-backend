import express from 'express';
import otpRoutes from '../../features/otp/routes/otp.routes';
import authRoutes from '../../features/auth/routes/auth.routes';
import applicationRoutes from '../../features/application/routes/application.routes';

const router = express.Router();

router.use('/otp', otpRoutes);

router.use('/auth', authRoutes);
router.use('/application', applicationRoutes);

export default router;
