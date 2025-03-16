import { Router } from 'express';
import { ApplicationController } from '../controllers/application.controller';

const router = Router();
const controller = new ApplicationController();

router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/', controller.list);

export default router;
