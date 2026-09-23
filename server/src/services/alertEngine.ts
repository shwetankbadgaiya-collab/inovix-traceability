import { SensorReading, Alert } from '@prisma/client';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';
import { Server } from 'socket.io';

export const checkReading = async (reading: SensorReading, io?: Server | null) => {
  const alerts: Alert[] = [];

  const createAlert = async (type: string, severity: 'CRITICAL' | 'WARNING' | 'INFO', title: string, message: string, value?: number, threshold?: number) => {
    const alert = await prisma.alert.create({
      data: {
        type,
        severity,
        title,
        message,
        value: value !== undefined ? value : null,
        threshold: threshold !== undefined ? threshold : null,
        nodeId: reading.nodeId,
        batchId: reading.batchId
      }
    });
    alerts.push(alert);
    if (io) {
      io.emit('alert:new', alert);
    }
  };

  if (reading.temperature > config.alertThresholds.tempMax) {
    await createAlert('TEMPERATURE', 'CRITICAL', 'High Temperature Warning', `Temperature exceeded maximum threshold: ${reading.temperature}°C`, reading.temperature, config.alertThresholds.tempMax);
  } else if (reading.temperature < config.alertThresholds.tempMin) {
    await createAlert('TEMPERATURE', 'WARNING', 'Low Temperature Warning', `Temperature below minimum threshold: ${reading.temperature}°C`, reading.temperature, config.alertThresholds.tempMin);
  }

  if (reading.humidity > config.alertThresholds.humidityMax) {
    await createAlert('HUMIDITY', 'WARNING', 'High Humidity Warning', `Humidity exceeded maximum threshold: ${reading.humidity}%`, reading.humidity, config.alertThresholds.humidityMax);
  } else if (reading.humidity < config.alertThresholds.humidityMin) {
    await createAlert('HUMIDITY', 'WARNING', 'Low Humidity Warning', `Humidity below minimum threshold: ${reading.humidity}%`, reading.humidity, config.alertThresholds.humidityMin);
  }

  if (reading.battery < config.alertThresholds.batteryLow) {
    await createAlert('BATTERY', 'WARNING', 'Low Battery Warning', `Node battery critically low: ${reading.battery}%`, reading.battery, config.alertThresholds.batteryLow);
  }

  return alerts;
};
