/**
 * Main Application Entry Point - TypeScript Version
 */

import express, { Application } from 'express';
import fs from 'fs/promises';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import multer from 'multer';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Import B2 Storage service
import { b2Storage, UploadResult } from './src/shared/services/b2Storage.service';

// Import routes
import forgotPasswordRoute from './routes/forgotPassword';
import registerRoute from './routes/register';
import loginRoute from './routes/login';
import userRoute from './routes/user';
import hotelRoute from './routes/hotel';
import roomRoute from './routes/room';
import facilityRoute from './routes/facility';
import ratingsRoute from './routes/ratingsAndReviews';
import reservationRoute from './routes/reservation';
import companyRoute from './routes/company';

// Import middleware
import errorHandler from './middleware/errorHandler';
import { auditMutations } from './middleware/auditMiddleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const port = process.env.LOCAL_PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(bodyParser.json());
app.use(auditMutations);
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// Route registration
app.use('/', registerRoute);
app.use('/', loginRoute);
app.use('/', forgotPasswordRoute);
app.use('/', userRoute);
app.use('/', hotelRoute);
app.use('/', roomRoute);
app.use('/', facilityRoute);
app.use('/', ratingsRoute);
app.use('/', reservationRoute);
app.use('/', companyRoute);

// Test routes
app.get('/test', (req, res) => {
  res.send('Description.');
});

app.get('/', (req, res) => {
  res.status(200).json('Welcome to Hotel management platform!');
});

// Image upload route - Backblaze B2
app.post(
  '/upload',
  upload.single('image'),
  async (req, res) => {
    try {
      const imagePath = './uploads/' + req.file!.filename;

      // Upload to Backblaze B2
      const result: UploadResult = await b2Storage.uploadFileFromPath(imagePath, `hotels/${Date.now()}`);
      console.log("Upload successful! Here's the image url: ", result.downloadUrl);

      // Clean up local temp file
      await fs.unlink('./uploads/' + req.file!.filename);
      console.log('Local file deleted successfully');

      return res.status(200).send({ message: 'Upload Successful', result: result.downloadUrl });
    } catch (err) {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  }
);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
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
