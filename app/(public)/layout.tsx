import Link from "next/link";

import { Compass } from "lucide-react"; 

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Membungkus seluruh halaman agar memiliki struktur flex vertikal yang kokoh
    <div className="relative min-h-screen flex flex-col bg-background antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* Efek Gradasi Halus di Latar Belakang (Aesthetic Background Glow) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-indigo-500/5 via-sky-500/2 to-transparent blur-3xl pointer-events-none" />

      {/* 1. HEADER (NAVBAR STICKY WITH BLUR) */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          
          {/* Logo dengan Ikon */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity"
          >
            <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>
              Voyago<span className="text-indigo-600 dark:text-indigo-400">Tours</span>
            </span>
          </Link>

          {/* Menu Navigasi */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link 
              href="/packages" 
              className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-indigo-600 after:transition-all"
            >
              Paket Tour
            </Link>
            <Link 
              href="/about" 
              className="text-muted-foreground hover:text-foreground transition-colors hidden sm:inline"
            >
              Tentang Kami
            </Link>
          </nav>

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
          </div>

        </div>
      </footer>
    </div>
  );
}