import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';

export const listEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { batchId, status, eventType } = req.query;

    const where: any = {};
    if (batchId) where.batchId = batchId;
    if (status) where.status = status;
    if (eventType) where.eventType = eventType;

    const events = await prisma.blockchainEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        batch: {
          select: { product: true, currentStage: true }
        }
      }
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const event = await prisma.blockchainEvent.findUnique({
      where: { id },
      include: {
        batch: true
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const total = await prisma.blockchainEvent.count();
    const verified = await prisma.blockchainEvent.count({ where: { status: 'VERIFIED' } });
    const pending = await prisma.blockchainEvent.count({ where: { status: 'PENDING' } });

    res.json({ total, verified, pending });
  } catch (error) {
    next(error);
  }
};
