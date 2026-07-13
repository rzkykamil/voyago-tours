import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "./login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="font-semibold">
              Voyago Admin
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/admin/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/admin/packages" className="text-muted-foreground hover:text-foreground">
              Packages
            </Link>
          </nav>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              Keluar
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
