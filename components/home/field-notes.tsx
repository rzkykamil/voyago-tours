import { Reveal } from "@/components/reveal";
import { SpinePoint } from "@/components/home/route-spine";

const NOTES = [
  {
    title: "Kelompok kecil",
    body: "Maksimum 12 orang per grup — supaya pemandu bisa memberi perhatian penuh, bukan sekadar mengarahkan rombongan.",
  },
  {
    title: "Pemandu lokal",
    body: "Setiap rute dipimpin orang yang memang tinggal di sana, bukan pemandu yang dikirim dari luar kota.",
  },
  {
    title: "Dampak lokal",
    body: "Sebagian dari setiap perjalanan kembali ke ekonomi setempat — penginapan, warung makan, pengrajin yang kami singgahi.",
  },
];

/** Deliberately quiet section — the valley between S05 and S07's loud close. */
export function FieldNotes() {
  return (
    <section className="relative px-6 py-24 sm:py-32">
      <SpinePoint index="06" />
      <div className="mx-auto w-full max-w-3xl pl-12 sm:pl-16">
        <Reveal className="coordinate-label mb-12">Catatan Lapangan</Reveal>

        <div className="space-y-10">
          {NOTES.map((note, i) => (
            <Reveal key={note.title} delay={i * 0.12} className="border-l-2 border-primary/40 pl-6">
              <h3 className="font-heading text-lg font-bold text-card-foreground">
                {note.title}
              </h3>
              <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-muted-foreground">
                {note.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
