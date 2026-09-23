import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../middleware/auth.js';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        location: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = req.user!;

    if (user.role !== 'ADMIN' && user.id !== id) {
      return res.status(403).json({ error: 'Unauthorized to view this user' });
    }

    const fetchedUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        location: true,
        createdAt: true
      }
    });

    if (!fetchedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(fetchedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { name, organization, location } = req.body;
    const user = req.user!;

    if (user.role !== 'ADMIN' && user.id !== id) {
      return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, organization, location },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        organization: true,
        location: true,
        createdAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
