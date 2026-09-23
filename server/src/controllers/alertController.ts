import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, severity, acknowledged, batchId, nodeId } = req.query;
    
    const where: any = {};
    if (type) where.type = type;
    if (severity) where.severity = severity;
    if (acknowledged !== undefined) where.acknowledged = acknowledged === 'true';
    if (batchId) where.batchId = batchId;
    if (nodeId) where.nodeId = nodeId;

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: { select: { id: true, product: true, currentStage: true } },
        node: { select: { id: true, status: true, locationLabel: true } }
      }
    });

    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await prisma.alert.count();
    const critical = await prisma.alert.count({ where: { severity: 'CRITICAL' } });
    const warning = await prisma.alert.count({ where: { severity: 'WARNING' } });
    const info = await prisma.alert.count({ where: { severity: 'INFO' } });
    const unacknowledged = await prisma.alert.count({ where: { acknowledged: false } });

    res.json({ total, critical, warning, info, unacknowledged });
  } catch (error) {
    next(error);
  }
};

export const acknowledge = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const alert = await prisma.alert.update({
      where: { id },
      data: { acknowledged: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ALERT_ACKNOWLEDGE',
        entity: 'Alert',
        entityType: 'Alert',
        entityId: id,
        details: JSON.stringify({ alertId: id })
      }
    });

    res.json(alert);
  } catch (error) {
    next(error);
  }
};

export const resolve = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    const alert = await prisma.alert.update({
      where: { id },
      data: { resolvedAt: new Date(), acknowledged: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'ALERT_RESOLVE',
        entity: 'Alert',
        entityType: 'Alert',
        entityId: id,
        details: JSON.stringify({ alertId: id })
      }
    });

    res.json(alert);
  } catch (error) {
    next(error);
  }
};
