# Voyago Tours

> A tour package management system that shows the full booking business flow — not just a landing page.

<!-- screenshot here -->
<!-- Live demo: not deployed yet -->

## Features
- Browse tour packages with destinations, durations, and departure schedules
- Live price calculator based on participant count, hotel option, and activities
- Vehicle selection with server-side capacity validation
- Booking form → transaction detail with itemized price breakdown
- Admin dashboard for managing bookings and stats
- Admin settings for hotel, transport (vehicle), and activity pricing

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Prisma](https://www.prisma.io/) + SQLite
- Tailwind CSS + shadcn/ui

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
git clone <repo-url>
cd voyago-tours
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin login uses the `ADMIN_EMAIL` / `ADMIN_PASSWORD` values you set in `.env`.

## Ideas / Roadmap
- Payment gateway integration
- Email booking confirmation
- PDF invoice export
- Package reviews & ratings
- Deploy live demo on Vercel

## License
MIT
