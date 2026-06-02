'use strict';
const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication');
const authorise = require('../middleware/verifyUserType');
const companyController = require('../controllers/companyController');

// system admin only — provision a new tenant
router.post('/companies',         authentication, authorise('admin'), companyController.createCompany);
// system admin sees all; org_admin gets their own (handled in controller)
router.get('/companies',          authentication, authorise('admin'), companyController.getAllCompanies);
router.get('/companies/:id',      authentication, authorise('admin', 'org_admin'), companyController.getCompany);
router.put('/companies/:id',      authentication, authorise('admin', 'org_admin'), companyController.updateCompany);
router.delete('/companies/:id',   authentication, authorise('admin'), companyController.deleteCompany);

module.exports = router;
