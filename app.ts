/**
 * Main Application Entry Point - TypeScript Version
 */

import dotenv from 'dotenv';
dotenv.config();

// Fail fast — exit immediately if required env vars are absent/invalid
import { validateEnv } from './config/validateEnv';
validateEnv();

import express, { Application, Request, Response } from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';

import { b2Storage, UploadResult } from './src/shared/services/b2Storage.service';
import { authentication } from './middleware/authentication';

import authRoute from './routes/auth';
import userRoute from './routes/user';
import hotelRoute from './routes/hotel';
import roomRoute from './routes/room';
import facilityRoute from './routes/facility';
import ratingsRoute from './routes/ratingsAndReviews';
import reservationRoute from './routes/reservation';
import paymentRoute from './routes/payment';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import companyRoute from './routes/company';
import paymentRoute from './routes/payment';

import errorHandler from './middleware/errorHandler';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { auditMutations } from './middleware/auditMiddleware';

const app: Application = express();
const port = process.env.LOCAL_PORT || 3000;

// Ensure uploads directory exists before multer tries to write to it
fs.mkdir('./uploads', { recursive: true }).catch(() => {});

// ── Security middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === 'production' ? false : '*'),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── Rate limiting ──────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many upload requests, please try again later.' },
});

app.use(globalLimiter);

// ── Body parsing ───────────────────────────────────────────────────────────────
// Keep the raw body around: the Paystack webhook signature is an HMAC of the
// exact bytes sent, so the parsed object can't be used to verify it.
app.use(express.json({
  limit: '10mb',
  verify: (req, _res, buf) => { (req as any).rawBody = buf; },
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(auditMutations);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// ── Multer (images only, 5 MB max) ────────────────────────────────────────────
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, './uploads'),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: jpeg, png, webp, gif`));
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/auth', authLimiter, authRoute);
app.use('/users', userRoute);
app.use('/hotels', hotelRoute);
app.use('/rooms', roomRoute);
app.use('/facilities', facilityRoute);
app.use('/reviews', ratingsRoute);
app.use('/reservations', reservationRoute);
app.use('/payments', paymentRoute);
app.use('/companies', companyRoute);

// Health check (no auth, no rate limit — for load-balancer probes)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', env: process.env.NODE_ENV });
});

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to Hotel Management Platform!' });
});

// ── Image upload (any authenticated user — e.g. profile avatar, hotel photos) ──
app.post(
  '/api/upload',
  uploadLimiter,
  authentication,
  upload.single('image'),
  async (req: Request, res: Response): Promise<any> => {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imagePath = `./uploads/${req.file.filename}`;

    try {
      const result: UploadResult = await b2Storage.uploadFileFromPath(imagePath, `hotels/${Date.now()}`);
      return res.status(200).json({ message: 'Upload successful', url: result.downloadUrl });
    } catch (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ message: 'Upload failed' });
    } finally {
      // Always clean up the temp file, even on B2 error
      await fs.unlink(imagePath).catch(() => {/* ignore cleanup errors */});
    }
  }
);

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start server ───────────────────────────────────────────────────────────────
app.listen(port, async () => {
  try {
    await import('./config/dbConfig');
    console.log('Database connection established successfully');
    console.log(`App running on port ${port} (${process.env.NODE_ENV || 'development'})`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
});

export default app;
