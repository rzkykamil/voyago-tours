"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import { calculatePrice, nightsFromDuration } from "@/lib/pricing";
import { createBooking, type BookingFormState } from "./actions";
import { Users, Mail, Phone, User, Home, Calculator } from "lucide-react";

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
    <form action={formAction} className="space-y-6">
      {/* SECTION 1: PESERTA & HOTEL */}
      <div className="space-y-4 rounded-xl overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <Users className="h-5 w-5 text-primary dark:text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Peserta & Akomodasi</h3>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="participantCount" className="text-card-foreground font-medium">Jumlah peserta</Label>
          <Input
            id="participantCount"
            name="participantCount"
            type="number"
            min={1}
            max={seatsRemaining}
            value={participantCount}
            onChange={(event) => setParticipantCount(Number(event.target.value))}
            className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
            required
          />
          <p className="text-xs text-primary dark:text-primary font-medium">
            ✓ Sisa kursi tersedia: <strong>{seatsRemaining}</strong> kursi
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hotelOptionId" className="flex items-center gap-2 text-card-foreground font-medium">
            <Home className="h-4 w-4 text-primary" />
            Pilih opsi hotel
          </Label>
          <select
            id="hotelOptionId"
            name="hotelOptionId"
            value={hotelOptionId}
            onChange={(event) => setHotelOptionId(Number(event.target.value))}
            className="h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 text-sm outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-indigo-400/50"
            required
          >
            {hotelOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} — {formatCurrency(option.pricePerPersonPerNight)} / orang / malam
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 2: DATA PEMESAN */}
      <div className="space-y-4 rounded-xl overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/80 dark:border-slate-800 p-6">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <User className="h-5 w-5 text-primary dark:text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Data Pemesan</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="customerName" className="text-card-foreground font-medium">Nama lengkap</Label>
            <Input
              id="customerName"
              name="customerName"
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerEmail" className="flex items-center gap-2 text-card-foreground font-medium">
              <Mail className="h-4 w-4 text-slate-400" />
              Email
            </Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerPhone" className="flex items-center gap-2 text-card-foreground font-medium">
              <Phone className="h-4 w-4 text-slate-400" />
              No. telepon
            </Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: RINCIAN HARGA */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50/40 to-secondary-50/40 dark:from-indigo-950/20 dark:to-slate-900/40 border border-primary-100/50 dark:border-primary-900/30 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary dark:text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Rincian Harga</h3>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2">
            <dt className="text-slate-600 dark:text-slate-400">
              Hotel ({nights} malam × {participantCount || 0} orang)
            </dt>
            <dd className="font-semibold text-card-foreground">{formatCurrency(breakdown.hotelTotal)}</dd>
          </div>
          <div className="flex justify-between items-center pb-2">
            <dt className="text-slate-600 dark:text-slate-400">
              Aktivitas ({participantCount || 0} orang)
            </dt>
            <dd className="font-semibold text-card-foreground">{formatCurrency(breakdown.activitiesTotal)}</dd>
          </div>
          <div className="flex justify-between items-center pb-2">
            <dt className="text-slate-600 dark:text-slate-400">Kendaraan (per trip)</dt>
            <dd className="font-semibold text-card-foreground">{formatCurrency(breakdown.vehicleTotal)}</dd>
          </div>
          <div className="flex justify-between items-center border-t border-primary-200/50 dark:border-primary-900/50 pt-3 font-bold">
            <dt className="text-card-foreground">Total Pembayaran</dt>
            <dd className="text-lg text-primary dark:text-primary">{formatCurrency(breakdown.grandTotal)}</dd>
          </div>
        </dl>
      </div>

      {state.error && (
        <div className="flex items-start gap-3 rounded-lg bg-destructive-50 dark:bg-destructive-950/20 border border-destructive-200 dark:border-destructive-900/40 p-3">
          <p className="text-sm text-destructive-700 dark:text-destructive-300 font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || seatsRemaining <= 0}
        className="w-full bg-primary hover:bg-primary text-white font-semibold py-3 rounded-lg shadow-sm hover:shadow transition-all"
      >
        {isPending ? "Memproses Booking..." : "Konfirmasi Booking"}
      </Button>
    </form>
  );
}
