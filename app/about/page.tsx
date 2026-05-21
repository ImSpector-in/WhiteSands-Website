import { Metadata } from "next";
import PageHero  from "@/components/PageHero";
import StatsBar  from "@/components/StatsBar";
import CtaBanner from "@/components/CtaBanner";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About | White Sands Construction",
  description:
    "White Sands Construction Inc. — Building Hawaii since 1988. Learn about our history, crew, and why contractors and developers trust us across the Hawaiian Islands.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Building Hawaii's finest properties since 1988"
        bgImage="/assets/images/Mauna%20Kea%20Beach/5.jpg"
      />
      <AboutContent />
      <StatsBar />
      <CtaBanner
        title="Let's Build Something Great."
        subtitle="Tell us about your project and we'll get back to you promptly."
      />
    </>
  );
}
