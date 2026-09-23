import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { getIo } from '../websocket/socketHandler.js';
import { checkReading } from '../services/alertEngine.js';
import * as iotSimulatorService from '../services/iotSimulatorService.js';

export const listNodes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const nodes = await prisma.ioTNode.findMany({
      orderBy: { id: 'asc' },
      include: {
        sensorReadings: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    res.json(nodes);
  } catch (error) {
    next(error);
  }
};

export const getNode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const node = await prisma.ioTNode.findUnique({
      where: { id },
      include: {
        sensorReadings: {
          orderBy: { createdAt: 'desc' },
          take: 50
        },
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!node) {
      return res.status(404).json({ error: 'Node not found' });
    }

    res.json(node);
  } catch (error) {
    next(error);
  }
};

export const getReadings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const readings = await prisma.sensorReading.findMany({
      where: { nodeId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    res.json(readings);
  } catch (error) {
    next(error);
  }
};

export const ingestReading = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nodeId, temperature, humidity, latitude, longitude, battery } = req.body;

    const node = await prisma.ioTNode.findUnique({ where: { id: nodeId } });
    if (!node) {
      return res.status(404).json({ error: 'IoT node not found' });
    }

    const reading = await prisma.sensorReading.create({
      data: {
        nodeId,
        batchId: node.batchId,
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        battery: parseFloat(battery)
      }
    });

    await prisma.ioTNode.update({
      where: { id: nodeId },
      data: {
        lastSeen: new Date(),
        battery: parseFloat(battery),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });

    const io = getIo();
    await checkReading(reading, io);

    if (io) {
      io.emit('sensor:update', reading);
      if (node.batchId) {
        io.to(`batch_${node.batchId}`).emit('sensor:update', reading);
      }
    }

    res.status(201).json(reading);
  } catch (error) {
    next(error);
  }
};

export const toggleSimulator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isRunning = iotSimulatorService.isRunning();
    const io = getIo();
    if (isRunning) {
      iotSimulatorService.stop();
      res.json({ message: 'IoT simulator stopped', status: 'stopped' });
    } else {
      if (!io) {
        return res.status(500).json({ error: 'WebSocket not initialized' });
      }
      iotSimulatorService.start(io);
      res.json({ message: 'IoT simulator started', status: 'running' });
    }
  } catch (error) {
    next(error);
  }
};
