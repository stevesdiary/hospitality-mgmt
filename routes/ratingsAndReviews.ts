import { Router } from 'express';
import { createRating, getRating, updateRating, deleteRating } from '../controllers/ratingsAndReviewController';
import { authentication } from '../middleware/authentication';

const router = Router();

router.post('/createrating/:userId', authentication, createRating);
router.get('/getrating/:id', getRating);
router.put('/updaterating/:id', authentication, updateRating);
router.delete('/deleterating/:id', authentication, deleteRating);

export default router;
