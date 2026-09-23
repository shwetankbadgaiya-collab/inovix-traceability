/**
 * This is a development blockchain service.
 * For production, replace with Hyperledger Fabric or similar permissioned blockchain.
 */
import { prisma } from '../config/db.js';
import crypto from 'crypto';
import { getIo } from '../websocket/socketHandler.js';

export const generateTxHash = () => {
  return '0x' + crypto.randomBytes(32).toString('hex');
};

export const getNextBlockNumber = async () => {
  const lastBlock = await prisma.blockchainEvent.findFirst({
    orderBy: { blockNumber: 'desc' }
  });
  return lastBlock?.blockNumber ? lastBlock.blockNumber + 1 : 1000;
};

export const anchorEvent = async (data: {
  batchId: string;
  eventType: string;
  data?: string;
  actorId?: string;
  actorName?: string;
  actorRole?: string;
}) => {
  const txHash = generateTxHash();
  const blockNumber = await getNextBlockNumber();

  const event = await prisma.blockchainEvent.create({
    data: {
      batchId: data.batchId,
      txHash,
      blockNumber,
      eventType: data.eventType,
      data: data.data || null,
      actorId: data.actorId || null,
      actorName: data.actorName || null,
      actorRole: data.actorRole || null,
      status: 'PENDING'
    }
  });

  setTimeout(async () => {
    try {
      const verifiedEvent = await prisma.blockchainEvent.update({
        where: { id: event.id },
        data: { status: 'VERIFIED', confirmedAt: new Date() }
      });

      const io = getIo();
      if (io) {
        io.emit('blockchain:confirmed', verifiedEvent);
        io.to(`batch_${data.batchId}`).emit('blockchain:confirmed', verifiedEvent);
      }
    } catch (err) {
      console.error('Error confirming blockchain event:', err);
    }
  }, 2000);

  return event;
};
