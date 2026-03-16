/**
 * Authentication Middleware
 * JWT-based authentication with type-safe request extensions
 */

import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config/environment';

// Extended request interface with user information
export interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  userType?: 'guest' | 'regular' | 'premium' | 'admin';
}

/**
 * Authentication middleware factory
 * Verifies JWT token and attaches user info to request
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Invalid token format' });
      return;
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload & {
      id: string;
      email: string;
      type: string;
    };
    
    req.userId = decoded.id;
    req.email = decoded.email;
    req.userType = decoded.type as 'guest' | 'regular' | 'premium' | 'admin';
    
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

/**
 * Optional authentication
 * Attaches user info if token is valid, but doesn't require it
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next();
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload & {
      id: string;
      email: string;
      type: string;
    };
    
    req.userId = decoded.id;
    req.email = decoded.email;
    req.userType = decoded.type as 'guest' | 'regular' | 'premium' | 'admin';
    
    next();
  } catch (error) {
    // Silently continue - authentication is optional
    next();
  }
};
