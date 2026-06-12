/**
 * Authentication Middleware - TypeScript Version
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

export const authentication = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - invalid token format' });
  }

  const secret = process.env.JWT_SECRET as string;

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      type: decoded.type,
      companyId: decoded.companyId,
    };

    next();
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: err.message });
    }
    return res.status(500).json({ message: 'Authentication error occurred', error: err.message });
  }
};
