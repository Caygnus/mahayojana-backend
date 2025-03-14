import express from 'express';
import otpRoutes from '../../features/otp/routes/otp.routes';
import authRoutes from '../../features/auth/routes/auth.routes';
import policyRoutes from '../../features/policy/routes/policy.routes';

const router = express.Router();

router.use('/otp', otpRoutes);

router.use('/auth', authRoutes);
router.use('/policy', policyRoutes);

export default router;
