/**
 * Environment Configuration
 * Centralized environment variable management with type safety
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: process.env.LOCAL_PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  db: {
    name: process.env.DB_NAME!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Backblaze B2 Storage
  b2: {
    keyId: process.env.B2_KEY_ID!,
    applicationKey: process.env.B2_APPLICATION_KEY!,
    bucketId: process.env.B2_BUCKET_ID!,
    bucketName: process.env.B2_BUCKET_NAME!,
  },

  // Upstash QStash Configuration
  qstash: {
    url: process.env.QSTASH_URL!,
    token: process.env.QSTASH_TOKEN!,
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  },
  
  // Email (if needed)
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },
};

export type Config = typeof config;
