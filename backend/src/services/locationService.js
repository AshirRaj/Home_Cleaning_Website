import axios from 'axios';

export const SUPPORTED_SERVICE_AREAS = [
  {
    city: 'Bhubaneswar',
    state: 'Odisha',
    center: { latitude: 20.2961, longitude: 85.8245 },
    postalCodes: ['751001', '751002', '751003', '751006', '751007', '751010', '751012', '751013', '751019', '751024'],
  },
  {
    city: 'Cuttack',
    state: 'Odisha',
    center: { latitude: 20.4625, longitude: 85.8828 },
    postalCodes: ['753001', '753002', '753003', '753008', '753012', '753014'],
  },
  {
    city: 'Puri',
    state: 'Odisha',
    center: { latitude: 19.8135, longitude: 85.8312 },
    postalCodes: ['752001', '752002', '752003'],
  },
  {
    city: 'Khorda',
    state: 'Odisha',
    center: { latitude: 20.1862, longitude: 85.6174 },
    postalCodes: ['752055', '752056', '752057'],
  },
];

export const normalizeNominatimAddress = (nominatimData, latitude, longitude, accuracy = null) => {
  const addr = nominatimData?.address || {};

  // HOUSE NUMBER: ONLY address.house_number. Do NOT use building, amenity, office, shop, road, ward, etc.
  const houseNumber = addr.house_number || '';
  const flatNumber = addr.flat_number || addr.flat || addr.unit || '';
  const buildingName = addr.building || '';

  // STREET: Combination of road, neighbourhood, suburb, quarter, residential, etc. without duplicates
  const streetParts = [
    addr.road,
    addr.neighbourhood,
    addr.suburb,
    addr.quarter,
    addr.residential,
  ].filter(Boolean);
  const street = [...new Set(streetParts)].join(', ');

  const locality = addr.neighbourhood || addr.suburb || addr.locality || addr.quarter || addr.hamlet || '';
  const neighbourhood = addr.neighbourhood || addr.suburb || '';

  // WARD: address.ward or city_district if appropriate
  let ward = addr.ward || '';
  if (!ward && addr.city_district && addr.city_district.toLowerCase().includes('ward')) {
    ward = addr.city_district;
  }

  // LANDMARK: Genuine available POI/landmark if available
  const landmark = addr.amenity || addr.tourism || addr.shop || addr.historic || '';

  // CITY: Priority address.city || address.town || address.village || address.municipality || ""
  const city = addr.city || addr.town || addr.village || addr.municipality || '';
  const district = addr.county || addr.state_district || '';
  const state = addr.state || '';
  const postalCode = addr.postcode || '';
  const formattedAddress = nominatimData?.display_name || '';

  return {
    latitude: Number(latitude),
    longitude: Number(longitude),
    accuracy: accuracy ? Number(accuracy) : null,

    formattedAddress,

    houseNumber,
    flatNumber,
    buildingName,

    street,
    locality,
    neighbourhood,
    ward,
    landmark,

    city,
    district,
    state,
    postalCode,

    source: 'nominatim',
  };
};

export const searchAddressBackend = async (query) => {
  if (!query || query.trim().length < 3) {
    return { success: true, data: [] };
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&addressdetails=1&limit=5`,
      {
        headers: {
          'User-Agent': 'SagarikaCleaningBackend/1.0 (info@sagarika.com)',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 5000,
      }
    );

    const results = (response.data || []).map((item) => {
      const normalized = normalizeNominatimAddress(item, item.lat, item.lon);
      return {
        displayName: item.display_name,
        latitude: Number(item.lat),
        longitude: Number(item.lon),
        normalized,
      };
    });

    return { success: true, data: results };
  } catch (error) {
    console.warn('[LocationService Backend]: Address search error:', error.message);
    return { success: false, message: 'Address search failed', data: [] };
  }
};

export const reverseGeocodeBackend = async (lat, lon, accuracy = null) => {
  const latitude = Number(lat);
  const longitude = Number(lon);
  const acc = accuracy ? Number(accuracy) : null;

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid latitude or longitude coordinates provided.');
  }

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SagarikaCleaningBackend/1.0 (info@sagarika.com)',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 5000,
      }
    );

    if (response.data && response.data.address) {
      const normalized = normalizeNominatimAddress(response.data, latitude, longitude, acc);
      return {
        success: true,
        data: normalized,
      };
    }
  } catch (error) {
    console.warn('[LocationService Backend]: Nominatim lookup failed:', error.message);
  }

  // Fallback
  return {
    success: true,
    data: {
      latitude,
      longitude,
      accuracy: acc,

      formattedAddress: '',

      houseNumber: '',
      flatNumber: '',
      buildingName: '',

      street: '',
      locality: '',
      neighbourhood: '',
      ward: '',
      landmark: '',

      city: '',
      district: '',
      state: '',
      postalCode: '',

      source: 'nominatim_fallback',
    },
  };
};

export const validateServiceArea = (city) => {
  if (!city) return false;
  const cityLower = city.toLowerCase().trim();
  return SUPPORTED_SERVICE_AREAS.some(
    (area) => area.city.toLowerCase() === cityLower || (cityLower.includes('khorda') || cityLower.includes('khordha'))
  );
};


