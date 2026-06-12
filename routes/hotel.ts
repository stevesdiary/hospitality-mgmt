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

const router = Router();

router.post('/createhotel', authentication, verifyUserType(['admin', 'org_admin']), createHotel);
router.get('/findall', getAllHotels);
router.get('/topdeals', getTopDeals);
router.get('/tophotels', getTopHotels);
router.get('/hotels-by-cities', getHotelsByCity);
router.get('/topdestinations', getTopDestinations);
router.get('/findone/:id', getOneHotel);
router.get('/bydate', getHotelsByDate);
router.put('/update/:id', authentication, verifyUserType(['admin', 'org_admin']), updateHotel);
router.delete('/delete/:id', authentication, verifyUserType(['admin', 'org_admin']), deleteHotel);

export default router;
