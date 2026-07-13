import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "./login/actions";
import { LayoutDashboard, DollarSign, Package, LogOut, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background antialiased">

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link href="/admin" className="font-bold text-lg tracking-tight hover:opacity-90 transition-opacity flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              <span>Voyago<span className="text-primary">Admin</span></span>
            </Link>

            <div className="flex items-center gap-6 ml-4">
              <Link
                href="/admin"
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/admin/pricing"
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Pricing
              </Link>
              <Link
                href="/admin/packages"
                className="text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-primary after:transition-all flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Packages
              </Link>
            </div>
          </nav>

          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          </form>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative flex flex-1 flex-col z-10 mx-auto w-full max-w-5xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
