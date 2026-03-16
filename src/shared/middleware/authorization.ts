/**
 * Authorization Middleware
 * Role-based access control
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authentication';

type UserType = 'guest' | 'regular' | 'premium' | 'admin';

/**
 * Authorize specific user types
 * @param allowedTypes - Array of allowed user types
 */
export const authorize = (...allowedTypes: UserType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userType = req.userType;
    
    if (!userType) {
      res.status(401).json({ message: 'Unauthorized - user type not found' });
      return;
    }
    
    if (!allowedTypes.includes(userType)) {
      res.status(403).json({ message: 'Forbidden - insufficient permissions' });
      return;
    }
    
    next();
  };
};

/**
 * Require admin role
 */
export const requireAdmin = authorize('admin');

/**
 * Require authenticated user (any type)
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.userId) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }
  
  next();
};
