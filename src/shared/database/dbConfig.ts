/**
 * Database Configuration
 * Sequelize connection setup
 */

import { Sequelize } from 'sequelize';
import { config } from '../../config/environment';

export const sequelize = new Sequelize({
  database: config.db.name,
  username: config.db.user,
  password: config.db.password,
  port: config.db.port,
  host: config.db.host,
  dialect: config.db.dialect as 'postgres' | 'mysql' | 'sqlite' | 'mssql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
  logging: config.nodeEnv === 'development' ? console.log : false,
});

export default sequelize;
