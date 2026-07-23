/**
 * Users Controller
 */

import { Request, Response } from 'express';
import userService from '../services/userService';

const resolveCompanyScope = (req: Request): string | undefined => {
  const user = req.user;
  if (!user) return undefined;
  if (user.type === 'admin') return undefined;
  return user.companyId;
};

/**
 * Whether the requester may act on a given user record.
 * - Platform admin: any user.
 * - Hotel admin (org_admin): only users in their own company.
 * - Everyone else: only their own account.
 */
const canAccessUser = (req: Request, target: any): boolean => {
  const user = req.user;
  if (!user) return false;
  if (user.type === 'admin') return true;
  if (user.type === 'org_admin' && user.companyId && target.companyId === user.companyId) return true;
  return target.id === user.id;
};

// Never settable through the generic user-update endpoint: role and tenant
// changes are privilege boundaries, and password/email have dedicated flows.
const USER_PROTECTED_FIELDS = ['id', 'type', 'companyId', 'password'];

const stripProtectedUserFields = (body: Record<string, any>): Record<string, any> => {
  const clean = { ...body };
  for (const field of USER_PROTECTED_FIELDS) delete clean[field];
  return clean;
};

export const findAllUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const result = await userService.findAllUsers(companyId);
    return res.status(200).json({ message: 'Users retrieved', Count: result.count, Users: result.users });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to retrieve users', error: err.message });
  }
};

export const findOne = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const user = await userService.findUserById(id);
    // 404 rather than 403 so cross-tenant user existence isn't leaked.
    if (!canAccessUser(req, user)) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User retrieved', user });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to retrieve user', error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const target = await userService.findUserById(id);
    if (!canAccessUser(req, target)) return res.status(404).json({ message: 'User not found' });
    // Strip role/tenant/credential fields so this endpoint can't be used to
    // escalate privileges or move an account between tenants.
    const user = await userService.updateUserById(id, stripProtectedUserFields(req.body));
    return res.status(200).json({ message: 'User updated', user });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const target = await userService.findUserById(id);
    if (!canAccessUser(req, target)) return res.status(404).json({ message: 'User not found' });
    await userService.deleteUserById(id);
    return res.status(200).json({ message: `User ${id} deleted successfully` });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};
