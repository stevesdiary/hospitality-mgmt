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

/**
 * Public "List your hotel" onboarding: creates a company + its first org_admin
 * and returns an auto-login token so the owner lands straight in the console.
 */
export const onboardHotel = async (req: Request, res: Response): Promise<any> => {
  try {
    const { company, admin } = req.body;
    if (!company?.name || !company?.contactEmail) {
      return res.status(400).json({ message: 'company.name and company.contactEmail are required' });
    }
    if (!admin?.firstName || !admin?.email || !admin?.password) {
      return res.status(400).json({ message: 'admin.firstName, admin.email and admin.password are required' });
    }

    const { token, user, company: created } = await authService.onboardCompany(company, admin);

    return res.status(201).json({
      message: 'Company onboarded successfully',
      token,
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, type: user.type, companyId: user.companyId },
      company: { id: created.id, name: created.name, contactEmail: created.contactEmail },
    });
  } catch (err: any) {
    if (err.message === 'Email already registered' || err.message?.includes('already exists')) {
      return res.status(409).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Onboarding failed', error: err.message });
  }
};

/**
 * An org_admin (or platform admin) adds a staff account. The company is taken
 * from the authenticated user — an org_admin can only ever add staff to their
 * own company, never another tenant.
 */
export const inviteStaff = async (req: Request, res: Response): Promise<any> => {
  try {
    const requester = req.user;
    if (!requester) return res.status(401).json({ message: 'Unauthorized' });

    // Platform admin may target any company via body; org_admin is pinned to theirs.
    const companyId = requester.type === 'admin' ? req.body.companyId : requester.companyId;
    if (!companyId) {
      return res.status(400).json({ message: 'A company is required to add staff' });
    }

    const { firstName, lastName, email, phoneNumber, password, type } = req.body;
    if (!firstName || !email || !password) {
      return res.status(400).json({ message: 'firstName, email and password are required' });
    }

    const user = await authService.createStaff(companyId, { firstName, lastName, email, phoneNumber, password, type });
    return res.status(201).json({
      message: 'Staff account created',
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, type: user.type, companyId: user.companyId },
    });
  } catch (err: any) {
    if (err.message === 'Email already registered') return res.status(409).json({ message: err.message });
    return res.status(500).json({ message: 'Failed to create staff account', error: err.message });
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
