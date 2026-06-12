/**
 * Verify User Type Middleware - TypeScript Version
 */

import { Request, Response, NextFunction } from 'express';
import { UserType } from '../types';

export default (allowedTypes: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userType = req.user?.type;

    if (!userType) {
      res.status(401).json({ message: 'Unauthorized - user not authenticated' });
      return;
    }

    if (!allowedTypes.includes(userType)) {
      res.status(403).json({ message: 'Forbidden - insufficient permissions' });
      return;
    }

    next();
  };
};
