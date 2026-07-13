type PriceInput = {
  participantCount: number;
  nights: number;
  hotelPricePerPersonPerNight: number;
  activityPrices: number[];
  vehiclePricePerTrip: number;
};

export type PriceBreakdown = {
  hotelTotal: number;
  activitiesTotal: number;
  vehicleTotal: number;
  grandTotal: number;
};

export function calculatePrice({
  participantCount,
  nights,
  hotelPricePerPersonPerNight,
  activityPrices,
  vehiclePricePerTrip,
}: PriceInput): PriceBreakdown {
  const hotelTotal = hotelPricePerPersonPerNight * nights * participantCount;
  const activitiesTotal =
    activityPrices.reduce((sum, price) => sum + price, 0) * participantCount;
  const vehicleTotal = vehiclePricePerTrip;

  return {
    hotelTotal,
    activitiesTotal,
    vehicleTotal,
    grandTotal: hotelTotal + activitiesTotal + vehicleTotal,
  };
}

export function nightsFromDuration(durationDays: number) {
  return Math.max(durationDays - 1, 1);
}
