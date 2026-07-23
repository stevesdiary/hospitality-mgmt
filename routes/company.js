'use strict';
const express = require('express');
const router = express.Router();
const { authentication } = require('../middleware/authentication');
const authorise = require('../middleware/verifyUserType');
const companyController = require('../controllers/companyController');

// verifyUserType expects an ARRAY of allowed roles — passing bare strings makes
// the second role silently ignored (which wrongly blocks org_admin).
// system admin only — provision a new tenant
router.post('/companies',         authentication, authorise(['admin']), companyController.createCompany);
// system admin sees all tenants
router.get('/companies',          authentication, authorise(['admin']), companyController.getAllCompanies);
// system admin any; org_admin scoped to their own company (enforced in controller)
router.get('/companies/:id',      authentication, authorise(['admin', 'org_admin']), companyController.getCompany);
router.put('/companies/:id',      authentication, authorise(['admin', 'org_admin']), companyController.updateCompany);
router.delete('/companies/:id',   authentication, authorise(['admin']), companyController.deleteCompany);

module.exports = router;
