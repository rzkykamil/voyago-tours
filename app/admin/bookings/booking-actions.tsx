"use client";

import { useState } from "react";
import { useTransition } from "react";
import { updateBookingStatus } from "./actions";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface BookingActionsProps {
  bookingId: number;
  currentStatus: "PENDING" | "CONFIRMED" | "CANCELLED";
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAccept = () => {
    setError(null);
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, "CONFIRMED");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal accept booking.");
      }
    });
  };

  const handleReject = () => {
    setError(null);
    startTransition(async () => {
      try {
        await updateBookingStatus(bookingId, "CANCELLED");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal reject booking.");
      }
    });
  };

  if (currentStatus !== "PENDING") {
    return null;
  }

  return (
    <div className="flex gap-2 flex-col sm:flex-row">
      <Button
        size="sm"
        variant="default"
        onClick={handleAccept}
        disabled={isPending}
        className="text-xs"
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <CheckCircle className="h-3 w-3 mr-1" />
        )}
        Accept
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={handleReject}
        disabled={isPending}
        className="text-xs"
      >
        {isPending ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <XCircle className="h-3 w-3 mr-1" />
        )}
        Reject
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
