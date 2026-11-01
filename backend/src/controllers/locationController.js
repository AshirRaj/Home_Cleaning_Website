import { reverseGeocodeBackend, searchAddressBackend, SUPPORTED_SERVICE_AREAS, validateServiceArea } from '../services/locationService.js';

export const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon, latitude, longitude, accuracy } = req.query;

    const targetLat = lat || latitude;
    const targetLon = lon || longitude;

    if (!targetLat || !targetLon) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both lat and lon query parameters.',
        code: 'VALIDATION_ERROR',
      });
    }

    const result = await reverseGeocodeBackend(targetLat, targetLon, accuracy);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const searchAddress = async (req, res, next) => {
  try {
    const { query, q } = req.query;
    const searchStr = query || q;
    const result = await searchAddressBackend(searchStr);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getServiceAreas = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      serviceAreas: SUPPORTED_SERVICE_AREAS,
    });
  } catch (error) {
    next(error);
  }
};

export const checkServiceArea = async (req, res, next) => {
  try {
    const { city } = req.query;
    const isSupported = validateServiceArea(city);
    return res.status(200).json({
      success: true,
      city,
      isSupported,
    });
  } catch (error) {
    next(error);
  }
};

