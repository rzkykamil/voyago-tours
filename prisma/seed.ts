import { prisma } from "../lib/prisma";

async function main() {
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.package.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.hotelOption.deleteMany();

  const [hiace, elf, bus] = await Promise.all([
    prisma.vehicle.create({
      data: { name: "Toyota Hiace", capacity: 12, pricePerTrip: 1_500_000 },
    }),
    prisma.vehicle.create({
      data: { name: "Isuzu Elf", capacity: 19, pricePerTrip: 2_200_000 },
    }),
    prisma.vehicle.create({
      data: { name: "Bus Pariwisata", capacity: 35, pricePerTrip: 3_800_000 },
    }),
  ]);

  await prisma.hotelOption.createMany({
    data: [
      { name: "Standard Hotel", pricePerPersonPerNight: 250_000 },
      { name: "Deluxe Hotel", pricePerPersonPerNight: 450_000 },
      { name: "Private Villa", pricePerPersonPerNight: 900_000 },
    ],
  });

  const bali = await prisma.package.create({
    data: {
      name: "Bali Explorer",
      slug: "bali-explorer",
      destination: "Bali",
      description:
        "Jelajahi pura ikonik, sawah terasering Ubud, dan pantai selatan Bali dalam 4 hari 3 malam.",
      durationDays: 4,
      activities: {
        create: [
          { name: "Tanah Lot Sunset Tour", pricePerPerson: 150_000 },
          { name: "Ubud Rice Terrace & Monkey Forest", pricePerPerson: 200_000 },
          { name: "Nusa Penida Island Hopping", pricePerPerson: 450_000 },
        ],
      },
      schedules: {
        create: [
          { vehicleId: hiace.id, departureDate: new Date("2026-08-10"), seatsBooked: 4 },
          { vehicleId: elf.id, departureDate: new Date("2026-08-24"), seatsBooked: 0 },
          { vehicleId: bus.id, departureDate: new Date("2026-09-07"), seatsBooked: 12 },
        ],
      },
    },
  });

  const yogya = await prisma.package.create({
    data: {
      name: "Yogyakarta Heritage Trail",
      slug: "yogyakarta-heritage-trail",
      destination: "Yogyakarta",
      description:
        "Napak tilas sejarah di Candi Borobudur dan Prambanan, ditutup dengan malam budaya di Malioboro.",
      durationDays: 3,
      activities: {
        create: [
          { name: "Borobudur Sunrise Tour", pricePerPerson: 300_000 },
          { name: "Prambanan Ramayana Ballet", pricePerPerson: 250_000 },
          { name: "Malioboro Culinary Walk", pricePerPerson: 100_000 },
        ],
      },
      schedules: {
        create: [
          { vehicleId: hiace.id, departureDate: new Date("2026-08-15"), seatsBooked: 8 },
          { vehicleId: elf.id, departureDate: new Date("2026-09-05"), seatsBooked: 2 },
        ],
      },
    },
  });

  const rajaAmpat = await prisma.package.create({
    data: {
      name: "Raja Ampat Diving Adventure",
      slug: "raja-ampat-diving-adventure",
      destination: "Raja Ampat, Papua Barat",
      description:
        "Snorkeling dan diving di perairan terjernih Indonesia bersama biota laut Raja Ampat selama 5 hari.",
      durationDays: 5,
      activities: {
        create: [
          { name: "Piaynemo Viewpoint Trekking", pricePerPerson: 350_000 },
          { name: "Wayag Island Snorkeling", pricePerPerson: 600_000 },
          { name: "Manta Point Diving Trip", pricePerPerson: 950_000 },
        ],
      },
      schedules: {
        create: [
          { vehicleId: elf.id, departureDate: new Date("2026-09-12"), seatsBooked: 5 },
          { vehicleId: elf.id, departureDate: new Date("2026-10-03"), seatsBooked: 0 },
        ],
      },
    },
  });

  const bromoIjen = await prisma.package.create({
    data: {
      name: "Bromo Ijen Sunrise Expedition",
      slug: "bromo-ijen-sunrise-expedition",
      destination: "Jawa Timur",
      description:
        "Ekspedisi lintas gunung: sunrise di Bromo dan blue fire di Kawah Ijen dalam 3 hari 2 malam.",
      durationDays: 3,
      activities: {
        create: [
          { name: "Mount Bromo Jeep Sunrise Tour", pricePerPerson: 400_000 },
          { name: "Kawah Ijen Blue Fire Trekking", pricePerPerson: 500_000 },
        ],
      },
      schedules: {
        create: [
          { vehicleId: hiace.id, departureDate: new Date("2026-08-20"), seatsBooked: 10 },
          { vehicleId: hiace.id, departureDate: new Date("2026-09-18"), seatsBooked: 12 },
        ],
      },
    },
  });

  console.log("Seeded packages:", [bali, yogya, rajaAmpat, bromoIjen].map((p) => p.slug).join(", "));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
