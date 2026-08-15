/**
 * Users Controller
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userService from '../services/userService';
import { User } from '../models';

const resolveCompanyScope = (req: Request): string | undefined => {
  const user = req.user;
  if (!user) return undefined;
  if (user.type === 'admin') return undefined;
  return user.companyId;
};

export const getMe = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await userService.findUserById(req.user!.id);
    return res.status(200).json({ message: 'User retrieved', user });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to retrieve user', error: err.message });
  }
};

export const updateMe = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await userService.updateUserById(req.user!.id, req.body);
    return res.status(200).json({ message: 'Profile updated', user });
  } catch (err: any) {
    if (err.message === 'User not found') return res.status(404).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user!.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
};

export const findAllUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const companyId = resolveCompanyScope(req);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const result = await userService.findAllUsers(companyId, page, limit);
    return res.status(200).json({ message: 'Users retrieved', Count: result.count, page, limit, Users: result.users });
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
