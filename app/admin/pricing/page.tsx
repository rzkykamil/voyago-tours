import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { updateActivityPrice, updateHotelPrice, updateVehiclePrice } from "./actions";
import { Home, Car, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Kelola Harga — Voyago Admin",
};

async function getPricingData() {
  const [hotelOptions, vehicles, packages] = await Promise.all([
    prisma.hotelOption.findMany({ orderBy: { pricePerPersonPerNight: "asc" } }),
    prisma.vehicle.findMany({ orderBy: { capacity: "asc" } }),
    prisma.package.findMany({
      include: { activities: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { hotelOptions, vehicles, packages };
}

export default async function AdminPricingPage() {
  const { hotelOptions, vehicles, packages } = await getPricingData();

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Kelola Harga
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Perubahan harga langsung memengaruhi kalkulator harga di halaman booking.
        </p>
      </div>

      {/* HOTEL SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Home className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Opsi Hotel</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotelOptions.map((hotel) => (
            <Card key={hotel.id} className="overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">{hotel.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  action={updateHotelPrice.bind(null, hotel.id)}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="number"
                    name="price"
                    min={0}
                    defaultValue={hotel.pricePerPersonPerNight}
                    className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                  />
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Simpan
                  </Button>
                </form>
                <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">per orang / malam</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* VEHICLE SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Car className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Kendaraan</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 dark:border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {vehicle.name} • <span className="text-muted-foreground">kapasitas {vehicle.capacity}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  action={updateVehiclePrice.bind(null, vehicle.id)}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="number"
                    name="price"
                    min={0}
                    defaultValue={vehicle.pricePerTrip}
                    className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                  />
                  <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Simpan
                  </Button>
                </form>
                <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">per trip</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ACTIVITIES SECTION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">Aktivitas per Paket</h2>
        </div>
        <div className="space-y-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{pkg.name}</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pkg.activities.map((activity) => (
                  <Card key={activity.id} className="overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border-slate-200/80 dark:border-slate-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">{activity.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form
                        action={updateActivityPrice.bind(null, activity.id)}
                        className="flex items-center gap-2"
                      >
                        <Input
                          type="number"
                          name="price"
                          min={0}
                          defaultValue={activity.pricePerPerson}
                          className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                        />
                        <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                          Simpan
                        </Button>
                      </form>
                      <p className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">per orang</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
