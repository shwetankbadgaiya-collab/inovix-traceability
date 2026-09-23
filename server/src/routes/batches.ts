import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import * as batchController from '../controllers/batchController.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const createBatchSchema = z.object({
  product: z.string(),
  crop: z.string(),
  quantity: z.number(),
  unit: z.string(),
  origin: z.string(),
});

const updateBatchSchema = z.object({
  quantity: z.number().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
});

router.use(authenticate);

router.get('/', batchController.list);
router.post('/', authorize('FARMER', 'ADMIN'), validate(createBatchSchema), batchController.create);
router.get('/:id', batchController.getById);
router.put('/:id', validate(updateBatchSchema), batchController.update);
router.post('/:id/advance', batchController.advanceStage);
router.get('/:id/timeline', batchController.getTimeline);

export default router;
