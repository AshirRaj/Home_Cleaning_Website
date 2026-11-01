/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { calculateBookingPrice } from '../utils/pricing';
import { MOCK_SERVICES } from '../mock/services';

const BookingContext = createContext();

const initialBookingState = {
  currentStep: 1,
  selectedServices: [MOCK_SERVICES[0]], // Default service in array
  service: MOCK_SERVICES[0], // Backward compatibility
  property: {
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    livingRooms: 1,
    propertySize: '1200 sq ft',
    specialRequirements: '',
  },
  address: {
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    apartmentUnit: '',
    landmark: '',
    city: 'Bhubaneswar',
    state: 'Odisha',
    postalCode: '',
  },
  schedule: {
    date: '',
    timeSlot: '',
  },
  customer: {
    fullName: '',
    email: '',
    phone: '',
    whatsApp: '',
    alternatePhone: '',
    specialInstructions: '',
    agreeTerms: true,
    agreeNotifications: true,
  },
  selectedAddons: [],
  bookingId: null,
  payment: {
    method: 'UPI',
    status: 'Pending',
    transactionId: null,
  },
};

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState(() => {
    const saved = localStorage.getItem('sparkle_booking_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure selectedServices exists as array
        if (!parsed.selectedServices || parsed.selectedServices.length === 0) {
          parsed.selectedServices = parsed.service ? [parsed.service] : [MOCK_SERVICES[0]];
        }
        return parsed;
      } catch {
        return initialBookingState;
      }
    }
    return initialBookingState;
  });

  // Save draft state to localStorage
  useEffect(() => {
    localStorage.setItem('sparkle_booking_draft', JSON.stringify(bookingState));
  }, [bookingState]);

  // Derived dynamic pricing calculation
  const selectedServices = bookingState.selectedServices || [bookingState.service || MOCK_SERVICES[0]];

  const pricing = calculateBookingPrice({
    basePrice: selectedServices[0]?.startingPrice || 1499,
    selectedServices,
    propertyType: bookingState.property?.propertyType || 'Apartment',
    bedrooms: bookingState.property?.bedrooms ?? 1,
    bathrooms: bookingState.property?.bathrooms ?? 1,
    livingRooms: bookingState.property?.livingRooms ?? 1,
    selectedAddons: bookingState.selectedAddons || [],
  });

  const setStep = (step) => {
    setBookingState((prev) => ({ ...prev, currentStep: step }));
  };

  const setService = (service) => {
    setBookingState((prev) => ({
      ...prev,
      service,
      selectedServices: [service],
      selectedAddons: [],
    }));
  };

  const toggleService = (serviceObj) => {
    setBookingState((prev) => {
      const currentList = prev.selectedServices || [prev.service || MOCK_SERVICES[0]];
      const exists = currentList.some((s) => s.id === serviceObj.id);

      let updatedList;
      if (exists) {
        // Prevent unselecting all services; keep at least 1
        if (currentList.length <= 1) {
          return prev;
        }
        updatedList = currentList.filter((s) => s.id !== serviceObj.id);
      } else {
        updatedList = [...currentList, serviceObj];
      }

      return {
        ...prev,
        selectedServices: updatedList,
        service: updatedList[0],
        selectedAddons: [],
      };
    });
  };

  const setSelectedServices = (servicesArray) => {
    if (!servicesArray || servicesArray.length === 0) return;
    setBookingState((prev) => ({
      ...prev,
      selectedServices: servicesArray,
      service: servicesArray[0],
      selectedAddons: [],
    }));
  };

  const updateProperty = (propertyData) => {
    setBookingState((prev) => ({
      ...prev,
      property: { ...prev.property, ...propertyData },
    }));
  };

  const updateAddress = (addressData) => {
    setBookingState((prev) => ({
      ...prev,
      address: { ...prev.address, ...addressData },
      customer: {
        ...prev.customer,
        fullName: prev.customer.fullName || addressData.fullName || '',
        email: prev.customer.email || addressData.email || '',
        phone: prev.customer.phone || addressData.phone || '',
        whatsApp: prev.customer.whatsApp || addressData.phone || '',
      },
    }));
  };

  const updateSchedule = (scheduleData) => {
    setBookingState((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, ...scheduleData },
    }));
  };

  const updateCustomer = (customerData) => {
    setBookingState((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...customerData },
    }));
  };

  const toggleAddon = (addon) => {
    setBookingState((prev) => {
      const exists = prev.selectedAddons.some((item) => item.id === addon.id);
      const updatedAddons = exists
        ? prev.selectedAddons.filter((item) => item.id !== addon.id)
        : [...prev.selectedAddons, addon];
      return { ...prev, selectedAddons: updatedAddons };
    });
  };

  const updatePayment = (paymentData) => {
    setBookingState((prev) => ({
      ...prev,
      payment: { ...prev.payment, ...paymentData },
    }));
  };

  const setBookingId = (id) => {
    setBookingState((prev) => ({ ...prev, bookingId: id }));
  };

  const resetBooking = () => {
    setBookingState(initialBookingState);
    localStorage.removeItem('sparkle_booking_draft');
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        pricing,
        selectedServices,
        setStep,
        setService,
        toggleService,
        setSelectedServices,
        updateProperty,
        updateAddress,
        updateSchedule,
        updateCustomer,
        toggleAddon,
        updatePayment,
        setBookingId,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookingStore = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingStore must be used within a BookingProvider');
  }
  return context;
};
