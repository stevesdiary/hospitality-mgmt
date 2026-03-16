/**
 * Verify User Type Middleware - TypeScript Version
 */

import { Request, Response, NextFunction } from 'express';
import { UserType } from '../types';

interface AuthRequest extends Request {
  type?: UserType;
}

export default (allowedTypes: UserType[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userType = req.type;

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
