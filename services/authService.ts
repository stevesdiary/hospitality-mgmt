/**
 * Auth Service - stateless JWT, bcrypt
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models';
import { UserInstance } from '../models/user';
import { JwtPayload } from '../types';

class AuthService {
  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    type?: string;
    companyId?: string;
  }): Promise<{ token: string; user: UserInstance }> {
    const existing = await User.findOne({ where: { email: data.email } });
    if (existing) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const id = uuidv4();

    const user = await User.create({
      id,
      ...data,
      password: hashedPassword,
      type: (data.type as any) || 'regular',
    });

    const token = this.signToken(user);
    return { token, user };
  }

  async login(email: string, password: string): Promise<{ token: string; user: UserInstance }> {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid email or password');

    const token = this.signToken(user);
    return { token, user };
  }

  async resetPassword(token: string, data: { newPassword: string; confirmPassword: string; email: string }): Promise<void> {
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (decoded.email !== data.email) throw new Error('Invalid reset token');

    const user = await User.findOne({ where: { email: data.email } });
    if (!user) throw new Error('User not found');

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await User.findOne({ where: { email } });
    if (!user) return; // silently succeed to prevent email enumeration

    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign({ email }, secret, { expiresIn: '12m' });
    const resetLink = `${process.env.PUBLIC_URL}/resetPassword/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password (expires in 12 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  private signToken(user: UserInstance): string {
    const secret = process.env.JWT_SECRET as string;
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      type: user.type as any,
      companyId: user.companyId,
    };
    return jwt.sign(payload, secret, { expiresIn: '7d' });
  }
}

export default new AuthService();
