/**
 * Auth Controller
 */

import { Request, Response } from 'express';
import authService from '../services/authService';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    // Public self-signup can NEVER grant an elevated role or attach the account
    // to a company. `type` and `companyId` from the request body are ignored so
    // nobody can register themselves as a platform admin or join an arbitrary
    // tenant. Staff (org_admin) are provisioned through a controlled flow.
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    const { token, user } = await authService.register({ firstName, lastName, email, phoneNumber, password, type: 'regular' });

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        companyId: user.companyId,
      },
    });
  } catch (err: any) {
    if (err.message === 'Email already registered') {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
        companyId: user.companyId,
      },
    });
  } catch (err: any) {
    if (err.message === 'Invalid email or password') {
      return res.status(401).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const logout = async (_req: Request, res: Response): Promise<any> => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    await authService.sendPasswordResetEmail(email);
    return res.status(200).json({ message: 'If an account exists with that email, a reset link has been sent.' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to send reset email', error: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword, email } = req.body;
    await authService.resetPassword(token, { newPassword, confirmPassword, email });
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err: any) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }
    return res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};
