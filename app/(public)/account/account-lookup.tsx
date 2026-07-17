"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TicketCard,
  TicketCardHeader,
  TicketCardHeading,
  TicketCardMeta,
  TicketCardBody,
  TicketCardRow,
  TicketCardPerforation,
  TicketCardStub,
} from "@/components/ticket-card";
import { StampBadge } from "@/components/stamp-badge";
import { lookupBookings, type LookupState } from "./actions";
import { formatCurrency, formatDate, formatEmail } from "@/lib/format";
import { Mail, Search, ArrowRight, Inbox, Loader2 } from "lucide-react";

const initialState: LookupState = {};

export function AccountLookup() {
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(
    lookupBookings,
    initialState
  );

  const hasResults = state.bookings !== undefined;
  const bookings = state.bookings ?? [];
  const isEmpty = hasResults && bookings.length === 0;

  return (
    <div className="space-y-8">
      {/* LOOKUP FORM */}
      <form
        action={formAction}
        className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-6 space-y-4"
      >
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="flex items-center gap-2 text-card-foreground font-medium"
          >
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Pemesan
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(formatEmail(e.target.value))}
            placeholder="nama@email.com"
            required
          />
        </div>

        {state.error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive font-medium">{state.error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          variant="stamp"
          className="w-full gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mencari...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Lihat Pesanan Saya
            </>
          )}
        </Button>
      </form>

      {/* RESULTS */}
      {isEmpty && (
        <div className="text-center py-12 rounded-lg border border-dashed border-border bg-card">
          <Inbox className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            Belum ada pesanan untuk email{" "}
            <span className="font-mono text-card-foreground">{state.email}</span>
          </p>
          <Link
            href="/packages"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-3"
          >
            Mulai pesan paket tour <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {bookings.length > 0 && (
        <div className="space-y-4">
          <div className="coordinate-label">
            {bookings.length} pesanan ditemukan untuk {state.email}
          </div>

          {bookings.map((booking) => {
            const stampVariant =
              booking.status === "CONFIRMED"
                ? "confirmed"
                : booking.status === "CANCELLED"
                ? "cancelled"
                : "pending";

            return (
              <TicketCard key={booking.id}>
                <TicketCardHeader className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <StampBadge variant={stampVariant} size="sm">
                      {booking.status === "CONFIRMED"
                        ? "OKE"
                        : booking.status === "CANCELLED"
                        ? "BATAL"
                        : "NGG"}
                    </StampBadge>
                  </div>
                  <TicketCardMeta>
                    PERMIT #{booking.id} — {booking.schedule.package.destination}
                  </TicketCardMeta>
                  <TicketCardHeading>
                    {booking.schedule.package.name}
                  </TicketCardHeading>
                </TicketCardHeader>

                <TicketCardBody className="pr-16">
                  <TicketCardRow
                    label="Keberangkatan"
                    value={formatDate(booking.schedule.departureDate)}
                  />
                  <TicketCardRow
                    label="Durasi"
                    value={`${booking.schedule.package.durationDays} Hari`}
                  />
                  <TicketCardRow
                    label="Peserta"
                    value={`${booking.participantCount} orang`}
                  />
                  <TicketCardRow
                    label="Dipesan"
                    value={formatDate(booking.createdAt)}
                  />
                </TicketCardBody>

                <TicketCardPerforation />

                <TicketCardStub className="flex items-center justify-between">
                  <div>
                    <div className="coordinate-label mb-1">Total</div>
                    <div className="font-mono text-sm font-bold text-primary">
                      {formatCurrency(booking.totalPrice)}
                    </div>
                  </div>
                  <Link href={`/transactions/${booking.id}`}>
                    <Button size="sm" variant="ghost" className="gap-1">
                      Detail <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </TicketCardStub>
              </TicketCard>
            );
          })}
        </div>
      )}
    </div>
  );
}