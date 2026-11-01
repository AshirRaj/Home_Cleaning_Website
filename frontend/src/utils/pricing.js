// Isomorphic pricing calculation utility for Sagarika Odicare Services

export const PROPERTY_TYPE_MULTIPLIERS = {
  Apartment: 1.0,
  House: 1.15,
  Villa: 1.35,
  Office: 1.25,
  Other: 1.1,
};

export const calculateBookingPrice = ({
  basePrice = 1499,
  selectedServices = [],
  propertyType = 'Apartment',
  bedrooms = 1,
  bathrooms = 1,
  livingRooms = 1,
  selectedAddons = [], // array of addon objects { id, name, price }
  taxRate = 0.18, // 18% GST
  discountAmount = 0,
}) => {
  // If multiple services selected, sum their starting prices
  const totalServicesBasePrice =
    selectedServices.length > 0
      ? selectedServices.reduce((sum, s) => sum + (s.startingPrice || 0), 0)
      : basePrice;

  // Base room counts included in base price (1 bedroom, 1 bathroom)
  const baseBedrooms = 1;
  const baseBathrooms = 1;

  // Extra room surcharges (if > 1) or reduction
  const extraBedrooms = bedrooms - baseBedrooms;
  const extraBathrooms = bathrooms - baseBathrooms;
  const extraLivingRooms = Math.max(0, livingRooms - 1);

  const extraBedroomCost = extraBedrooms * 350;
  const extraBathroomCost = extraBathrooms * 450;
  const extraLivingRoomCost = extraLivingRooms * 300;

  // Calculate property type adjustment
  const multiplier = PROPERTY_TYPE_MULTIPLIERS[propertyType] || 1.0;
  const subtotalBeforeMultiplier = Math.max(
    499, // minimum base service fee
    totalServicesBasePrice + extraBedroomCost + extraBathroomCost + extraLivingRoomCost
  );
  const adjustedServiceSubtotal = Math.round(subtotalBeforeMultiplier * multiplier);

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addon) => sum + (addon.price || 0), 0);

  // Subtotal
  const subtotal = adjustedServiceSubtotal + addonsTotal;

  // Tax calculation
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * taxRate);

  // Final Total
  const total = Math.max(0, taxableAmount + tax);

  return {
    basePrice: totalServicesBasePrice,
    servicesCount: selectedServices.length || 1,
    extraBedroomCost,
    extraBathroomCost,
    extraLivingRoomCost,
    propertyMultiplier: multiplier,
    adjustedServiceSubtotal,
    addonsTotal,
    subtotal,
    discountAmount,
    tax,
    taxRatePercentage: taxRate * 100,
    total,
  };
};
