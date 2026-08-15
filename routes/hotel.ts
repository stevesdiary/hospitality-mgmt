import { Router } from 'express';
import {
  createHotel,
  getAllHotels,
  getTopDeals,
  getTopHotels,
  getHotelsByCity,
  getTopDestinations,
  getOneHotel,
  getHotelsByDate,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';
import { validateBody } from '../middleware/validation';
import { hotelValidation } from '../src/shared/utils/validationSchemas';

const router = Router();

router.post('/', authentication, verifyUserType(['admin', 'org_admin']), validateBody(hotelValidation.create), createHotel);
router.get('/', getAllHotels);
router.get('/search', getAllHotels);
router.get('/top-deals', getTopDeals);
router.get('/top-rated', getTopHotels);
router.get('/by-city', getHotelsByCity);
router.get('/top-destinations', getTopDestinations);
router.get('/by-date', getHotelsByDate);
router.get('/:id', getOneHotel);
router.put('/:id', authentication, verifyUserType(['admin', 'org_admin']), validateBody(hotelValidation.update), updateHotel);
router.delete('/:id', authentication, verifyUserType(['admin', 'org_admin']), deleteHotel);

export default router;
