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
import verifyUserType from './middleware/verifyUserType';

import authRoute from './routes/auth';
import userRoute from './routes/user';
import hotelRoute from './routes/hotel';
import roomRoute from './routes/room';
import facilityRoute from './routes/facility';
import ratingsRoute from './routes/ratingsAndReviews';
import reservationRoute from './routes/reservation';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import companyRoute from './routes/company';

import errorHandler from './middleware/errorHandler';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { auditMutations } from './middleware/auditMiddleware';

const app: Application = express();
const port = process.env.LOCAL_PORT || 3000;

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
app.use(express.json({ limit: '10mb' }));
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
// All API routes are namespaced under /api; the root path is reserved for the
// health probe, welcome message, and (later) serving the built frontend.
app.use('/api', authLimiter, authRoute);
app.use('/api', userRoute);
app.use('/api', hotelRoute);
app.use('/api', roomRoute);
app.use('/api', facilityRoute);
app.use('/api', ratingsRoute);
app.use('/api', reservationRoute);
app.use('/api', companyRoute);

// Health check (no auth, no rate limit — for load-balancer probes)
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', env: process.env.NODE_ENV });
});

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to Hotel Management Platform!' });
});

// ── Image upload (authenticated + admin/org_admin only) ───────────────────────
app.post(
  '/upload',
  uploadLimiter,
  authentication,
  verifyUserType(['admin', 'org_admin']),
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
