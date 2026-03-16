/**
 * Models Barrel Export
 * Central export point for all database models
 */

import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Sequelize connection
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

// Import and initialize model factories
import UserFactory from './user';
import HotelFactory from './hotel';
import RoomFactory from './room';
import FacilityFactory from './facilities';
import RatingAndReviewFactory from './ratingAndReview';
import MediaFileFactory from './mediaFile';
import ReservationFactory from './reservation';

// Initialize all models with sequelize instance
export const User = UserFactory(sequelize, DataTypes);
export const Hotel = HotelFactory(sequelize, DataTypes);
export const Room = RoomFactory(sequelize, DataTypes);
export const Facility = FacilityFactory(sequelize, DataTypes);
export const RatingAndReview = RatingAndReviewFactory(sequelize, DataTypes);
export const MediaFile = MediaFileFactory(sequelize, DataTypes);
export const Reservation = ReservationFactory(sequelize, DataTypes);

// Initialize model associations
const models = {
  User,
  Hotel,
  Room,
  Facility,
  RatingAndReview,
  MediaFile,
  Reservation,
};

Object.keys(models).forEach((modelName) => {
  const model = models[modelName as keyof typeof models];
  if ('associate' in model && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { sequelize, Sequelize };
