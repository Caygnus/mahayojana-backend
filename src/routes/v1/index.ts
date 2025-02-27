import express from 'express';
import otpRoutes from '../../features/otp/routes/otp.routes';
import authRoutes from '../../features/auth/routes/auth.routes';
import policiesRoutes from '../../features/policies/routes/policies.routes';

const router = express.Router();

router.use('/otp', otpRoutes);

router.use('/auth', authRoutes);

router.use('/policies', policiesRoutes);

export default router;
