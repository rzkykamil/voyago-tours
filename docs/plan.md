# Voyago Tours — Product Plan

## Summary
Voyago Tours is a tour package management system for a fictional Indonesian travel agency. It showcases a full booking business flow — not just a landing page — including dynamic price calculation, vehicle capacity validation, and an admin panel for managing pricing. Built as a portfolio piece to demonstrate business logic implementation, not just styling.

## Core Features
1. **Package Catalog** — Browse tour packages with destination, duration, included activities, and available departure schedules (with vehicle assignment).
2. **Price Calculator & Booking** — Interactive calculator computes total price live from participant count, hotel option, and included activities; vehicle capacity is validated against the selected schedule before submission.
3. **Booking Form & Transaction Detail** — Customer submits a booking (name, contact, participant count, hotel choice); a transaction detail page shows an itemized price breakdown and status.
4. **Admin Dashboard** — Demo-account-protected view listing all packages, schedules, and bookings with basic stats (total bookings, revenue).
5. **Pricing & Vehicle Settings** — Admin manages hotel option prices, activity prices, and vehicle types/capacities/prices used by the calculator.

## Out of Scope / Ideas (see docs/todo.md Backlog)
- Payment gateway integration
- Email/SMS notification
- Multi-admin roles & permissions
- PDF invoice export
- Package reviews/ratings
- Multi-language / multi-currency
- Live deploy

## Data Model
| Entity | Key Fields |
|---|---|
| Package | id, name, slug, destination, description, durationDays, imageUrl |
| Activity | id, name, pricePerPerson, packageId |
| HotelOption | id, name, pricePerPersonPerNight |
| Vehicle | id, name, capacity, pricePerTrip |
| Schedule | id, packageId, vehicleId, departureDate, seatsBooked |
| Booking | id, scheduleId, hotelOptionId, customerName, customerEmail, customerPhone, participantCount, totalPrice, status, createdAt |

## Pages & Key Actions
| Route | Purpose |
|---|---|
| `/` | Landing page, featured packages |
| `/packages` | Package catalog list/filter |
| `/packages/[slug]` | Detail + schedules + live price calculator |
| `/packages/[slug]/book?scheduleId=` | Booking form (capacity validated server-side on submit) |
| `/transactions/[bookingId]` | Transaction detail / price breakdown |
| `/admin/login` | Demo admin login |
| `/admin` | Dashboard: bookings + stats |
| `/admin/pricing` | Manage hotel/activity/vehicle prices |
| `/admin/packages` | Manage packages & schedules |

Mutations use Next.js Server Actions — no separate REST layer needed at this scale.

## Key Technical Decisions
- **Next.js App Router + Prisma + SQLite** — zero external DB setup, fastest path to a working demo in 2–3 days.
- **Server Actions over API routes** — less boilerplate for a single-app CRUD flow, still idiomatic Next.js.
- **Demo-account auth via signed cookie** (no NextAuth) — one seeded admin credential from `.env`, checked server-side; proportional to the scope of a portfolio app.
- **Tailwind CSS + shadcn/ui** — fast to build a clean, presentable UI without hand-rolled CSS.
- **Capacity validation is server-side authoritative** — recompute `seatsBooked + participantCount <= vehicle.capacity` on submit, not just client-side.
