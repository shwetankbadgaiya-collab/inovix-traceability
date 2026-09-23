import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  iotSimulatorInterval: parseInt(process.env.IOT_SIMULATOR_INTERVAL_MS || '5000'),
  alertThresholds: {
    tempMax: parseFloat(process.env.ALERT_TEMP_MAX || '30'),
    tempMin: parseFloat(process.env.ALERT_TEMP_MIN || '2'),
    humidityMax: parseFloat(process.env.ALERT_HUMIDITY_MAX || '70'),
    humidityMin: parseFloat(process.env.ALERT_HUMIDITY_MIN || '40'),
    batteryLow: parseFloat(process.env.ALERT_BATTERY_LOW || '20'),
    connectivityTimeoutMin: parseFloat(process.env.ALERT_CONNECTIVITY_TIMEOUT_MIN || '15'),
  }
};
