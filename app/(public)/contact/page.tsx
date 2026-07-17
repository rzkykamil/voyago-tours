import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ContactForm } from "./contact-form";
import { ArrowLeft, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak — Voyago Tours",
  description:
    "Hubungi tim Voyago Tours untuk konsultasi dan pertanyaan seputar paket tour.",
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "halo@voyago.tours",
    detail: "Balasan dalam 1×24 jam",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "+62 812 3456 7890",
    detail: "Senin–Sabtu, 09.00–18.00 WIB",
  },
  {
    icon: MapPin,
    label: "Kantor",
    value: "Jl. Merdeka No. 45",
    detail: "Bandung, Jawa Barat 40111",
  },
];

export default function ContactPage() {
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
          Voyago Tours — Pusat Bantuan
        </div>
        <h1 className="flex items-center gap-3 text-3xl sm:text-4xl font-heading font-bold tracking-tight text-card-foreground leading-tight">
          <MessageCircle className="h-8 w-8 text-primary" />
          Hubungi Kami
        </h1>
        <p className="text-card-foreground text-base sm:text-lg leading-relaxed pt-2 border-l-4 border-primary pl-4">
          Punya pertanyaan tentang paket tour, jadwal keberangkatan, atau
          pemesanan? Tim Voyago Tours siap membantu Anda. Kirimkan pesan melalui
          formulir di bawah ini.
        </p>
      </Reveal>

      {/* CONTACT INFO CARDS */}
      <div className="grid gap-4 sm:grid-cols-3">
        {CONTACT_INFO.map((info, index) => (
          <Reveal key={info.label} delay={index * 0.05}>
            <div className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-5 space-y-2 hover:ring-primary/30 transition-all h-full">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <info.icon className="h-4 w-4" />
              </div>
              <div className="coordinate-label">{info.label}</div>
              <div className="font-mono text-sm font-semibold text-card-foreground">
                {info.value}
              </div>
              <div className="text-xs text-muted-foreground">{info.detail}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CONTACT FORM */}
      <Reveal delay={0.1} className="space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground tracking-tight">
            Kirim Pesan
          </h2>
        </div>
        <ContactForm />
      </Reveal>
    </div>
  );
}