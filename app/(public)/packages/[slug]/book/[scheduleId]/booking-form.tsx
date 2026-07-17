"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/reveal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatPhoneNumber, formatEmail, formatName, validateEmail, validatePhoneNumber } from "@/lib/format";
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
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
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
      <Reveal className="space-y-4 rounded-lg overflow-hidden bg-card/60 backdrop-blur-sm border border-border p-6">
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
          <Users className="h-5 w-5 text-primary" />
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
            className="border-border bg-background"
            required
          />
          <p className="text-xs text-primary font-medium">
            ✓ Sisa kursi tersedia: <strong>{seatsRemaining}</strong> kursi
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hotelOptionId" className="flex items-center gap-2 text-card-foreground font-medium">
            <Home className="h-4 w-4 text-primary" />
            Pilih opsi hotel
          </Label>
          <Select value={hotelOptionId.toString()} onValueChange={(value) => setHotelOptionId(Number(value))}>
            <SelectTrigger id="hotelOptionId" className="border-border bg-background w-full">
              {hotelOptionId ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{selectedHotel?.name}</span>
                  <span className="text-sm text-muted-foreground">• {formatCurrency(selectedHotel?.pricePerPersonPerNight ?? 0)}/malam</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Pilih hotel...</span>
              )}
            </SelectTrigger>
            <SelectContent className="w-full min-w-96">
              {hotelOptions.map((option) => (
                <SelectItem key={option.id} value={option.id.toString()}>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(option.pricePerPersonPerNight)} / orang / malam</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="hotelOptionId" value={hotelOptionId} />
        </div>
      </Reveal>

      {/* SECTION 2: DATA PEMESAN */}
      <Reveal delay={0.1} className="space-y-4 rounded-lg overflow-hidden bg-card/60 backdrop-blur-sm border border-border p-6">
        <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Data Pemesan</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="customerName" className="text-card-foreground font-medium">Nama lengkap</Label>
            <Input
              id="customerName"
              name="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value.replace(/[^a-zA-Z\s]/g, ""))}
              placeholder="Contoh: John Doe"
              className="border-border bg-background"
              required
            />
            <p className="text-xs text-muted-foreground">Huruf dan spasi saja</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerEmail" className="flex items-center gap-2 text-card-foreground font-medium">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(formatEmail(e.target.value))}
              placeholder="nama@example.com"
              className="border-border bg-background"
              required
            />
            {customerEmail && !validateEmail(customerEmail) && (
              <p className="text-xs text-destructive">Email tidak valid</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="customerPhone" className="flex items-center gap-2 text-card-foreground font-medium">
              <Phone className="h-4 w-4 text-muted-foreground" />
              No. telepon
            </Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(formatPhoneNumber(e.target.value))}
              placeholder="+62 812 3456 7890"
              className="border-border bg-background"
              required
            />
            {customerPhone && !validatePhoneNumber(customerPhone) && (
              <p className="text-xs text-destructive">Nomor telepon tidak valid (minimal 10 digit)</p>
            )}
          </div>
        </div>
      </Reveal>

      {/* SECTION 3: RINCIAN HARGA */}
      <Reveal delay={0.2} className="rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-sm font-bold text-card-foreground tracking-tight">Rincian Harga</h3>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2">
            <dt className="text-muted-foreground">
              Hotel ({nights} malam × {participantCount || 0} orang)
            </dt>
            <dd className="font-semibold text-card-foreground">{formatCurrency(breakdown.hotelTotal)}</dd>
          </div>
          <div className="flex justify-between items-center pb-2">
            <dt className="text-muted-foreground">
              Aktivitas ({participantCount || 0} orang)
            </dt>
            <dd className="font-semibold text-card-foreground">{formatCurrency(breakdown.activitiesTotal)}</dd>
          </div>
          <div className="flex justify-between items-center pb-2">
            <dt className="text-muted-foreground">Kendaraan (per trip)</dt>
            <dd className="font-semibold text-card-foreground">{formatCurrency(breakdown.vehicleTotal)}</dd>
          </div>
          <div className="flex justify-between items-center border-t border-primary/20 pt-3 font-bold">
            <dt className="text-card-foreground">Total Pembayaran</dt>
            <dd className="text-lg text-primary">{formatCurrency(breakdown.grandTotal)}</dd>
          </div>
        </dl>
      </Reveal>

      {state.error && (
        <div className="flex items-start gap-3 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
          <p className="text-sm text-destructive font-medium">{state.error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending || seatsRemaining <= 0}
        className="w-full font-semibold py-3 shadow-sm hover:shadow transition-all"
      >
        {isPending ? "Memproses Booking..." : "Konfirmasi Booking"}
      </Button>
    </form>
  );
}
