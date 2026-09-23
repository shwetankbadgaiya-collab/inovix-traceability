import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as qrController from '../controllers/qrController.js';

const router = express.Router();

router.use(authenticate);

router.post('/generate/:batchId', qrController.generate);
router.get('/:batchId', qrController.getQR);

export default router;
