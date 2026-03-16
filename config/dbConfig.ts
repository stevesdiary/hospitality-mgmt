/**
 * Database Models Index - TypeScript Version
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  host: process.env.DB_HOST,
  dialect: (process.env.DB_DIALECT || 'postgres') as 'postgres' | 'mysql' | 'sqlite' | 'mssql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
});

export default sequelize;
