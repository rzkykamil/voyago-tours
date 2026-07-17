"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  formatEmail,
  formatName,
  formatPhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "@/lib/format";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Masukkan nama lengkap Anda.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }
    if (!validatePhoneNumber(phone)) {
      setError("Nomor telepon tidak valid.");
      return;
    }
    if (!message.trim()) {
      setError("Tuliskan pesan Anda.");
      return;
    }

    setStatus("submitting");
    // Simulasi pengiriman pesan (proyek demo)
    setTimeout(() => {
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    }, 1000);
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-8 text-center space-y-3">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h3 className="font-heading text-lg font-bold text-card-foreground">
          Pesan Terkirim!
        </h3>
        <p className="text-sm text-muted-foreground">
          Terima kasih telah menghubungi kami. Tim Voyago Tours akan membalas
          pesan Anda dalam 1×24 jam.
        </p>
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => setStatus("idle")}
        >
          Kirim pesan lain
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-card ring-1 ring-card-foreground/10 p-6 space-y-4"
    >
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-card-foreground font-medium">
          Nama Lengkap
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(formatName(e.target.value))}
          placeholder="Nama Anda"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-card-foreground font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(formatEmail(e.target.value))}
          placeholder="nama@email.com"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone" className="text-card-foreground font-medium">
          Nomor Telepon
        </Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          placeholder="0812 3456 7890"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-card-foreground font-medium">
          Pesan
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan atau pertanyaan Anda di sini..."
          rows={4}
          required
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === "submitting"}
        variant="stamp"
        className="w-full gap-2"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}