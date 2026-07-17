import Link from "next/link";

import { Compass, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background antialiased selection:bg-primary selection:text-primary-foreground">

      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">          
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <Compass className="h-5 w-5 text-primary animate-pulse" />
            <span>
              Voyago<span className="text-primary">Tours</span>
            </span>
          </Link>

          {/* Menu Navigasi */}
          <nav className="flex items-center gap-6 text-sm font-medium ml-auto mr-2">
            <Link
              href="/packages"
              className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all"
            >
              Paket Tour
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Tentang Kami
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Kontak
            </Link>
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <UserRound className="h-4 w-4" />
              Akun
            </Link>
          </nav>

          <ThemeToggle />

        </div>
      </header>

      {/* 2. MAIN CONTENT AREA */}
      <main className="relative flex flex-1 flex-col z-10">
        {children}
      </main>

      {/* 3. FOOTER (MORE STRUCTURED & PROFESSIONAL) */}
      <footer className="border-t bg-muted/30 backdrop-blur-sm mt-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 text-xs text-muted-foreground">
          
          {/* Hak Cipta */}
          <p className="text-center sm:text-left font-medium">
            © {new Date().getFullYear()} Voyago Tours. Proyek demo, bukan agen perjalanan sungguhan.
          </p>
          
          {/* Link Tambahan di Footer */}
          <div className="flex items-center gap-4 font-medium">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Syarat & Ketentuan
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Kebijakan Privasi
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="/account" className="hover:text-foreground transition-colors">
              Akun
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <Link href="/contact" className="hover:text-foreground transition-colors">
              Kontak
            </Link>
          </div>

        </div>
      </footer>
    </div>
  );
}