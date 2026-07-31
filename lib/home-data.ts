import { prisma } from "@/lib/prisma";
import { calculatePrice, nightsFromDuration } from "@/lib/pricing";

/**
 * Single aggregated data source for the homepage. Every section reads from here
 * instead of running its own query, so the "manifest" numbers in S01/S03/S04/S07
 * always agree with each other and with the DB.
 */

export type DestinationRow = {
  id: number;
  slug: string;
  name: string;
  destination: string;
  durationDays: number;
  nextDepartureISO: string | null;
  status: "available" | "full" | "unscheduled";
};

export type DepartureRow = {
  scheduleId: number;
  packageName: string;
  packageSlug: string;
  destination: string;
  vehicleName: string;
  departureISO: string;
  capacity: number;
  seatsBooked: number;
  seatsLeft: number;
};

export type PricingScenario = {
  packageName: string;
  destination: string;
  participantCount: number;
  nights: number;
  hotelName: string;
  hotelPricePerPersonPerNight: number;
  activityPrices: number[];
  activityCount: number;
  vehicleName: string;
  vehiclePricePerTrip: number;
  breakdown: ReturnType<typeof calculatePrice>;
};

export type CapacitySnapshot = {
  packageName: string;
  destination: string;
  vehicleName: string;
  capacity: number;
  seatsBooked: number;
  seatsLeft: number;
  departureISO: string;
  isFull: boolean;
};

export type HomeData = {
  destinationCount: number;
  upcomingDepartureCount: number;
  nearestDepartureISO: string | null;
  startingFromPrice: number;
  destinations: DestinationRow[];
  departures: DepartureRow[];
  pricingScenario: PricingScenario | null;
  capacitySnapshot: CapacitySnapshot | null;
  nearestBoardingPass: DepartureRow | null;
};

export async function getHomeData(): Promise<HomeData> {
  const now = new Date();

  const [packages, hotelOptions] = await Promise.all([
    prisma.package.findMany({
      orderBy: { name: "asc" },
      include: {
        activities: true,
        schedules: {
          orderBy: { departureDate: "asc" },
          include: { vehicle: true },
        },
      },
    }),
    prisma.hotelOption.findMany({ orderBy: { pricePerPersonPerNight: "asc" } }),
  ]);

  const destinations: DestinationRow[] = packages.map((pkg) => {
    const upcoming = pkg.schedules.filter((s) => s.departureDate >= now);
    const available = upcoming.find((s) => s.vehicle.capacity - s.seatsBooked > 0);
    const next = available ?? upcoming[0];

    return {
      id: pkg.id,
      slug: pkg.slug,
      name: pkg.name,
      destination: pkg.destination,
      durationDays: pkg.durationDays,
      nextDepartureISO: next ? next.departureDate.toISOString() : null,
      status: !next ? "unscheduled" : available ? "available" : "full",
    };
  });

  const departures: DepartureRow[] = packages
    .flatMap((pkg) =>
      pkg.schedules
        .filter((s) => s.departureDate >= now)
        .map((s) => ({
          scheduleId: s.id,
          packageName: pkg.name,
          packageSlug: pkg.slug,
          destination: pkg.destination,
          vehicleName: s.vehicle.name,
          departureISO: s.departureDate.toISOString(),
          capacity: s.vehicle.capacity,
          seatsBooked: s.seatsBooked,
          seatsLeft: s.vehicle.capacity - s.seatsBooked,
        }))
    )
    .sort((a, b) => a.departureISO.localeCompare(b.departureISO));

  const nearest = departures[0] ?? null;

  // Pricing scenario: cheapest package's nearest departure, 4 participants, cheapest hotel.
  const cheapestHotel = hotelOptions[0] ?? null;
  let pricingScenario: PricingScenario | null = null;

  if (nearest && cheapestHotel) {
    const pkg = packages.find((p) => p.slug === nearest.packageSlug)!;
    const schedule = pkg.schedules.find((s) => s.id === nearest.scheduleId)!;
    const nights = nightsFromDuration(pkg.durationDays);
    const activityPrices = pkg.activities.map((a) => a.pricePerPerson);
    const participantCount = 4;

    pricingScenario = {
      packageName: pkg.name,
      destination: pkg.destination,
      participantCount,
      nights,
      hotelName: cheapestHotel.name,
      hotelPricePerPersonPerNight: cheapestHotel.pricePerPersonPerNight,
      activityPrices,
      activityCount: activityPrices.length,
      vehicleName: schedule.vehicle.name,
      vehiclePricePerTrip: schedule.vehicle.pricePerTrip,
      breakdown: calculatePrice({
        participantCount,
        nights,
        hotelPricePerPersonPerNight: cheapestHotel.pricePerPersonPerNight,
        activityPrices,
        vehiclePricePerTrip: schedule.vehicle.pricePerTrip,
      }),
    };
  }

  const capacitySnapshot: CapacitySnapshot | null = nearest
    ? {
        packageName: nearest.packageName,
        destination: nearest.destination,
        vehicleName: nearest.vehicleName,
        capacity: nearest.capacity,
        seatsBooked: nearest.seatsBooked,
        seatsLeft: nearest.seatsLeft,
        departureISO: nearest.departureISO,
        isFull: nearest.seatsLeft <= 0,
      }
    : null;

  // "Starting from" price: cheapest grand total across all packages' nearest departure,
  // scenario = 2 participants, cheapest hotel, no optional activities.
  const startingFromPrice = packages.reduce((min, pkg) => {
    const upcoming = pkg.schedules.filter((s) => s.departureDate >= now);
    if (upcoming.length === 0 || !cheapestHotel) return min;
    const schedule = upcoming[0];
    const total = calculatePrice({
      participantCount: 2,
      nights: nightsFromDuration(pkg.durationDays),
      hotelPricePerPersonPerNight: cheapestHotel.pricePerPersonPerNight,
      activityPrices: [],
      vehiclePricePerTrip: schedule.vehicle.pricePerTrip,
    }).grandTotal;
    return min === 0 ? total : Math.min(min, total);
  }, 0);

  return {
    destinationCount: packages.length,
    upcomingDepartureCount: departures.length,
    nearestDepartureISO: nearest?.departureISO ?? null,
    startingFromPrice,
    destinations,
    departures,
    pricingScenario,
    capacitySnapshot,
    nearestBoardingPass: nearest,
  };
}
