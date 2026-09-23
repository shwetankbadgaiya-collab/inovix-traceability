import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as alertController from '../controllers/alertController.js';

const router = express.Router();

router.use(authenticate);

router.get('/', alertController.list);
router.get('/stats', alertController.getStats);
router.put('/:id/acknowledge', alertController.acknowledge);
router.put('/:id/resolve', alertController.resolve);

export default router;
