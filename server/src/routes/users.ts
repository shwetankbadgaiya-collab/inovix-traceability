import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import * as userController from '../controllers/userController.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = express.Router();

router.use(authenticate);

const updateUserSchema = z.object({
  name: z.string().optional(),
  organization: z.string().optional(),
  location: z.string().optional()
});

router.get('/', authorize('ADMIN', 'REGULATOR'), userController.list);
router.get('/:id', userController.getUser);
router.put('/:id', validate(updateUserSchema), userController.updateUser);

export default router;
