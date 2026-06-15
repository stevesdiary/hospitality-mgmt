import { UserType } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        type: UserType;
        companyId?: string;
      };
    }
  }
}
