import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ArrowLeft, ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan — Voyago Tours",
  description:
    "Syarat dan ketentuan layanan pemesanan paket tour Voyago Tours.",
};

const SECTIONS = [
  {
    id: 1,
    title: "Penerimaan Syarat",
    body: "Dengan mengakses dan menggunakan situs web Voyago Tours, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. Apabila Anda tidak menyetujui salah satu bagian dari ketentuan ini, mohon untuk tidak menggunakan layanan kami. Syarat ini berlaku untuk semua pengunjung dan pengguna situs.",
  },
  {
    id: 2,
    title: "Pemesanan dan Konfirmasi",
    body: "Pemesanan paket tour dianggap sah setelah Anda mengisi formulir pemesanan secara lengkap dan menerima halaman tiket/permit keberangkatan. Setiap pemesanan akan berstatus PENDING hingga dikonfirmasi oleh tim Voyago Tours. Kami berhak menolak pemesanan jika kuota tidak mencukupi atau data pemesan tidak valid.",
  },
  {
    id: 3,
    title: "Pembayaran",
    body: "Seluruh harga ditampilkan dalam Rupiah (IDR) dan sudah termasuk biaya akomodasi, aktivitas, serta kendaraan sesuai rincian pada paket. Pembayaran dilakukan sesuai instruksi yang diberikan setelah konfirmasi pemesanan. Keterlambatan pembayaran dapat mengakibatkan pembatalan otomatis atas pemesanan Anda.",
  },
  {
    id: 4,
    title: "Pembatalan dan Pengembalian Dana",
    body: "Pembatalan pemesanan dapat diajukan dengan menghubungi tim kami. Pengembalian dana (refund) diberikan sesuai kebijakan berikut: pembatalan minimal 14 hari sebelum keberangkatan mendapatkan pengembalian 75%, 7–13 hari mendapatkan 50%, dan kurang dari 7 hari tidak mendapatkan pengembalian dana.",
  },
  {
    id: 5,
    title: "Tanggung Jawab Peserta",
    body: "Peserta wajib mematuhi instruksi dari pemandu tour selama perjalanan. Voyago Tours tidak bertanggung jawab atas kerugian akibat kelalaian peserta, pelanggaran aturan lokal, atau kondisi kesehatan yang tidak dilaporkan sebelumnya. Peserta diwajibkan membawa dokumen perjalanan yang sah.",
  },
  {
    id: 6,
    title: "Perubahan Jadwal",
    body: "Voyago Tours berhak mengubah jadwal keberangkatan akibat keadaan kahar (force majeure) seperti cuaca ekstrem, bencana alam, atau perintah otoritas terkait. Dalam hal ini, peserta akan diberikan pilihan jadwal pengganti atau pengembalian dana penuh.",
  },
  {
    id: 7,
    title: "Perubahan Syarat",
    body: "Kami dapat memperbarui syarat dan ketentuan ini dari waktu ke waktu. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Penggunaan situs secara berkelanjutan setelah perubahan dipublikasikan dianggap sebagai persetujuan Anda terhadap syarat yang diperbarui.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16 space-y-12">
      {/* NAVIGATION BACK */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Kembali ke beranda
        </Link>
      </div>

      {/* HEADER */}
      <Reveal className="space-y-4">
        <div className="coordinate-label">
          Legal — Dokumen Layanan
        </div>
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground leading-tight">
          <ScrollText className="h-8 w-8 text-primary" />
          Syarat & Ketentuan
        </h1>
        <p className="text-card-foreground text-base sm:text-lg leading-relaxed pt-2 border-l-4 border-primary pl-4">
          Terakhir diperbarui: 1 Januari 2025. Mohon baca syarat dan ketentuan
          berikut dengan saksama sebelum menggunakan layanan Voyago Tours.
        </p>
      </Reveal>

      {/* CONTENT SECTIONS */}
      <div className="space-y-8">
        {SECTIONS.map((section, index) => (
          <Reveal key={section.id} delay={index * 0.05}>
            <section className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-6 hover:ring-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-mono text-sm font-bold">
                  {String(section.id).padStart(2, "0")}
                </span>
                <div className="space-y-2 min-w-0">
                  <h2 className="text-lg font-bold text-card-foreground tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {section.body}
                  </p>
                </div>
              </div>
            </section>
          </Reveal>
        ))}
      </div>

      {/* CONTACT CTA */}
      <Reveal delay={0.1}>
        <div className="rounded-lg border border-dashed border-border bg-card/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ada pertanyaan mengenai syarat & ketentuan kami?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline mt-2"
          >
            Hubungi tim kami →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}