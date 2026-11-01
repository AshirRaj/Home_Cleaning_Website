import { Router } from 'express';
import { reverseGeocode, searchAddress, getServiceAreas, checkServiceArea } from '../controllers/locationController.js';

const router = Router();

router.get('/reverse-geocode', reverseGeocode);
router.get('/search', searchAddress);
router.get('/service-areas', getServiceAreas);
router.get('/check', checkServiceArea);

export default router;

