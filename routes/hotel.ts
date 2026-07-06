import { Router } from 'express';
import {
  createHotel,
  getAllHotels,
  getTopDeals,
  getTopHotels,
  getHotelsByCity,
  getTopDestinations,
  getOneHotel,
  getHotelBySlug,
  getHotelsByDate,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { authentication } from '../middleware/authentication';
import verifyUserType from '../middleware/verifyUserType';

const router = Router();

// ── Public, single-hotel surface (guest landing/booking pages) ──────────────
// A guest only ever sees ONE hotel at a time — its own branded page. There is
// no public cross-tenant listing.
router.get('/hotels/by-slug/:slug', getHotelBySlug);
router.get('/findone/:id', getOneHotel);

// ── Staff-only listing/discovery (scoped by resolveCompanyScope) ────────────
// Requires authentication so unauthenticated visitors can no longer retrieve a
// cross-tenant view. Platform admins see all tenants; hotel admins (org_admin)
// see only their own company's hotels.
router.post('/createhotel', authentication, verifyUserType(['admin', 'org_admin']), createHotel);
router.get('/findall', authentication, verifyUserType(['admin', 'org_admin']), getAllHotels);
router.get('/topdeals', authentication, verifyUserType(['admin', 'org_admin']), getTopDeals);
router.get('/tophotels', authentication, verifyUserType(['admin', 'org_admin']), getTopHotels);
router.get('/hotels-by-cities', authentication, verifyUserType(['admin', 'org_admin']), getHotelsByCity);
router.get('/topdestinations', authentication, verifyUserType(['admin', 'org_admin']), getTopDestinations);
router.get('/bydate', authentication, verifyUserType(['admin', 'org_admin']), getHotelsByDate);
router.put('/update/:id', authentication, verifyUserType(['admin', 'org_admin']), updateHotel);
router.delete('/delete/:id', authentication, verifyUserType(['admin', 'org_admin']), deleteHotel);

export default router;
