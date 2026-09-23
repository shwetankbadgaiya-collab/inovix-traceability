import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import * as iotController from '../controllers/iotController.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

const readingSchema = z.object({
  nodeId: z.string(),
  temperature: z.number(),
  humidity: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  battery: z.number()
});

router.use(authenticate);

router.get('/nodes', iotController.listNodes);
router.get('/nodes/:id', iotController.getNode);
router.get('/nodes/:id/readings', iotController.getReadings);
router.post('/readings', authorize('ADMIN'), validate(readingSchema), iotController.ingestReading);
router.post('/simulate', authorize('ADMIN'), iotController.toggleSimulator);

export default router;
