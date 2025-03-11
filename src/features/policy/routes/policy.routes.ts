import { Router } from 'express';
import { PolicyController } from '../controllers/policy.controller';

const router = Router();
const controller = new PolicyController();

export default router;
