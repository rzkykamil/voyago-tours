"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TicketCard,
  TicketCardHeader,
  TicketCardMeta,
  TicketCardHeading,
  TicketCardBody,
  TicketCardRow,
  TicketCardPerforation,
  TicketCardStub,
} from "@/components/ticket-card";
import { SpinePoint } from "@/components/home/route-spine";
import { usePrefersReducedMotion } from "@/components/home/use-prefers-reduced-motion";
import { formatCurrency } from "@/lib/format";
import type { PricingScenario } from "@/lib/home-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Step = {
  formula: string;
  amount: number;
};

export function PricingMechanics({ scenario }: { scenario: PricingScenario | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stubRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const stepsColumnRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeStep, setActiveStep] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const steps: Step[] = scenario
    ? [
        {
          formula: `${scenario.participantCount} peserta × ${scenario.nights} malam × ${formatCurrency(scenario.hotelPricePerPersonPerNight)} (${scenario.hotelName})`,
          amount: scenario.breakdown.hotelTotal,
        },
        {
          formula: `+ ${scenario.activityCount} aktivitas × ${scenario.participantCount} peserta`,
          amount: scenario.breakdown.activitiesTotal,
        },
        {
          formula: `+ ${scenario.vehicleName} — tarif per trip, bukan per orang`,
          amount: scenario.breakdown.vehicleTotal,
        },
        {
          formula: "= total yang tertagih",
          amount: scenario.breakdown.grandTotal,
        },
      ]
    : [];

  useEffect(() => {
    if (!scenario) return;
    const section = sectionRef.current;
    const stub = stubRef.current;
    const total = totalRef.current;
    const stepsColumn = stepsColumnRef.current;
    if (!section || !stub || !total || !stepsColumn) return;

    const runningTotals = [
      scenario.breakdown.hotelTotal,
      scenario.breakdown.hotelTotal + scenario.breakdown.activitiesTotal,
      scenario.breakdown.hotelTotal + scenario.breakdown.activitiesTotal + scenario.breakdown.vehicleTotal,
      scenario.breakdown.grandTotal,
    ];

    const mm = gsap.matchMedia();

    mm.add(
      {
        pinnedScrub: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        staticReveal: "(max-width: 767px), (prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { pinnedScrub } = context.conditions as { pinnedScrub: boolean };

        if (!pinnedScrub) {
          // Mobile and reduced-motion both skip the pin/scrub choreography —
          // show the finished receipt directly instead of a stuck "Rp 0" total.
          setActiveStep(3);
          total.textContent = formatCurrency(scenario.breakdown.grandTotal);
          return;
        }

        const state = { val: 0 };
        total.textContent = formatCurrency(0);

        const validStepEls = stepRefs.current.filter(
          (el): el is HTMLDivElement => el !== null
        );
        const lastStepEl = validStepEls[validStepEls.length - 1] ?? stepsColumn;

        // Pin must stay active exactly until the last step card finishes its
        // own "bottom center" trigger below — matching that same reference
        // point (not the column's "bottom bottom") so the pin never releases
        // before the last card has had a chance to become active.
        const pinTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          endTrigger: lastStepEl,
          end: "bottom center",
          pin: stub,
        });

        // Each step card gets its own trigger so the highlighted step always
        // matches whichever card is actually centered in the viewport, instead
        // of an even 4-way split of scroll progress.
        const stepTriggers = validStepEls.map((el, i) =>
          ScrollTrigger.create({
            trigger: el,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
              if (!self.isActive) return;
              setActiveStep(i);
              gsap.to(state, {
                val: runningTotals[i],
                duration: 0.3,
                overwrite: true,
                onUpdate: () => {
                  total.textContent = formatCurrency(state.val);
                },
              });
            },
          })
        );

        return () => {
          pinTrigger.kill();
          stepTriggers.forEach((t) => t.kill());
        };
      }
    );

    return () => mm.revert();
  }, [scenario, reducedMotion]);

  if (!scenario) return null;

  return (
    <section ref={sectionRef} className="relative px-6 py-20 sm:py-28">
      <SpinePoint index="03" />
      <div className="mx-auto w-full max-w-5xl pl-12 sm:pl-16">
        <div className="mb-12 border-b border-border pb-4">
          <div className="coordinate-label mb-2">Mekanisme Harga</div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-card-foreground sm:text-4xl">
            Cara harga dihitung — bukan diramal.
          </h2>
          <p className="mt-3 max-w-[52ch] text-sm text-muted-foreground sm:text-base">
            Contoh nyata: {scenario.packageName} ({scenario.destination}),{" "}
            {scenario.participantCount} peserta. Rumus ini sama persis dengan
            kalkulator di halaman booking.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5">
            <div ref={stubRef}>
              <TicketCard>
                <TicketCardHeader>
                  <TicketCardMeta>Kuitansi Simulasi</TicketCardMeta>
                  <TicketCardHeading>{scenario.packageName}</TicketCardHeading>
                </TicketCardHeader>
                <TicketCardBody>
                  {steps.map((step, i) => (
                    <TicketCardRow
                      key={step.formula}
                      label={`Langkah ${i + 1}`}
                      value={formatCurrency(step.amount)}
                      className={
                        i <= activeStep ? "opacity-100" : "opacity-30 transition-opacity"
                      }
                    />
                  ))}
                </TicketCardBody>
                <TicketCardPerforation />
                <TicketCardStub className="flex items-center justify-between">
                  <span className="coordinate-label">Total</span>
                  <span
                    ref={totalRef}
                    className="font-mono text-xl font-bold text-card-foreground"
                  >
                    {formatCurrency(0)}
                  </span>
                </TicketCardStub>
              </TicketCard>
            </div>
          </div>

          <div
            ref={stepsColumnRef}
            className="space-y-24 py-4 md:col-span-7 md:space-y-32 md:py-16"
          >
            {steps.map((step, i) => (
              <div
                key={step.formula}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={`rounded-lg border p-6 transition-colors duration-[var(--duration-base)] ${
                  i === activeStep
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-transparent"
                }`}
              >
                <div className="coordinate-label mb-2">Langkah {i + 1}</div>
                <p className="font-mono text-sm leading-relaxed text-card-foreground sm:text-base">
                  {step.formula}
                </p>
                <p className="mt-3 font-mono text-lg font-semibold text-primary">
                  {formatCurrency(step.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
