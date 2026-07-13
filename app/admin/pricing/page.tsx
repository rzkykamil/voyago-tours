import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import { updateActivityPrice, updateHotelPrice, updateVehiclePrice } from "./actions";

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
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kelola Harga</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Perubahan harga langsung memengaruhi kalkulator harga di halaman booking.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold">Opsi Hotel</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hotelOptions.map((hotel) => (
            <Card key={hotel.id}>
              <CardHeader>
                <CardTitle className="text-sm">{hotel.name}</CardTitle>
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
                  />
                  <Button type="submit" size="sm">
                    Simpan
                  </Button>
                </form>
                <p className="mt-1 text-xs text-muted-foreground">per orang / malam</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Kendaraan</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle className="text-sm">
                  {vehicle.name} · kapasitas {vehicle.capacity}
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
                  />
                  <Button type="submit" size="sm">
                    Simpan
                  </Button>
                </form>
                <p className="mt-1 text-xs text-muted-foreground">per trip</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Aktivitas per Paket</h2>
        <div className="mt-4 space-y-6">
          {packages.map((pkg) => (
            <div key={pkg.id}>
              <h3 className="text-sm font-medium text-muted-foreground">{pkg.name}</h3>
              <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pkg.activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader>
                      <CardTitle className="text-sm">{activity.name}</CardTitle>
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
                        />
                        <Button type="submit" size="sm">
                          Simpan
                        </Button>
                      </form>
                      <p className="mt-1 text-xs text-muted-foreground">per orang</p>
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
