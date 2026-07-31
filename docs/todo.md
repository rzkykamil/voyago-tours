# Todo

## Day 1 — Scaffold & Core Data Flow
- [x] `npx create-next-app` (App Router, TypeScript, Tailwind)
- [x] Install & init Prisma with SQLite; init shadcn/ui
- [x] Define Prisma schema (Package, Activity, HotelOption, Vehicle, Schedule, Booking)
- [x] Write seed script with fictional Voyago Tours packages/destinations
- [x] Build `/packages` catalog page (list from DB)
- [x] Build `/packages/[slug]` detail page with schedules list

## Day 2 — Booking Logic & Admin
- [x] Build live price calculator (participants × hotel + activities + vehicle)
- [x] Build booking form + server action with capacity validation
- [x] Build `/transactions/[bookingId]` detail page
- [x] Build demo admin login (cookie session) + `/admin` dashboard (list bookings/stats)
- [x] Build `/admin/pricing` (edit hotel/activity/vehicle prices) + `/admin/packages` (CRUD)

## Day 3 — Polish & Publish
- [x] Responsive/UI polish pass on public pages
- [x] Redesign homepage (`app/(public)/page.tsx`) — art-directed 7-section
      layout with scroll-linked motion (GSAP/ScrollTrigger + Lenis), see
      `docs/homepage-art-direction.md`
- [x] Edge case check: overbooked vehicle, 0 participants, missing fields
- [ ] Write final README (screenshots, features, setup steps)
- [ ] `git init`, initial commit, verify `.env` not tracked
- [ ] Push to GitHub as public repo (after explicit confirmation)

## Backlog / Ideas
- Payment gateway integration (e.g. mock Midtrans flow)
- Email notification on booking confirmation
- PDF invoice export
- Package reviews/ratings
- Multi-admin roles
- Deploy to Vercel with live demo link
