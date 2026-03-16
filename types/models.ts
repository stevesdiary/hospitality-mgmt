/**
 * Model Type Definitions
 * TypeScript interfaces and types for Sequelize models
 */

import { DataTypes, Model, Optional } from 'sequelize';
import { UserType, Gender, HotelType, RoomCategory, RoomCondition, PaymentStatus, FacilityAmenities, RatingCategories } from '.';

// User Model Types
export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  gender?: Gender;
  phoneNumber: string;
  email: string;
  password: string;
  type?: UserType;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'type' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  Reservation?: ReservationInstance[];
}

// Hotel Model Types
export interface HotelAttributes {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description?: string;
  hotelType: HotelType;
  numberOfRooms?: number;
  contactEmail: string;
  contactPhone: string;
  termsAndConditions?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface HotelCreationAttributes extends Optional<HotelAttributes, 'id' | 'description' | 'numberOfRooms' | 'termsAndConditions' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface HotelInstance extends Model<HotelAttributes, HotelCreationAttributes>, HotelAttributes {
  rooms?: RoomInstance[];
  facilities?: FacilityInstance[];
  ratingAndReview?: RatingAndReviewInstance[];
  reservation?: ReservationInstance[];
}

// Room Model Types
export interface RoomAttributes {
  id: string;
  hotelId: string;
  category: RoomCategory;
  capacity: number;
  description?: string;
  availability?: boolean;
  price: number;
  deals?: number;
  condition?: RoomCondition;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RoomCreationAttributes extends Optional<RoomAttributes, 'id' | 'description' | 'availability' | 'deals' | 'condition' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface RoomInstance extends Model<RoomAttributes, RoomCreationAttributes>, RoomAttributes {
  Hotel?: HotelInstance;
  Reservation?: ReservationInstance[];
}

// Facility Model Types
export interface FacilityAttributes extends FacilityAmenities {
  id: string;
  hotelId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface FacilityCreationAttributes extends Optional<FacilityAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface FacilityInstance extends Model<FacilityAttributes, FacilityCreationAttributes>, FacilityAttributes {
  Hotel?: HotelInstance;
}

// Rating and Review Model Types
export interface RatingAndReviewAttributes extends RatingCategories {
  id: string;
  hotelId: string;
  reviewTitle: string;
  review: string;
  like?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface RatingAndReviewCreationAttributes extends Optional<RatingAndReviewAttributes, 'id' | 'like' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface RatingAndReviewInstance extends Model<RatingAndReviewAttributes, RatingAndReviewCreationAttributes>, RatingAndReviewAttributes {
  Hotel?: HotelInstance;
}

// Reservation Model Types
export interface ReservationAttributes {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  dateIn: Date;
  dateOut: Date;
  paymentStatus?: PaymentStatus;
  amount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ReservationCreationAttributes extends Optional<ReservationAttributes, 'id' | 'paymentStatus' | 'amount' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface ReservationInstance extends Model<ReservationAttributes, ReservationCreationAttributes>, ReservationAttributes {
  User?: UserInstance;
  Hotel?: HotelInstance;
  Room?: RoomInstance;
}

// Media File Model Types
export interface MediaFileAttributes {
  id: string;
  entityType: 'user' | 'hotel' | 'room' | 'facility';
  entityId: string;
  imageUrl: string;
  publicId: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MediaFileCreationAttributes extends Optional<MediaFileAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface MediaFileInstance extends Model<MediaFileAttributes, MediaFileCreationAttributes>, MediaFileAttributes {}

// Database Association Types
export interface DatabaseAssociations {
  User: typeof Model<UserAttributes, UserCreationAttributes>;
  Hotel: typeof Model<HotelAttributes, HotelCreationAttributes>;
  Room: typeof Model<RoomAttributes, RoomCreationAttributes>;
  Facility: typeof Model<FacilityAttributes, FacilityCreationAttributes>;
  RatingAndReview: typeof Model<RatingAndReviewAttributes, RatingAndReviewCreationAttributes>;
  Reservation: typeof Model<ReservationAttributes, ReservationCreationAttributes>;
  MediaFile: typeof Model<MediaFileAttributes, MediaFileCreationAttributes>;
}
