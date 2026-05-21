"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import InteractiveBentoGallery, { type MediaItemType } from "@/components/ui/interactive-bento-gallery";

const mediaItems: MediaItemType[] = [
  // Wide tall — hero card
  {
    id: 1,
    type: "image",
    title: "Fairmont Orchid — 540 Room Remodel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/Fairmont%20Orchid%20540%20Room%20Remodel/1.jpg",
    span: "md:col-span-2 md:row-span-4 sm:col-span-2 sm:row-span-3 col-span-1 row-span-3",
  },
  {
    id: 2,
    type: "image",
    title: "Hawaii Prince Waikiki",
    desc: "Hotels & Resorts • Honolulu, HI",
    url: "/assets/images/Hawaii%20Prince%20Waikiki/1.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Mauna Kea Beach Hotel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/Mauna%20Kea%20Beach/2.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 4,
    type: "image",
    title: "Fairmont Orchid — 540 Room Remodel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/Fairmont%20Orchid%20540%20Room%20Remodel/11.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 5,
    type: "image",
    title: "Ruth's Chris — Mauna Lani",
    desc: "Restaurants • Kohala Coast, HI",
    url: "/assets/images/Ruth%27s%20Chris%20Mauna%20Lani/1.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 6,
    type: "image",
    title: "Mauna Lani Spa",
    desc: "Spa & Wellness • Kohala Coast, HI",
    url: "/assets/images/Mauna%20Lani%20SPA/2.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 7,
    type: "image",
    title: "Hawaii Prince Waikiki",
    desc: "Hotels & Resorts • Honolulu, HI",
    url: "/assets/images/Hawaii%20Prince%20Waikiki/4.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 8,
    type: "image",
    title: "Sheraton Coffee Shop",
    desc: "Restaurants • Waikiki, HI",
    url: "/assets/images/Sheraton%20Coffee%20Shop/1.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 9,
    type: "image",
    title: "Ruth's Chris — Waikiki",
    desc: "Restaurants • Honolulu, HI",
    url: "/assets/images/Ruth%27s%20Chris%20Waikiki/2.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 10,
    type: "image",
    title: "Mauna Kea Beach Hotel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/Mauna%20Kea%20Beach/5.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 11,
    type: "image",
    title: "Mauna Kea — Front Tower Remodel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/Mauna%20Kea%20Beach%20Front%20Tower%20101%20Room%20Remodel/1.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 12,
    type: "image",
    title: "Mauna Lani Spa",
    desc: "Spa & Wellness • Kohala Coast, HI",
    url: "/assets/images/Mauna%20Lani%20SPA/4.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 13,
    type: "image",
    title: "Fairmont Orchid — 540 Room Remodel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/Fairmont%20Orchid%20540%20Room%20Remodel/13.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 14,
    type: "image",
    title: "Ruth's Chris — Mauna Lani",
    desc: "Restaurants • Kohala Coast, HI",
    url: "/assets/images/Ruth%27s%20Chris%20Mauna%20Lani/3.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 15,
    type: "image",
    title: "Sheraton Coffee Shop",
    desc: "Restaurants • Waikiki, HI",
    url: "/assets/images/Sheraton%20Coffee%20Shop/3.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 16,
    type: "image",
    title: "Ruth's Chris — Waikiki",
    desc: "Restaurants • Honolulu, HI",
    url: "/assets/images/Ruth%27s%20Chris%20Waikiki/4.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
];

export default function BentoPortfolio() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="flex flex-wrap items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wide mb-3">
              Our Work
            </h2>
            <div className="w-14 h-1 bg-accent" />
          </div>
          <Link
            href="/gallery"
            className="font-heading font-bold text-xs uppercase tracking-widest border-2 border-primary text-primary px-6 py-3 rounded transition-colors duration-200 hover:bg-primary hover:text-white shrink-0"
          >
            View Full Gallery
          </Link>
        </motion.div>

        {/* Bento grid */}
        <InteractiveBentoGallery mediaItems={mediaItems} />
      </div>
    </section>
  );
}
