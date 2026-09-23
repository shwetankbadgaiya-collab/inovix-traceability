import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';
import { anchorEvent } from '../services/blockchainService.js';
import { getIo } from '../websocket/socketHandler.js';
import { v4 as uuidv4 } from 'uuid';

export const list = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { stage, status, search } = req.query;
    const user = req.user!;

    const where: any = {};
    if (stage) where.currentStage = stage;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { id: { contains: String(search) } },
        { product: { contains: String(search) } },
        { crop: { contains: String(search) } }
      ];
    }

    if (user.role === 'FARMER') {
      where.farmerId = user.id;
    }

    const batches = await prisma.batch.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        farmer: {
          select: { name: true, organization: true }
        },
        iotNode: {
          select: { id: true, status: true, battery: true, connectivity: true }
        }
      }
    });

    res.json(batches);
  } catch (error) {
    next(error);
  }
};

export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { product, crop, quantity, unit, origin, farmName, description, iotNodeId } = req.body;
    const user = req.user!;

    // Generate batch ID
    const year = new Date().getFullYear();
    const lastBatch = await prisma.batch.findFirst({
      where: { id: { startsWith: `INV-${year}-` } },
      orderBy: { id: 'desc' }
    });

    let seq = 1;
    if (lastBatch) {
      const parts = lastBatch.id.split('-');
      if (parts.length >= 3) {
        seq = parseInt(parts[2], 10) + 1;
      }
    }

    const batchId = `INV-${year}-${seq.toString().padStart(3, '0')}`;
    const resolvedFarm = farmName || origin || `${user.organization || 'Primary Farm'}`;
    const resolvedLocation = origin || resolvedFarm;
    const qrToken = `tok-${batchId.toLowerCase()}-${uuidv4().substring(0, 8)}`;

    const batch = await prisma.batch.create({
      data: {
        id: batchId,
        farmerId: user.id,
        farmerName: user.name,
        farmName: resolvedFarm,
        product,
        crop: crop || product,
        quantity: parseFloat(quantity) || 1,
        unit: unit || 'kg',
        currentStage: 'FARM',
        currentLocation: resolvedLocation,
        status: 'ACTIVE',
        iotNodeId: iotNodeId || null,
        qrToken,
        description: description || null
      }
    });

    // Initial supply chain event
    const supplyChainEvent = await prisma.supplyChainEvent.create({
      data: {
        batchId: batch.id,
        stage: 'FARM',
        eventType: 'BATCH_CREATED',
        action: 'Batch registered and initialized at origin farm',
        location: resolvedLocation,
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        notes: description || 'Batch registered at source farm'
      }
    });

    // Anchor on dev blockchain
    await anchorEvent({
      batchId: batch.id,
      eventType: 'BATCH_CREATED',
      data: JSON.stringify({ product, crop: crop || product, quantity, unit, location: resolvedLocation }),
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role
    });

    // Create QR code entity
    await prisma.qRCode.create({
      data: {
        batchId: batch.id,
        token: qrToken,
        createdBy: user.id
      }
    });

    const io = getIo();
    if (io) {
      io.emit('batch:new', batch);
    }

    res.status(201).json({ batch, event: supplyChainEvent });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const batch = await prisma.batch.findUnique({
      where: { id },
      include: {
        farmer: { select: { name: true, organization: true, location: true, email: true } },
        iotNode: true,
        supplyChainEvents: {
          orderBy: { createdAt: 'asc' },
          include: { actor: { select: { name: true, role: true, organization: true } } }
        },
        blockchainEvents: {
          orderBy: { createdAt: 'desc' }
        },
        sensorReadings: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        alerts: {
          orderBy: { createdAt: 'desc' }
        },
        qrCode: true
      }
    });

    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    res.json(batch);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { quantity, unit, description, status } = req.body;
    const user = req.user!;

    const batch = await prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    if (user.role !== 'ADMIN' && batch.farmerId !== user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this batch' });
    }

    const updatedBatch = await prisma.batch.update({
      where: { id },
      data: {
        quantity: quantity !== undefined ? parseFloat(quantity) : undefined,
        unit: unit || undefined,
        description: description !== undefined ? description : undefined,
        status: status || undefined
      }
    });

    res.json(updatedBatch);
  } catch (error) {
    next(error);
  }
};

const STAGE_ORDER = ['FARM', 'COLLECTION', 'PROCESSING', 'WAREHOUSE', 'TRANSPORT', 'RETAIL'];
const ROLE_STAGE_MAP: Record<string, string[]> = {
  FARMER: ['FARM'],
  COLLECTION_CENTER: ['FARM', 'COLLECTION'],
  PROCESSOR: ['COLLECTION', 'PROCESSING'],
  WAREHOUSE: ['PROCESSING', 'WAREHOUSE'],
  LOGISTICS: ['WAREHOUSE', 'TRANSPORT'],
  RETAILER: ['TRANSPORT', 'RETAIL'],
  ADMIN: STAGE_ORDER
};

export const advanceStage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { location, notes, temperature, humidity } = req.body;
    const user = req.user!;

    const batch = await prisma.batch.findUnique({ where: { id } });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    const currentIdx = STAGE_ORDER.indexOf(batch.currentStage);
    if (currentIdx === -1 || currentIdx >= STAGE_ORDER.length - 1) {
      return res.status(400).json({ error: 'Batch has reached final supply chain stage' });
    }

    if (user.role !== 'ADMIN') {
      const allowedStages = ROLE_STAGE_MAP[user.role] || [];
      if (!allowedStages.includes(batch.currentStage)) {
        return res.status(403).json({ error: `Role ${user.role} is not authorized to transition from stage ${batch.currentStage}` });
      }
    }

    const nextStage = STAGE_ORDER[currentIdx + 1];
    const newLocation = location || batch.currentLocation;

    const updatedBatch = await prisma.batch.update({
      where: { id },
      data: {
        currentStage: nextStage,
        currentLocation: newLocation,
        status: nextStage === 'RETAIL' ? 'COMPLETED' : (nextStage === 'TRANSPORT' ? 'IN_TRANSIT' : 'ACTIVE')
      }
    });

    const scEvent = await prisma.supplyChainEvent.create({
      data: {
        batchId: batch.id,
        stage: nextStage,
        eventType: 'STAGE_TRANSFERRED',
        action: `Batch transitioned from ${batch.currentStage} to ${nextStage}`,
        location: newLocation,
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        temperature: temperature ? parseFloat(temperature) : undefined,
        humidity: humidity ? parseFloat(humidity) : undefined,
        notes: notes || `Advanced to ${nextStage} by ${user.name}`
      }
    });

    await anchorEvent({
      batchId: batch.id,
      eventType: 'STAGE_TRANSFERRED',
      data: JSON.stringify({ stage: nextStage, location: newLocation, handler: user.name, role: user.role }),
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role
    });

    const io = getIo();
    if (io) {
      io.emit('batch:update', updatedBatch);
      io.to(`batch_${batch.id}`).emit('batch:update', updatedBatch);
    }

    res.json({ batch: updatedBatch, event: scEvent });
  } catch (error) {
    next(error);
  }
};

export const getTimeline = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const events = await prisma.supplyChainEvent.findMany({
      where: { batchId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        actor: {
          select: { name: true, role: true, organization: true }
        }
      }
    });

    res.json(events);
  } catch (error) {
    next(error);
  }
};
