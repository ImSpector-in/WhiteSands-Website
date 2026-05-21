import HeroCarousel   from "@/components/home/HeroCarousel";
import HomeIntro      from "@/components/home/HomeIntro";
import BentoPortfolio from "@/components/home/BentoPortfolio";
import CtaBanner      from "@/components/CtaBanner";

export default function HomePage() {
  return (
    <>
      {/* Hero is pinned — content scrolls over it */}
      <div className="sticky top-0 z-0 -mt-20">
        <HeroCarousel />
      </div>

      {/* Page content slides up and covers the hero */}
      <div className="relative z-10 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.18)]">
        <HomeIntro />
        <BentoPortfolio />
        <CtaBanner />
      </div>
    </>
  );
}
