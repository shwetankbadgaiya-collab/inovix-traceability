import http from 'http';
import app from './app.js';
import { config } from './config/env.js';
import { setupWebSocket } from './websocket/socketHandler.js';

const server = http.createServer(app);
setupWebSocket(server);

server.listen(config.port, () => {
  console.log(`INOVIX Server running on port ${config.port}`);
  console.log('Database: SQLite (dev.db)');
  console.log('WebSocket: enabled');
});
