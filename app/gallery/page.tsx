import { Metadata } from "next";
import PageHero   from "@/components/PageHero";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import CtaBanner  from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Gallery | White Sands Construction",
  description:
    "Browse White Sands Construction's portfolio — luxury hotel renovations, restaurants, spa facilities, and more across Hawaii.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        title="Our Work"
        subtitle="Projects across Hawaii's finest hotels, restaurants, and residences"
        bgImage="/assets/images/new%20pictures/MaunaKea2.jpg"
      />
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <GalleryGrid />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
