import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authenticate);

router.get('/overview', analyticsController.overview);
router.get('/batches', analyticsController.batchAnalytics);
router.get('/iot', analyticsController.iotAnalytics);
router.get('/alerts', analyticsController.alertAnalytics);

export default router;
