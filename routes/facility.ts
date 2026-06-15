import { Router } from 'express';
import {
  createFacility,
  getFacilityByHotel,
  getAllFacilities,
  updateFacility,
  deleteFacility,
} from '../controllers/facilityController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

router.post('/createfacility', authentication, verifyUserType(['admin', 'org_admin']), createFacility);
router.get('/findfacility/:hotel_id', getFacilityByHotel);
router.get('/findfacilities', getAllFacilities);
router.put('/facility/:id', authentication, verifyUserType(['admin', 'org_admin']), updateFacility);
router.delete('/facility/:id', authentication, verifyUserType(['admin', 'org_admin']), deleteFacility);

export default router;
