'use strict';
const { v4: uuidv4 } = require('uuid');
const { Company, User } = require('../models');

class CompanyService {
  async createCompany(data) {
    const id = uuidv4();
    return await Company.create({ id, ...data });
  }

  async findAllCompanies() {
    return await Company.findAndCountAll({
      attributes: { exclude: ['deletedAt'] },
      order: [['createdAt', 'DESC']]
    });
  }

  async findCompanyById(id) {
    const company = await Company.findByPk(id, {
      attributes: { exclude: ['deletedAt'] },
      include: [{ model: User, as: 'users', attributes: ['id', 'firstName', 'lastName', 'email', 'type'] }]
    });
    if (!company) throw new Error('Company not found');
    return company;
  }

  async updateCompany(id, data) {
    const [updated] = await Company.update(data, { where: { id } });
    if (updated === 0) throw new Error('Company not found or no changes made');
    return this.findCompanyById(id);
  }

  async deleteCompany(id) {
    const deleted = await Company.destroy({ where: { id } });
    if (deleted === 0) throw new Error('Company not found');
    return { message: `Company ${id} deleted successfully` };
  }
}

module.exports = new CompanyService();
