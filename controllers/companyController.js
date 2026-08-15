'use strict';
const companyService = require('../services/companyService');
const { sendSuccess, sendCreated, sendError, sendNotFound } = require('../utils/responseHelper');

const companyController = {
  createCompany: async (req, res) => {
    try {
      const company = await companyService.createCompany(req.body);
      return sendCreated(res, 'Company created successfully', company);
    } catch (err) {
      return sendError(res, 'Error creating company', 500, err.message);
    }
  },

  getAllCompanies: async (req, res) => {
    try {
      const { count, rows: companies } = await companyService.findAllCompanies();
      return sendSuccess(res, 'Companies retrieved', { count, companies });
    } catch (err) {
      return sendError(res, 'Error retrieving companies', 500, err.message);
    }
  },

  getCompany: async (req, res) => {
    try {
      const { user } = req;
      // org_admin may only view their own company; platform admin sees any.
      if (user.type === 'org_admin' && user.companyId !== req.params.id) {
        return res.status(403).json({ message: 'You can only view your own company' });
      }
      const company = await companyService.findCompanyById(req.params.id);
      return sendSuccess(res, 'Company found', company);
    } catch (err) {
      if (err.message.includes('not found')) return sendNotFound(res, err.message);
      return sendError(res, 'Error retrieving company', 500, err.message);
    }
  },

  updateCompany: async (req, res) => {
    try {
      const { user } = req;
      // org_admin can only update their own company
      if (user.type === 'org_admin' && user.companyId !== req.params.id) {
        return res.status(403).json({ message: 'You can only update your own company' });
      }
      const company = await companyService.updateCompany(req.params.id, req.body);
      return sendSuccess(res, 'Company updated', company);
    } catch (err) {
      if (err.message.includes('not found')) return sendNotFound(res, err.message);
      return sendError(res, 'Error updating company', 500, err.message);
    }
  },

  deleteCompany: async (req, res) => {
    try {
      const result = await companyService.deleteCompany(req.params.id);
      return sendSuccess(res, result.message);
    } catch (err) {
      if (err.message.includes('not found')) return sendNotFound(res, err.message);
      return sendError(res, 'Error deleting company', 500, err.message);
    }
  }
};

module.exports = companyController;
