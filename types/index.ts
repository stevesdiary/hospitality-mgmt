/**
 * Shared Type Definitions
 * Centralized type definitions for the hospitality management system
 */

// User Types
export type UserType = 'guest' | 'regular' | 'premium' | 'admin' | 'org_admin';
export type Gender = 'male' | 'female' | 'other';

// Hotel Types
export type HotelType = 'budget' | 'mid-range' | 'luxury' | 'resort' | 'boutique';

// Room Types
export type RoomCategory = 'standard' | 'deluxe' | 'suite' | 'presidential';
export type RoomCondition = 'excellent' | 'good' | 'fair' | 'needs-maintenance';

// Reservation Types
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

// Facility Amenities
export interface FacilityAmenities {
  restaurant: boolean;
  barLounge: boolean;
  gym: boolean;
  roomService: boolean;
  wifiInternet: boolean;
  dstv: boolean;
  security: boolean;
  swimmingPool: boolean;
  cctv: boolean;
  frontDesk24h: boolean;
  carHire: boolean;
  electricity24h: boolean;
}

// Rating and Review
export interface RatingCategories {
  cleanliness: number;
  comfort: number;
  service: number;
  security: number;
  location: number;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common Response Types
export interface ApiResponse<T = any> {
  message?: string;
  Message?: string;
  data?: T;
  Data?: T;
  Count?: number;
  Error?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  Count?: number;
  Hotel?: T[];
}

// Query Parameters
export interface HotelSearchQuery {
  search?: string;
  hotelType?: HotelType;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  dateIn?: string;
  dateOut?: string;
  restaurant?: boolean;
  barLounge?: boolean;
  gym?: boolean;
  roomService?: boolean;
  wifiInternet?: boolean;
  dstv?: boolean;
  security?: boolean;
  swimmingPool?: boolean;
  cctv?: boolean;
  frontDesk24h?: boolean;
  carHire?: boolean;
  electricity24h?: boolean;
}

// File Upload
export interface UploadOptions {
  useFilename?: boolean;
  uniqueFilename?: boolean;
  overwrite?: boolean;
}

export interface ImageUploadParams {
  entityType: 'room' | 'hotel' | 'facility' | 'user' | 'general';
  entityId?: string;
  folder?: string;
  description?: string;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  type: UserType;
  companyId?: string;
  iat?: number;
  exp?: number;
}

// Backblaze B2 Configuration
export interface B2Config {
  keyId: string;
  applicationKey: string;
  bucketId: string;
  bucketName: string;
}

// Upstash QStash Configuration
export interface QStashConfig {
  url: string;
  token: string;
  currentSigningKey: string;
  nextSigningKey: string;
}

// QStash Message Types
export type QueueName = 
  | 'email-queue'
  | 'reservation-queue'
  | 'payment-queue'
  | 'notification-queue'
  | 'cleanup-queue';

export interface QStashMessage<T = any> {
  queue: QueueName;
  payload: T;
  delay?: number; // Delay in seconds
  retries?: number; // Number of retry attempts
  timeout?: number; // Timeout in seconds
}

export interface EmailQueuePayload {
  to: string;
  subject: string;
  body: string;
  html?: boolean;
}

export interface ReservationQueuePayload {
  reservationId: string;
  userId: string;
  action: 'create' | 'update' | 'cancel' | 'confirm';
  metadata?: Record<string, any>;
}

export interface PaymentQueuePayload {
  paymentId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata?: Record<string, any>;
}

export interface NotificationQueuePayload {
  userId: string;
  type: 'email' | 'sms' | 'push';
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface CleanupQueuePayload {
  resourceType: 'temp_files' | 'expired_sessions' | 'old_logs';
  olderThan?: Date;
  dryRun?: boolean;
}

// Environment Variables
export interface EnvConfig {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_DIALECT: string;
  JWT_SECRET: string;
  B2_KEY_ID: string;
  B2_APPLICATION_KEY: string;
  B2_BUCKET_ID: string;
  B2_BUCKET_NAME: string;
  QSTASH_URL: string;
  QSTASH_TOKEN: string;
  QSTASH_CURRENT_SIGNING_KEY: string;
  QSTASH_NEXT_SIGNING_KEY: string;
  LOCAL_PORT?: string;
  NODE_ENV?: string;
}
