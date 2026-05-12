'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuditLogs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      eventType: {
        // 'auth' | 'data_mutation' | 'admin_action' | 'payment'
        type: Sequelize.STRING,
        allowNull: false
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resourceType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resourceId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        // 'success' | 'failure'
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'success'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('AuditLogs', ['userId'], { name: 'audit_user_id_idx' });
    await queryInterface.addIndex('AuditLogs', ['eventType'], { name: 'audit_event_type_idx' });
    await queryInterface.addIndex('AuditLogs', ['action'], { name: 'audit_action_idx' });
    await queryInterface.addIndex('AuditLogs', ['resourceType', 'resourceId'], { name: 'audit_resource_idx' });
    await queryInterface.addIndex('AuditLogs', ['createdAt'], { name: 'audit_created_at_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AuditLogs');
  }
};
