"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import InteractiveBentoGallery, { type MediaItemType } from "@/components/ui/interactive-bento-gallery";

const mediaItems: MediaItemType[] = [
  {
    id: 1,
    type: "image",
    title: "Kohala Coast",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/new%20pictures/KohalaSide.jpg",
    span: "md:col-span-2 md:row-span-4 sm:col-span-2 sm:row-span-3 col-span-1 row-span-3",
  },
  {
    id: 2,
    type: "image",
    title: "Mauna Kea Beach Hotel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/new%20pictures/MaunaKea1.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 3,
    type: "image",
    title: "Mauna Kea Beach Hotel",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/new%20pictures/MaunaKea2.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 4,
    type: "image",
    title: "Prince Waikiki — 100 Sails Restaurant",
    desc: "Restaurants • Honolulu, HI",
    url: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%201.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 5,
    type: "image",
    title: "Boardroom",
    desc: "Commercial • Hawaii",
    url: "/assets/images/new%20pictures/Boardroom.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 6,
    type: "image",
    title: "Kaunaoa",
    desc: "Hotels & Resorts • Kohala Coast, HI",
    url: "/assets/images/new%20pictures/Kaunaoa.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 7,
    type: "image",
    title: "Prince Waikiki — Ballroom",
    desc: "Hotels & Resorts • Honolulu, HI",
    url: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20Ballroom%201.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 8,
    type: "image",
    title: "Manta Lounge",
    desc: "Restaurants • Kohala Coast, HI",
    url: "/assets/images/new%20pictures/Manta%20Lounge.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 10,
    type: "image",
    title: "Manta — Private Dining",
    desc: "Restaurants • Kohala Coast, HI",
    url: "/assets/images/new%20pictures/MantaPDR.jpg",
    span: "md:col-span-2 md:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 9,
    type: "image",
    title: "Prince Waikiki — 100 Sails Restaurant",
    desc: "Restaurants • Honolulu, HI",
    url: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%202.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 11,
    type: "image",
    title: "Prince Waikiki — 100 Sails Restaurant",
    desc: "Restaurants • Honolulu, HI",
    url: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%203.jpg",
    span: "md:col-span-1 md:row-span-3 sm:col-span-1 sm:row-span-2 col-span-1 row-span-2",
  },
  {
    id: 12,
    type: "image",
    title: "Prince Waikiki — 100 Sails Restaurant",
    desc: "Restaurants • Honolulu, HI",
    url: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%204.jpg",
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
          initial={false}
          animate={{ opacity: 1, y: 0 }}
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
