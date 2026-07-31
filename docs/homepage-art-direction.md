# Homepage Art Direction — "Rute sebagai Tulang Halaman"

Ringkasan keputusan desain & motion untuk `app/(public)/page.tsx`. Ditulis supaya
sesi berikutnya tidak menyimpang dari arah yang sudah disepakati. Lihat juga
plan asli di riwayat percakapan / `docs/plan.md` untuk konteks produk.

## The Big Idea

Halaman ini adalah dokumen perjalanan yang terisi sendiri saat di-scroll. Satu
spine vertikal putus-putus berjalan dari hero sampai boarding pass penutup;
tiap section adalah waypoint bernomor di spine itu, bukan blok yang ditumpuk.
Statement penolak: kalau sebuah elemen tidak bisa dijelaskan sebagai bagian
dari dokumen perjalanan (manifest, indeks, kuitansi, denah kursi, jadwal,
catatan lapangan, boarding pass), elemen itu tidak masuk.

## Narrative Arc (7 section)

| # | Section | Tempo | Komponen |
|---|---|---|---|
| S01 | Manifest (Hero) | LOUD | `components/home/hero-manifest.tsx` |
| S02 | Indeks Destinasi | MEDIUM | `components/home/destination-index.tsx` |
| S03 | Cara Harga Dihitung | LOUD | `components/home/pricing-mechanics.tsx` |
| S04 | Kapasitas Nyata | MEDIUM | `components/home/capacity-proof.tsx` |
| S05 | Jadwal Keberangkatan | MEDIUM | `components/home/departure-timeline.tsx` |
| S06 | Catatan Lapangan | QUIET (lembah) | `components/home/field-notes.tsx` |
| S07 | Boarding Pass | LOUD (close) | `components/home/boarding-pass-cta.tsx` |

Semua angka di S01/S03/S04/S05/S07 berasal dari `lib/home-data.ts` (satu query
Prisma teragregasi) — tidak ada statistik karangan. S03 memakai
`calculatePrice()`/`nightsFromDuration()` dari `lib/pricing.ts` apa adanya
supaya simulasi harga di homepage selalu identik dengan kalkulator booking.

## Sistem Motion

Token tunggal di `lib/motion-tokens.ts` (easing, duration, stagger, config
Lenis), di-mirror sebagai CSS var di `app/globals.css` untuk transisi hover.

Pembagian tugas:
- **Lenis** (`components/home/smooth-scroll.tsx`) — smooth scroll, di-mount
  hanya di homepage (bukan `PublicLayout`), dimatikan otomatis di perangkat
  sentuh dan di bawah `prefers-reduced-motion`.
- **GSAP + ScrollTrigger** — semua yang scrubbed/pinned: spine draw
  (`route-spine.tsx`), pin S03 & S05, seat fill S04, number-roll.
- **framer-motion** — reveal masuk-viewport di hero & S06, dipakai lewat
  `components/reveal.tsx` yang sudah ada, tidak ditulis ulang.

Reveal pattern (maksimum 2 section per pattern): `line-mask` (S01, S07),
`ledger-wipe` (S02, S05 kartu), `stamp-slam` (S04, S07), `number-roll` (S01,
S03), `route-draw` (persistent + S05), `note-drift` (S06).

### `prefers-reduced-motion`
Ditangani lewat `components/home/use-prefers-reduced-motion.ts`, dipakai di
`route-spine.tsx`, `pricing-mechanics.tsx`, `departure-timeline.tsx`,
`capacity-proof.tsx`, `boarding-pass-cta.tsx`. Aturan: pin/scrub/scale-bounce
dimatikan total dan diganti end-state statis (spine terisi penuh, kuitansi S03
langsung menampilkan total akhir, timeline S05 tidak di-pin, kursi & stempel
langsung tampil tanpa animasi). Opacity/posisi fade ringan tetap jalan.

### Mobile (<768px)
Pin S03 & S05 dimatikan (matchMedia `min-width: 768px`); S03 jadi kuitansi
final langsung tampil, S05 jadi horizontal-scroll native (`overflow-x-auto`).

## Kill List

Ditolak tanpa diskusi di halaman ini: hero terpusat dengan badge pill +
subheadline + dua tombol sejajar, grid 3 kolom fitur berikon, kartu testimoni
abu-abu, gradient blob ungu-biru, `fade-in-up` seragam di semua section,
mockup browser/iPhone, bento grid tanpa alasan konseptual, drop shadow lembut
di semua kartu, emoji sebagai ikon, angka statistik karangan yang tidak
berasal dari DB.

## Trade-off yang Dicatat Sadar

- **Dependency baru (`gsap`, `lenis`)** meski aturan project mengutamakan
  "keep it simple". Diambil karena big idea (spine yang scrub dengan scroll,
  pin section S03/S05) tidak bisa dicapai secara natural dengan
  framer-motion `whileInView` saja. Mitigasi: Lenis di-scope ketat ke
  homepage saja, seluruh nilai motion lewat satu file token, dan setiap
  scrub/pin punya fallback statis di bawah `prefers-reduced-motion` & mobile.
- **`/` tetap statically prerendered** (sama seperti `/packages` sebelumnya) —
  data dibekukan pada waktu build. Konsisten dengan pola yang sudah ada di
  codebase ini; tidak diubah karena di luar scope redesign visual.

## File Peta

- `lib/motion-tokens.ts`, `lib/home-data.ts`
- `components/home/smooth-scroll.tsx`, `route-spine.tsx`,
  `use-prefers-reduced-motion.ts`, `animated-number.tsx`
- `components/home/hero-manifest.tsx` … `boarding-pass-cta.tsx` (S01–S07)
- `app/(public)/page.tsx` — perakitan server component
