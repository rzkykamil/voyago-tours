import { getHomeData } from "@/lib/home-data";
import { SmoothScroll } from "@/components/home/smooth-scroll";
import { RouteSpine } from "@/components/home/route-spine";
import { HeroManifest } from "@/components/home/hero-manifest";
import { DestinationIndex } from "@/components/home/destination-index";
import { PricingMechanics } from "@/components/home/pricing-mechanics";
import { CapacityProof } from "@/components/home/capacity-proof";
import { DepartureTimeline } from "@/components/home/departure-timeline";
import { FieldNotes } from "@/components/home/field-notes";
import { BoardingPassCta } from "@/components/home/boarding-pass-cta";

export default async function Home() {
  const data = await getHomeData();

  return (
    <SmoothScroll>
      <div id="home-route" className="relative">
        <RouteSpine />

        <HeroManifest
          destinationCount={data.destinationCount}
          upcomingDepartureCount={data.upcomingDepartureCount}
          nearestDepartureISO={data.nearestDepartureISO}
          startingFromPrice={data.startingFromPrice}
        />
        <DestinationIndex destinations={data.destinations} />
        <PricingMechanics scenario={data.pricingScenario} />
        <CapacityProof snapshot={data.capacitySnapshot} />
        <DepartureTimeline departures={data.departures} />
        <FieldNotes />
        <BoardingPassCta nearestBoardingPass={data.nearestBoardingPass} />
      </div>
    </SmoothScroll>
  );
}
