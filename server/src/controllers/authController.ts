import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { config } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';

const generateToken = (user: { id: string; email: string; role: string; name: string; organization?: string }) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name, organization: user.organization },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name, role, organization, location } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
        organization,
        location
      }
    });

    const token = generateToken(user);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

const demoUsersMap: Record<string, string> = {
  FARMER: 'farmer@demo.inovix.com',
  COLLECTION_CENTER: 'collector@demo.inovix.com',
  PROCESSOR: 'processor@demo.inovix.com',
  WAREHOUSE: 'warehouse@demo.inovix.com',
  LOGISTICS: 'logistics@demo.inovix.com',
  RETAILER: 'retailer@demo.inovix.com',
  CONSUMER: 'consumer@demo.inovix.com',
  REGULATOR: 'regulator@demo.inovix.com',
  ADMIN: 'admin@demo.inovix.com'
};

export const demoLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.body;
    const email = demoUsersMap[role.toUpperCase()];

    if (!email) {
      return res.status(400).json({ error: 'Invalid demo role' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('demo123', salt);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        name: `Demo ${role}`,
        role: role.toUpperCase(),
        organization: `Demo Org ${role}`,
        location: 'Global'
      }
    });

    const token = generateToken(user);
    const { passwordHash: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    next(error);
  }
};
