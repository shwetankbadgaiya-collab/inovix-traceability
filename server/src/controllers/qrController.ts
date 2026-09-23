import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export const generate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batchId = req.params.batchId as string;

    const batch = await prisma.batch.findUnique({ where: { id: batchId } });
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }

    let qrCode = await prisma.qRCode.findUnique({ where: { batchId } });

    if (!qrCode) {
      qrCode = await prisma.qRCode.create({
        data: {
          batchId,
          token: uuidv4()
        }
      });
    }

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${qrCode.token}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    res.json({
      batchId,
      token: qrCode.token,
      qrDataUrl,
      verificationUrl
    });
  } catch (error) {
    next(error);
  }
};

export const getQR = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const batchId = req.params.batchId as string;
    const qrCode = await prisma.qRCode.findUnique({ where: { batchId } });

    if (!qrCode) {
      return res.status(404).json({ error: 'QR Code not found for this batch' });
    }

    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${qrCode.token}`;
    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    res.json({
      batchId,
      token: qrCode.token,
      qrDataUrl,
      verificationUrl
    });
  } catch (error) {
    next(error);
  }
};
