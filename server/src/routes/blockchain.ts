import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as blockchainController from '../controllers/blockchainController.js';

const router = express.Router();

router.use(authenticate);

router.get('/events', blockchainController.listEvents);
router.get('/stats', blockchainController.getStats);
router.get('/events/:id', blockchainController.getEvent);

export default router;
