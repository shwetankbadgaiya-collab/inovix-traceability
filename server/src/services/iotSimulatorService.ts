import { Server } from 'socket.io';
import { prisma } from '../config/db.js';
import { ingestReading } from '../controllers/iotController.js';
import { config } from '../config/env.js';

let intervalRef: NodeJS.Timeout | null = null;
let ioInstance: Server | null = null;

export const start = (io: Server) => {
  if (intervalRef) return;
  ioInstance = io;
  intervalRef = setInterval(simulateReadings, config.iotSimulatorInterval);
};

export const stop = () => {
  if (intervalRef) {
    clearInterval(intervalRef);
    intervalRef = null;
  }
};

export const isRunning = () => {
  return intervalRef !== null;
};

const simulateReadings = async () => {
  try {
    const nodes = await prisma.ioTNode.findMany({
      where: { status: 'ONLINE', batchId: { not: null } },
      include: {
        sensorReadings: { orderBy: { createdAt: 'desc' }, take: 1 }
      }
    });

    for (const node of nodes) {
      const lastReading = node.sensorReadings[0];
      const baseTemp = lastReading ? lastReading.temperature : 22;
      const baseHumidity = lastReading ? lastReading.humidity : 50;

      const newTemp = Math.max(15, Math.min(38, baseTemp + (Math.random() * 1.6 - 0.75)));
      const newHumidity = Math.max(30, Math.min(85, baseHumidity + (Math.random() * 3 - 1.5)));
      const newBattery = Math.max(1, node.battery - (Math.random() * 0.05 + 0.01));

      // Re-use controller logic to save reading, check alert engine, and broadcast via websocket
      const req = {
        body: {
          nodeId: node.id,
          temperature: parseFloat(newTemp.toFixed(2)),
          humidity: parseFloat(newHumidity.toFixed(2)),
          latitude: node.latitude + (Math.random() * 0.0004 - 0.0002),
          longitude: node.longitude + (Math.random() * 0.0004 - 0.0002),
          battery: parseFloat(newBattery.toFixed(1))
        }
      } as any;

      const res = {
        status: () => res,
        json: () => {}
      } as any;

      const next = (err: any) => console.error('Simulation error:', err);

      await ingestReading(req, res, next);
    }
  } catch (error) {
    console.error('Simulator error:', error);
  }
};
