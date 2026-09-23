import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server | null = null;

export const setupWebSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join:batch', (batchId) => {
      socket.join(`batch_${batchId}`);
      console.log(`Socket ${socket.id} joined room batch_${batchId}`);
    });

    socket.on('join:dashboard', () => {
      socket.join('dashboard');
      console.log(`Socket ${socket.id} joined room dashboard`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => io;
