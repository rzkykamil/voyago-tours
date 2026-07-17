import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — Voyago Tours",
  description:
    "Kebijakan privasi pengumpulan dan penggunaan data pribadi di Voyago Tours.",
};

const SECTIONS = [
  {
    id: 1,
    title: "Pendahuluan",
    body: "Voyago Tours berkomitmen melindungi privasi Anda. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi Anda saat menggunakan situs dan layanan kami. Dengan menggunakan layanan kami, Anda menyetujui praktik yang diuraikan dalam kebijakan ini.",
  },
  {
    id: 2,
    title: "Data yang Kami Kumpulkan",
    body: "Saat melakukan pemesanan, kami mengumpulkan data berikut: nama lengkap, alamat email, dan nomor telepon. Data ini diperlukan untuk memproses pemesanan, mengonfirmasi jadwal keberangkatan, serta menghubungi Anda terkait status pemesanan. Kami tidak meminta data sensitif seperti informasi keuangan melalui situs ini.",
  },
  {
    id: 3,
    title: "Penggunaan Data",
    body: "Data pribadi Anda digunakan untuk: (1) memproses dan mengelola pemesanan paket tour, (2) berkomunikasi mengenai jadwal dan detail perjalanan, (3) memberikan layanan pelanggan, serta (4) meningkatkan kualitas layanan kami. Kami tidak akan menjual atau menyewakan data Anda kepada pihak ketiga.",
  },
  {
    id: 4,
    title: "Penyimpanan dan Keamanan",
    body: "Data Anda disimpan pada basis data yang terlindungi dan hanya dapat diakses oleh personel yang berwenang. Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data dari akses tidak sah. Data pemesanan disimpan selama diperlukan untuk tujuan administratif dan layanan.",
  },
  {
    id: 5,
    title: "Cookies",
    body: "Situs ini menggunakan cookies untuk meningkatkan pengalaman pengguna, seperti menjaga sesi admin dan preferensi tampilan (mode gelap/terang). Anda dapat menonaktifkan cookies melalui pengaturan peramban, namun beberapa fitur situs mungkin tidak berfungsi dengan optimal.",
  },
  {
    id: 6,
    title: "Hak Anda",
    body: "Anda berhak untuk mengakses, memperbarui, atau meminta penghapusan data pribadi yang telah Anda berikan kepada kami. Untuk menggunakan hak ini, silakan hubungi tim kami menggunakan informasi kontak yang tersedia. Kami akan menanggapi permintaan Anda dalam waktu maksimal 14 hari kerja.",
  },
  {
    id: 7,
    title: "Perubahan Kebijakan",
    body: "Kebijakan privasi ini dapat diperbarui sewaktu-waktu untuk mencerminkan perubahan praktik kami atau peraturan yang berlaku. Perubahan akan dipublikasikan di halaman ini dengan tanggal pembaruan terbaru. Kami menganjurkan Anda meninjau halaman ini secara berkala.",
  },
];

export default function PrivacyPage() {
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
          <ShieldCheck className="h-8 w-8 text-primary" />
          Kebijakan Privasi
        </h1>
        <p className="text-card-foreground text-base sm:text-lg leading-relaxed pt-2 border-l-4 border-primary pl-4">
          Terakhir diperbarui: 1 Januari 2025. Privasi Anda penting bagi kami.
          Kebijakan ini menjelaskan bagaimana kami menangani data pribadi Anda.
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
            Ada pertanyaan mengenai kebijakan privasi kami?
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