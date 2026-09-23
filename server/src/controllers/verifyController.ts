import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';

export const verifyBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.params.token as string;

    // Token could be the qrToken or directly the batchId for developer convenience
    let qrCode: any = await prisma.qRCode.findUnique({
      where: { token },
      include: {
        batch: {
          include: {
            farmer: {
              select: { organization: true, location: true } // Do not expose personal name/email/phone
            },
            supplyChainEvents: {
              orderBy: { createdAt: 'asc' },
              include: {
                actor: { select: { organization: true, role: true } }
              }
            },
            blockchainEvents: {
              orderBy: { createdAt: 'asc' }
            },
            sensorReadings: {
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    // If not found by token, try finding by batch ID directly
    let batch = qrCode?.batch;
    if (!batch) {
      batch = await prisma.batch.findUnique({
        where: { id: token },
        include: {
          farmer: {
            select: { organization: true, location: true }
          },
          supplyChainEvents: {
            orderBy: { createdAt: 'asc' },
            include: {
              actor: { select: { organization: true, role: true } }
            }
          },
          blockchainEvents: {
            orderBy: { createdAt: 'asc' }
          },
          sensorReadings: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }) as any;
    }

    if (!batch) {
      return res.status(404).json({ error: 'Invalid or expired verification token' });
    }

    const publicBatchData = {
      id: batch.id,
      product: batch.product,
      crop: batch.crop,
      quantity: batch.quantity,
      unit: batch.unit,
      currentStage: batch.currentStage,
      currentLocation: batch.currentLocation,
      origin: batch.farmName,
      status: batch.status,
      description: batch.description,
      createdAt: batch.createdAt,
      latestSensor: batch.sensorReadings?.[0] ? {
        temperature: batch.sensorReadings[0].temperature,
        humidity: batch.sensorReadings[0].humidity,
        timestamp: batch.sensorReadings[0].createdAt
      } : null
    };

    const journey = (batch.supplyChainEvents || []).map((e: any) => ({
      stage: e.stage,
      eventType: e.eventType,
      action: e.action,
      location: e.location,
      notes: e.notes,
      temperature: e.temperature,
      humidity: e.humidity,
      timestamp: e.createdAt,
      organization: e.actor?.organization,
      role: e.actor?.role,
      blockchainTxHash: e.blockchainTxHash
    }));

    const blockchainStatus = {
      total: (batch.blockchainEvents || []).length,
      verified: (batch.blockchainEvents || []).filter((e: any) => e.status === 'VERIFIED').length,
      events: (batch.blockchainEvents || []).map((e: any) => ({
        txHash: e.txHash,
        status: e.status,
        eventType: e.eventType,
        blockNumber: e.blockNumber,
        timestamp: e.createdAt
      }))
    };

    res.json({
      verified: true,
      batch: publicBatchData,
      journey,
      blockchainStatus
    });
  } catch (error) {
    next(error);
  }
};
