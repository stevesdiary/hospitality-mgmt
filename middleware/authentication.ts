/**
 * Authentication Middleware - TypeScript Version
 */

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserType } from '../types';

interface AuthRequest extends Request {
  email?: string;
  type?: UserType;
  userId?: string;
}

export const authentication = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    console.log('No auth header here!');
    return res.status(401).json({ message: 'Authorization header required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  if (token == null) {
    return res.status(401).json({ message: 'Unauthorized - invalid token format' });
  }
  
  const secret = process.env.JWT_SECRET as string;
  
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload & { email: string; type: UserType; id: string };
    
    if (decoded) {
      req.email = decoded.email;
      req.type = decoded.type;
      req.userId = decoded.id;
      next();
    } else {
      return res.status(403).json({
        message: 'Invalid or expired token',
      });
    }
  } catch (err: any) {
    console.log(err, err.message);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token', error: err.message });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', error: err.message });
    }
    
    return res.status(500).json({ message: 'Authentication error occurred', error: err.message });
  }
};
