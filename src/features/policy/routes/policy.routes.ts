import { Router } from 'express';
import { PolicyController } from '../controllers/policy.controller';

const router = Router();
const controller = new PolicyController();

router.post('/', controller.create);
router.get('/:id', controller.findById);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.list);

export default router;