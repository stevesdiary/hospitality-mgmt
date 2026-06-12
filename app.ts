/**
 * Main Application Entry Point - TypeScript Version
 */

import express, { Application } from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import multer from 'multer';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { b2Storage, UploadResult } from './src/shared/services/b2Storage.service';

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

dotenv.config();

const app: Application = express();
const port = process.env.LOCAL_PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
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

app.use(limiter);
app.use(express.json());
app.use(bodyParser.json());
app.use(auditMutations);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, './uploads'),
  filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Routes
app.use('/', authLimiter, authRoute);
app.use('/', userRoute);
app.use('/', hotelRoute);
app.use('/', roomRoute);
app.use('/', facilityRoute);
app.use('/', ratingsRoute);
app.use('/', reservationRoute);
app.use('/', companyRoute);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Welcome to Hotel Management Platform!' });
});

// Image upload route - Backblaze B2
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imagePath = './uploads/' + req.file!.filename;
    const result: UploadResult = await b2Storage.uploadFileFromPath(imagePath, `hotels/${Date.now()}`);
    await fs.unlink('./uploads/' + req.file!.filename);
    return res.status(200).json({ message: 'Upload Successful', result: result.downloadUrl });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

app.use(errorHandler);

app.listen(port, async () => {
  try {
    await import('./config/dbConfig');
    console.log('Database connection established successfully');
    console.log(`App running on port ${port}`);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
});

export default app;
