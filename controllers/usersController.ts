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
    return res.status(200).json({ message: 'User retrieved', user });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to retrieve user', error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const user = await userService.updateUserById(id, req.body);
    return res.status(200).json({ message: 'User updated', user });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    await userService.deleteUserById(id);
    return res.status(200).json({ message: `User ${id} deleted successfully` });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};
