'use strict';
const { v4: uuidv4 } = require('uuid');
const { AuditLog } = require('../models');

const EVENT_TYPES = {
  AUTH: 'auth',
  DATA_MUTATION: 'data_mutation',
  ADMIN_ACTION: 'admin_action',
  PAYMENT: 'payment'
};

const auditService = {
  async log({ userId, userEmail, userType, eventType, action, resourceType, resourceId, metadata, ipAddress, userAgent, status = 'success' }) {
    try {
      await AuditLog.create({
        id: uuidv4(),
        userId: userId || null,
        userEmail: userEmail || null,
        userType: userType || null,
        eventType,
        action,
        resourceType: resourceType || null,
        resourceId: resourceId ? String(resourceId) : null,
        metadata: metadata || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        status
      });
    } catch (err) {
      // Audit failures must never break the main request flow
      console.error('[AuditLog] Failed to write audit log:', err.message);
    }
  },

  logAuth(req, action, status = 'success', metadata = null) {
    return this.log({
      userId: req.user?.id,
      userEmail: req.user?.email || req.body?.email,
      userType: req.user?.type,
      eventType: EVENT_TYPES.AUTH,
      action,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      status,
      metadata
    });
  },

  logDataMutation(req, action, resourceType, resourceId, metadata = null) {
    return this.log({
      userId: req.user?.id,
      userEmail: req.user?.email,
      userType: req.user?.type,
      eventType: EVENT_TYPES.DATA_MUTATION,
      action,
      resourceType,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata
    });
  },

  logAdminAction(req, action, resourceType, resourceId, metadata = null) {
    return this.log({
      userId: req.user?.id,
      userEmail: req.user?.email,
      userType: req.user?.type,
      eventType: EVENT_TYPES.ADMIN_ACTION,
      action,
      resourceType,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata
    });
  },

  logPayment(req, action, resourceType, resourceId, metadata = null) {
    return this.log({
      userId: req.user?.id,
      userEmail: req.user?.email,
      userType: req.user?.type,
      eventType: EVENT_TYPES.PAYMENT,
      action,
      resourceType,
      resourceId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata
    });
  }
};

module.exports = { auditService, EVENT_TYPES };
