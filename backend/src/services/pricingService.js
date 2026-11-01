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
  selectedAddons = [],
  taxRate = 0.18,
  discountAmount = 0,
}) => {
  const totalServicesBasePrice =
    selectedServices && selectedServices.length > 0
      ? selectedServices.reduce((sum, s) => sum + (Number(s.startingPrice) || 0), 0)
      : Number(basePrice) || 1499;

  const baseBedrooms = 1;
  const baseBathrooms = 1;

  const extraBedrooms = Math.max(0, (Number(bedrooms) || 1) - baseBedrooms);
  const extraBathrooms = Math.max(0, (Number(bathrooms) || 1) - baseBathrooms);
  const extraLivingRooms = Math.max(0, (Number(livingRooms) || 1) - 1);

  const extraBedroomCost = extraBedrooms * 350;
  const extraBathroomCost = extraBathrooms * 450;
  const extraLivingRoomCost = extraLivingRooms * 300;

  const multiplier = PROPERTY_TYPE_MULTIPLIERS[propertyType] || 1.0;
  const subtotalBeforeMultiplier = Math.max(
    499,
    totalServicesBasePrice + extraBedroomCost + extraBathroomCost + extraLivingRoomCost
  );
  const adjustedServiceSubtotal = Math.round(subtotalBeforeMultiplier * multiplier);

  const addonsTotal = (selectedAddons || []).reduce((sum, addon) => sum + (Number(addon.price) || 0), 0);

  const subtotal = adjustedServiceSubtotal + addonsTotal;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * taxRate);
  const total = Math.max(0, taxableAmount + tax);

  return {
    basePrice: totalServicesBasePrice,
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
