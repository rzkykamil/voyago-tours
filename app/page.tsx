import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Voyago Tours</h1>
      <p className="max-w-md text-muted-foreground">
        Rencanakan perjalananmu berikutnya bersama Voyago Tours — paket
        lengkap, harga transparan, jadwal fleksibel.
      </p>
      <Button render={<Link href="/packages" />}>Lihat Paket Tour</Button>
    </div>
  );
}
