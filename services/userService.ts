/**
 * User Service
 */

import { User } from '../models';
import { UserInstance } from '../models/user';

class UserService {
  async findAllUsers(companyId?: string): Promise<{ count: number; users: UserInstance[] }> {
    const where: any = {};
    if (companyId) where.companyId = companyId;
    const { count, rows: users } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
    });
    return { count, users };
  }

  async findUserById(id: string): Promise<UserInstance> {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateUserById(id: string, data: Partial<UserInstance>): Promise<UserInstance> {
    const [updated] = await User.update(data, { where: { id } });
    if (updated === 0) throw new Error('User not found');
    return this.findUserById(id);
  }

  async deleteUserById(id: string): Promise<void> {
    const deleted = await User.destroy({ where: { id } });
    if (deleted === 0) throw new Error('User not found');
  }
}

export default new UserService();
