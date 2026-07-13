"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { calculatePrice, nightsFromDuration } from "@/lib/pricing";
import { createBooking, type BookingFormState } from "./actions";

type HotelOption = {
  id: number;
  name: string;
  pricePerPersonPerNight: number;
};

type BookingFormProps = {
  scheduleId: number;
  durationDays: number;
  vehiclePricePerTrip: number;
  activityPrices: number[];
  hotelOptions: HotelOption[];
  seatsRemaining: number;
};

const initialState: BookingFormState = {};

export function BookingForm({
  scheduleId,
  durationDays,
  vehiclePricePerTrip,
  activityPrices,
  hotelOptions,
  seatsRemaining,
}: BookingFormProps) {
  const [hotelOptionId, setHotelOptionId] = useState(hotelOptions[0]?.id ?? 0);
  const [participantCount, setParticipantCount] = useState(1);
  const [state, formAction, isPending] = useActionState(
    createBooking.bind(null, scheduleId),
    initialState
  );

  const nights = nightsFromDuration(durationDays);
  const selectedHotel = hotelOptions.find((option) => option.id === hotelOptionId);

  const breakdown = useMemo(() => {
    return calculatePrice({
      participantCount: Number.isFinite(participantCount) ? participantCount : 0,
      nights,
      hotelPricePerPersonPerNight: selectedHotel?.pricePerPersonPerNight ?? 0,
      activityPrices,
      vehiclePricePerTrip,
    });
  }, [participantCount, nights, selectedHotel, activityPrices, vehiclePricePerTrip]);

  return (
    <form action={formAction} className="mt-6 space-y-6">
      <div className="space-y-4 rounded-xl ring-1 ring-foreground/10 p-4">
        <div className="space-y-1.5">
          <Label htmlFor="participantCount">Jumlah peserta</Label>
          <Input
            id="participantCount"
            name="participantCount"
            type="number"
            min={1}
            max={seatsRemaining}
            value={participantCount}
            onChange={(event) => setParticipantCount(Number(event.target.value))}
            required
          />
          <p className="text-xs text-muted-foreground">
            Sisa kursi tersedia: {seatsRemaining}
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hotelOptionId">Opsi hotel</Label>
          <select
            id="hotelOptionId"
            name="hotelOptionId"
            value={hotelOptionId}
            onChange={(event) => setHotelOptionId(Number(event.target.value))}
            className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            required
          >
            {hotelOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} — {formatCurrency(option.pricePerPersonPerNight)} / orang / malam
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="customerName">Nama lengkap</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerEmail">Email</Label>
            <Input id="customerEmail" name="customerEmail" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerPhone">No. telepon</Label>
            <Input id="customerPhone" name="customerPhone" type="tel" required />
          </div>
        </div>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10 p-4">
        <h3 className="text-sm font-semibold">Rincian Harga</h3>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Hotel ({nights} malam × {participantCount || 0} orang)
            </dt>
            <dd>{formatCurrency(breakdown.hotelTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Aktivitas ({participantCount || 0} orang)
            </dt>
            <dd>{formatCurrency(breakdown.activitiesTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Kendaraan (per trip)</dt>
            <dd>{formatCurrency(breakdown.vehicleTotal)}</dd>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <dt>Total</dt>
            <dd>{formatCurrency(breakdown.grandTotal)}</dd>
          </div>
        </dl>
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" disabled={isPending || seatsRemaining <= 0}>
        {isPending ? "Memproses..." : "Konfirmasi Booking"}
      </Button>
    </form>
  );
}
