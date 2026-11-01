import { axiosInstance } from './axiosInstance';

export const locationApi = {
  searchAddress: async (query) => {
    if (!query || query.trim().length < 3) return [];
    try {
      const response = await axiosInstance.get('/location/search', {
        params: { q: query },
      });
      return response.data?.data || [];
    } catch (err) {
      console.warn('[LocationAPI Frontend]: Address search error:', err);
      return [];
    }
  },

  getCurrentLocation: async () => {
    // Helper 1: Call Backend Location API endpoint for reverse geocoding
    const reverseGeocodeViaBackend = async (latitude, longitude, accuracy) => {
      try {
        const response = await axiosInstance.get('/location/reverse-geocode', {
          params: { lat: latitude, lon: longitude, accuracy },
        });

        if (response.data && response.data.data) {
          return response.data.data;
        }
      } catch (err) {
        console.warn('[LocationAPI Frontend]: Backend reverse geocode error, executing direct fallback:', err);
      }

      // Direct Nominatim Client Fallback if backend API is offline
      try {
        const nomResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        if (nomResponse.ok) {
          const nomData = await nomResponse.json();
          const addr = nomData.address || {};

          const houseNumber = addr.house_number || '';
          const flatNumber = addr.flat_number || addr.flat || addr.unit || '';
          const buildingName = addr.building || '';

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

          let ward = addr.ward || '';
          if (!ward && addr.city_district && addr.city_district.toLowerCase().includes('ward')) {
            ward = addr.city_district;
          }

          const landmark = addr.amenity || addr.tourism || addr.shop || addr.historic || '';
          const city = addr.city || addr.town || addr.village || addr.municipality || '';
          const district = addr.county || addr.state_district || '';
          const state = addr.state || '';
          const postalCode = addr.postcode || '';
          const formattedAddress = nomData.display_name || '';

          return {
            latitude,
            longitude,
            accuracy: accuracy || null,

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
        }
      } catch (e) {
        console.warn('[LocationAPI Frontend]: Direct Nominatim fallback error:', e);
      }

      return {
        latitude,
        longitude,
        accuracy: accuracy || null,

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

        source: 'nominatim',
      };
    };

    // Helper 2: IP Location Fallback if browser GPS is denied/unavailable (City/State ONLY)
    const getIpLocationFallback = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
          const data = await response.json();
          const city = data.city || data.region || '';
          const state = data.region || '';
          const latitude = data.latitude || null;
          const longitude = data.longitude || null;

          return {
            latitude,
            longitude,
            accuracy: null,

            formattedAddress: [city, state].filter(Boolean).join(', '),

            houseNumber: '',
            flatNumber: '',
            buildingName: '',

            street: '',
            locality: '',
            neighbourhood: '',
            ward: '',
            landmark: '',

            city,
            district: '',
            state,
            postalCode: '',

            source: 'ip',
            isExactGps: false,
          };
        }
      } catch (err) {
        console.warn('[LocationAPI Frontend]: IP fallback error:', err);
      }

      throw new Error('Unable to detect your current location. Please search or enter your address manually.');
    };

    // Main Execution Flow: Request High Accuracy Browser Coordinates & Pass to Backend
    return new Promise((resolve, reject) => {
      if (!navigator || !navigator.geolocation) {
        getIpLocationFallback().then(resolve).catch(reject);
        return;
      }

      let resolved = false;

      // Attempt 1: High Accuracy Hardware positioning
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (resolved) return;
          resolved = true;
          const { latitude, longitude, accuracy } = position.coords;
          const addressObj = await reverseGeocodeViaBackend(latitude, longitude, accuracy);
          resolve(addressObj);
        },
        (highErr) => {
          console.warn('[LocationAPI Frontend]: High accuracy failed, trying low accuracy:', highErr.message);

          // Attempt 2: Low Accuracy Network positioning
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              if (resolved) return;
              resolved = true;
              const { latitude, longitude, accuracy } = pos.coords;
              const addressObj = await reverseGeocodeViaBackend(latitude, longitude, accuracy);
              resolve(addressObj);
            },
            async (lowErr) => {
              console.warn('[LocationAPI Frontend]: Geolocation failed:', lowErr.message);
              if (resolved) return;
              resolved = true;
              getIpLocationFallback().then(resolve).catch(reject);
            },
            { enableHighAccuracy: false, timeout: 8000, maximumAge: 30000 }
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );

      // Safety timeout
      setTimeout(async () => {
        if (!resolved) {
          resolved = true;
          getIpLocationFallback().then(resolve).catch(reject);
        }
      }, 16000);
    });
  },
};


