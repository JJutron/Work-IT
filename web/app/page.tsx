import Header from "@/components/layout/Header";
import Hero from "@/components/home/Hero";
import ClaimProgress from "@/components/home/ClaimProgress";
import IndustryReality from "@/components/home/IndustryReality";
import FeatureChapters from "@/components/home/FeatureChapters";
import HomeCtaBar from "@/components/home/HomeCtaBar";
import Reveal from "@/components/motion/Reveal";
import { getHomePayload } from "@/lib/home";
import { HOME_CTA } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { user, claim_progress } = await getHomePayload();
  const heroCta = claim_progress.home_cta ?? HOME_CTA;

  return (
    <>
      <Header user={user} />
      <main id="main-content" className="pb-0 pt-0">
        <Hero cta={heroCta} />
        <ClaimProgress progress={claim_progress} />
        <IndustryReality />
        <FeatureChapters />
        <Reveal>
          <HomeCtaBar summary={claim_progress.summary} next={claim_progress.next_action} />
        </Reveal>
      </main>
    </>
  );
}
