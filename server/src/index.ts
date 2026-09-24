import http from 'http';
import app from './app.js';
import { config } from './config/env.js';
import { setupWebSocket } from './websocket/socketHandler.js';

const server = http.createServer(app);
setupWebSocket(server);

server.listen(config.port, () => {
  const dbType = (process.env.DATABASE_URL || '').startsWith('postgres')
    ? 'PostgreSQL (Cloud)'
    : 'SQLite (dev.db)';

  console.log(`INOVIX Server running on port ${config.port}`);
  console.log(`Database: ${dbType}`);
  console.log('WebSocket: enabled');
});
