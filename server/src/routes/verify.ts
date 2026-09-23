import express from 'express';
import * as verifyController from '../controllers/verifyController.js';

const router = express.Router();

router.get('/:token', verifyController.verifyBatch);

export default router;
