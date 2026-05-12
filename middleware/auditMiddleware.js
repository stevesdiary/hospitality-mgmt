'use strict';
const { auditService } = require('../services/auditService');

/**
 * Extracts the resource type from the request path.
 * e.g. /createhotel → Hotel, /room → Room
 */
function resolveResource(path) {
  if (/hotel/i.test(path)) return 'Hotel';
  if (/room/i.test(path)) return 'Room';
  if (/facilit/i.test(path)) return 'Facility';
  if (/reservation/i.test(path)) return 'Reservation';
  if (/rating|review/i.test(path)) return 'RatingAndReview';
  if (/user/i.test(path)) return 'User';
  if (/media|upload/i.test(path)) return 'MediaFile';
  return 'Unknown';
}

/**
 * Derives a human-readable action from HTTP method.
 */
function resolveAction(method, path) {
  switch (method) {
    case 'POST':   return `create_${resolveResource(path).toLowerCase()}`;
    case 'PUT':    return `update_${resolveResource(path).toLowerCase()}`;
    case 'DELETE': return `delete_${resolveResource(path).toLowerCase()}`;
    default:       return `read_${resolveResource(path).toLowerCase()}`;
  }
}

/**
 * Middleware that auto-logs admin actions and data mutations on
 * non-GET requests after the response is sent.
 */
const auditMutations = (req, res, next) => {
  if (req.method === 'GET') return next();

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const status = res.statusCode >= 200 && res.statusCode < 400 ? 'success' : 'failure';
    const user = req.user;
    const resourceType = resolveResource(req.path);
    const resourceId = req.params?.id || body?.data?.id || null;
    const action = resolveAction(req.method, req.path);

    const eventType = user?.type === 'admin' || user?.type === 'org_admin'
      ? 'admin_action'
      : 'data_mutation';

    auditService.log({
      userId: user?.id,
      userEmail: user?.email,
      userType: user?.type,
      eventType,
      action,
      resourceType,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status
    });

    return originalJson(body);
  };

  next();
};

module.exports = { auditMutations };
