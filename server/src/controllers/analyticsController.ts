import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';

export const overview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalBatches = await prisma.batch.count();
    const activeBatches = await prisma.batch.count({
      where: { status: 'ACTIVE' }
    });

    const totalIotNodes = await prisma.ioTNode.count();
    const iotNodesOnline = await prisma.ioTNode.count({
      where: { status: 'ONLINE' }
    });

    const activeAlerts = await prisma.alert.count({
      where: { acknowledged: false }
    });

    const verifiedBlockchainEvents = await prisma.blockchainEvent.count({
      where: { status: 'VERIFIED' }
    });

    res.json({
      activeBatches,
      totalBatches,
      iotNodesOnline,
      totalIotNodes,
      activeAlerts,
      verifiedBlockchainEvents
    });
  } catch (error) {
    next(error);
  }
};

export const batchAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batches = await prisma.batch.groupBy({
      by: ['currentStage'],
      _count: true
    });

    const stages = ['FARM', 'COLLECTION', 'PROCESSING', 'WAREHOUSE', 'TRANSPORT', 'RETAIL'];
    const formattedBatches = stages.map(stage => {
      const match = batches.find(b => b.currentStage === stage);
      return { stage, count: match ? match._count : 0 };
    });

    res.json({ batchesByStage: formattedBatches });
  } catch (error) {
    next(error);
  }
};

export const iotAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nodes = await prisma.ioTNode.groupBy({
      by: ['status'],
      _count: true
    });

    res.json({ nodesByStatus: nodes });
  } catch (error) {
    next(error);
  }
};

export const alertAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const severityCount = await prisma.alert.groupBy({
      by: ['severity'],
      _count: true
    });

    const typeCount = await prisma.alert.groupBy({
      by: ['type'],
      _count: true
    });

    res.json({ severityCount, typeCount });
  } catch (error) {
    next(error);
  }
};
