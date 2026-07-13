import * as React from "react";
import { cn } from "@/lib/utils";

function TicketCard({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-none bg-card text-card-foreground ring-1 ring-card-foreground/10 overflow-hidden shadow-[0_10px_30px_-12px_rgba(0,0,0,0.55)] hover:-rotate-[0.3deg] hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}

function TicketCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6 py-4 border-b border-card-foreground/10", className)}
      {...props}
    />
  );
}

function TicketCardHeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-heading text-lg leading-tight font-bold text-card-foreground tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function TicketCardMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-mono text-xs uppercase tracking-widest text-muted-foreground mt-1",
        className
      )}
      {...props}
    />
  );
}

function TicketCardBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6 py-4 space-y-3", className)}
      {...props}
    />
  );
}

function TicketCardRow({
  label,
  value,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label?: React.ReactNode;
  value?: React.ReactNode;
}) {
  return (
    <div
      className={cn("flex items-baseline justify-between gap-4", className)}
      {...props}
    >
      {label && (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
      {value && (
        <span className="font-mono font-medium text-card-foreground">
          {value}
        </span>
      )}
    </div>
  );
}

function TicketCardPerforation({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "ticket-perforation border-t-2 border-dashed border-card-foreground/20",
        className
      )}
      {...props}
    />
  );
}

function TicketCardStub({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("px-6 py-4 bg-card-foreground/5", className)}
      {...props}
    />
  );
}

export {
  TicketCard,
  TicketCardHeader,
  TicketCardHeading,
  TicketCardMeta,
  TicketCardBody,
  TicketCardRow,
  TicketCardPerforation,
  TicketCardStub,
};
