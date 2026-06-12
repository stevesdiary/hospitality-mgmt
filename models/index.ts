/**
 * Models Barrel Export
 * Central export point for all database models
 */

import { Sequelize, DataTypes } from 'sequelize';
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

import UserFactory from './user';
import HotelFactory from './hotel';
import RoomFactory from './room';
import FacilityFactory from './facilities';
import RatingAndReviewFactory from './ratingAndReview';
import MediaFileFactory from './mediaFile';
import ReservationFactory from './reservation';

// JS models (company and auditLog are still .js)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CompanyFactory = require('./company');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AuditLogFactory = require('./auditLog');

export const User = UserFactory(sequelize, DataTypes);
export const Hotel = HotelFactory(sequelize, DataTypes);
export const Room = RoomFactory(sequelize, DataTypes);
export const Facility = FacilityFactory(sequelize, DataTypes);
export const RatingAndReview = RatingAndReviewFactory(sequelize, DataTypes);
export const MediaFile = MediaFileFactory(sequelize, DataTypes);
export const Reservation = ReservationFactory(sequelize, DataTypes);
export const Company = CompanyFactory(sequelize, DataTypes);
export const AuditLog = AuditLogFactory(sequelize, DataTypes);

const models = {
  User,
  Hotel,
  Room,
  Facility,
  RatingAndReview,
  MediaFile,
  Reservation,
  Company,
  AuditLog,
};

Object.keys(models).forEach((modelName) => {
  const model = models[modelName as keyof typeof models];
  if ('associate' in model && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize, Sequelize };
