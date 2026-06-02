'use strict';
const { Hotel, Room, Facility, Reservation, RatingAndReview } = require('../models');

/**
 * Returns the companyId that should be applied to queries for the current user.
 *
 * - system admin  → null  (no filter — sees everything)
 * - org_admin     → req.user.companyId  (scoped to own company)
 * - everyone else → null  (guests/regular/premium browse all hotels publicly)
 */
const resolveCompanyScope = (req) => {
  if (!req.user) return null;
  if (req.user.type === 'org_admin') return req.user.companyId;
  return null;
};

/**
 * Middleware factory: verifies a specific resource belongs to the
 * authenticated org_admin's company before allowing mutation.
 *
 * Usage:  router.put('/update/:id', authentication, authorise('org_admin', 'admin'), assertOwnsResource('Hotel'), controller.update)
 */
const assertOwnsResource = (modelName) => async (req, res, next) => {
  try {
    const { user } = req;

    // system admin bypasses ownership check
    if (!user || user.type === 'admin') return next();
    // only org_admin needs to pass this check
    if (user.type !== 'org_admin') return next();

    if (!user.companyId) {
      return res.status(403).json({ message: 'Your account is not associated with a company' });
    }

    const id = req.params.id;
    if (!id) return next();

    const modelMap = { Hotel, Room, Facility, Reservation, RatingAndReview };
    const Model = modelMap[modelName];
    if (!Model) return next();

    const record = await Model.findByPk(id, { attributes: ['id', 'companyId'] });
    if (!record) {
      return res.status(404).json({ message: `${modelName} not found` });
    }

    if (record.companyId !== user.companyId) {
      return res.status(403).json({ message: `You do not have permission to modify this ${modelName}` });
    }

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Ownership check failed', error: err.message });
  }
};

module.exports = { resolveCompanyScope, assertOwnsResource };
