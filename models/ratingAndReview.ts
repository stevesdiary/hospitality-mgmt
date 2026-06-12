/** 
 * Rating and Review Model - TypeScript Version
 */

import { Model, DataTypes, Sequelize } from 'sequelize';
import type { ModelCtor } from 'sequelize';

export interface RatingAndReviewInstance extends Model {
  id: string;
  hotelId: string;
  userId: string;
  companyId?: string;
  reviewTitle: string;
  date?: Date;
  firstName: string;
  lastName?: string;
  review: string;
  like?: boolean;
  overallRating?: number;
  cleanliness: number;
  comfort: number;
  service: number;
  security: number;
  location: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date;
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes): ModelCtor<RatingAndReviewInstance> => {
  class RatingAndReview extends Model implements RatingAndReviewInstance {
    static associate(models: any) {
      // define association here
    }

    id!: string;
    hotelId!: string;
    userId!: string;
    companyId?: string;
    reviewTitle!: string;
    date?: Date;
    firstName!: string;
    lastName?: string;
    review!: string;
    like?: boolean;
    overallRating?: number;
    cleanliness!: number;
    comfort!: number;
    service!: number;
    security!: number;
    location!: number;
    readonly createdAt!: Date;
    readonly updatedAt!: Date;
    readonly deletedAt!: Date;
  }

  RatingAndReview.init(
    {
      id: {
        type: dataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      hotelId: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      userId: {
        type: dataTypes.UUID,
        allowNull: false,
      },
      companyId: {
        type: dataTypes.UUID,
        allowNull: true,
        references: { model: 'Companies', key: 'id' },
      },
      reviewTitle: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      date: dataTypes.DATE,
      firstName: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      review: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      like: {
        type: dataTypes.BOOLEAN,
        allowNull: true,
      },
      overallRating: {
        type: dataTypes.INTEGER,
        allowNull: true,
      },
      cleanliness: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      comfort: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      service: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      security: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      location: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'RatingsAndReviews',
      modelName: 'RatingAndReview',
      paranoid: true,
      timestamps: true,
    }
  );

  return RatingAndReview;
};
