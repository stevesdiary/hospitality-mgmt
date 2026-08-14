import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import multer, { FileFilterCallback } from 'multer';
import rateLimit from 'express-rate-limit';
import { getMe, updateMe, changePassword, findAllUser, findOne, updateUser, deleteUser } from '../controllers/usersController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';
import { b2Storage, UploadResult } from '../src/shared/services/b2Storage.service';
import userService from '../services/userService';

const router = Router();

const uploadLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, './uploads'),
    filename: (_req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
  }),
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    ALLOWED_MIME.has(file.mimetype) ? cb(null, true) : cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/me', authentication, getMe);
router.put('/me', authentication, updateMe);
router.patch('/me/change-password', authentication, changePassword);
router.post('/me/upload-image', uploadLimiter, authentication, upload.single('image'), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) return res.status(400).json({ message: 'No image file provided' });
  const imagePath = `./uploads/${req.file.filename}`;
  try {
    const result: UploadResult = await b2Storage.uploadFileFromPath(imagePath, `users/${req.user!.id}/${Date.now()}`);
    await userService.updateUserById(req.user!.id, { profileImage: result.downloadUrl } as any);
    return res.status(200).json({ message: 'Profile image updated', url: result.downloadUrl });
  } catch (err: any) {
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  } finally {
    await fs.unlink(imagePath).catch(() => {});
  }
});

router.get('/', authentication, verifyUserType(['admin', 'org_admin']), findAllUser);
router.get('/:id', authentication, findOne);
router.put('/:id', authentication, updateUser);
router.delete('/:id', authentication, verifyUserType(['admin']), deleteUser);

export default router;
