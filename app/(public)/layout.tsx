import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link href="/" className="font-semibold tracking-tight">
            Voyago Tours
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/packages" className="text-muted-foreground hover:text-foreground">
              Paket Tour
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Voyago Tours. Proyek demo, bukan agen perjalanan sungguhan.
        </div>
      </footer>
    </>
  );
}
