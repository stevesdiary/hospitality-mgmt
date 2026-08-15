/**
 * Auth Service - stateless JWT, bcrypt
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { User, Company, sequelize } from '../models';
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

  /**
   * Self-serve hotel onboarding: atomically create a company (tenant) and its
   * first org_admin, then return an auto-login token. This is the ONLY public
   * path to an elevated (org_admin) account — plain /signup can't grant it.
   */
  async onboardCompany(
    company: { name: string; contactEmail: string; contactPhone?: string; address?: string },
    admin: { firstName: string; lastName: string; email: string; phoneNumber?: string; password: string }
  ): Promise<{ token: string; user: UserInstance; company: any }> {
    const existingUser = await User.findOne({ where: { email: admin.email } });
    if (existingUser) throw new Error('Email already registered');

    const existingCompany = await Company.findOne({ where: { contactEmail: company.contactEmail } });
    if (existingCompany) throw new Error('A company with that contact email already exists');

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    // Wrap both inserts in a transaction so we never leave a company without its
    // owner (or an owner pointing at a company that failed to create).
    const result = await sequelize.transaction(async (t) => {
      const createdCompany = await Company.create(
        { id: uuidv4(), ...company },
        { transaction: t }
      );

      const user = await User.create(
        {
          id: uuidv4(),
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          password: hashedPassword,
          type: 'org_admin',
          companyId: (createdCompany as any).id,
        },
        { transaction: t }
      );

      return { createdCompany, user };
    });

    const token = this.signToken(result.user);
    return { token, user: result.user, company: result.createdCompany };
  }

  /**
   * Create a staff account inside a company. Used by an org_admin to add staff
   * to their OWN company (companyId is supplied by the controller from the
   * authenticated user, never the request body). Role is constrained so this
   * can't mint a platform admin.
   */
  async createStaff(
    companyId: string,
    staff: { firstName: string; lastName: string; email: string; phoneNumber?: string; password: string; type?: string }
  ): Promise<UserInstance> {
    const existing = await User.findOne({ where: { email: staff.email } });
    if (existing) throw new Error('Email already registered');

    const allowedRoles = ['org_admin', 'regular'];
    const role = staff.type && allowedRoles.includes(staff.type) ? staff.type : 'org_admin';

    const hashedPassword = await bcrypt.hash(staff.password, 10);
    return User.create({
      id: uuidv4(),
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      password: hashedPassword,
      type: role as any,
      companyId,
    });
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
