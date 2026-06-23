"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Category = "all" | "hotels" | "restaurants" | "spa" | "retail" | "healthcare";

interface GalleryItem {
  src:      string;
  alt:      string;
  name:     string;
  category: Category;
  cat:      string;
}

const items: GalleryItem[] = [
  // ── MOST RECENT — top of grid (per client 6/15) ──────────────────────────
  // Kings' Shops Waikoloa
  { src: "/assets/images/new%20pictures/Outdoor%20Seating%20-%20Before.jpg", alt: "Kings' Shops Common Area — Before",                       name: "Kings' Shops Common Area — Before",                       category: "retail", cat: "Retail & Commercial" },
  { src: "/assets/images/new%20pictures/Outdoor%20Seating.jpg",              alt: "Kings' Shops Common Area — After (Outdoor Seating)",      name: "Kings' Shops Common Area — After (Outdoor Seating)",      category: "retail", cat: "Retail & Commercial" },
  { src: "/assets/images/new%20pictures/Lululemon.jpg",                      alt: "Kings' Shops Common Area — After (Lululemon)",            name: "Kings' Shops Common Area — After (Lululemon)",            category: "retail", cat: "Retail & Commercial" },
  { src: "/assets/images/new%20pictures/Restroom%20Walkway.jpg",             alt: "Kings' Shops — Restroom Renovation (Walkway)",    name: "Kings' Shops — Restroom Renovation (Walkway)",    category: "retail", cat: "Retail & Commercial" },
  { src: "/assets/images/new%20pictures/Kings%20Shops%20Restroom%201.jpg", alt: "Kings' Shops — Restroom Renovation", name: "Kings' Shops — Restroom Renovation", category: "retail", cat: "Retail & Commercial" },
  { src: "/assets/images/new%20pictures/Kings%20Shops%20Restroom%202.jpg", alt: "Kings' Shops — Restroom Renovation", name: "Kings' Shops — Restroom Renovation", category: "retail", cat: "Retail & Commercial" },
  // Mauna Kea Salon
  { src: "/assets/images/new%20pictures/Salon%20Treatment%20Area.jpg",     alt: "Mauna Kea Salon", name: "Mauna Kea Salon", category: "spa", cat: "Spa & Wellness" },
  { src: "/assets/images/new%20pictures/Salon%20Lobby.jpg",                alt: "Mauna Kea Salon", name: "Mauna Kea Salon", category: "spa", cat: "Spa & Wellness" },
  { src: "/assets/images/new%20pictures/Mauna%20Kea%20Salon%203.jpg",     alt: "Mauna Kea Salon", name: "Mauna Kea Salon", category: "spa", cat: "Spa & Wellness" },
  { src: "/assets/images/new%20pictures/Mauna%20Kea%20Salon%204.jpg",     alt: "Mauna Kea Salon", name: "Mauna Kea Salon", category: "spa", cat: "Spa & Wellness" },
  { src: "/assets/images/new%20pictures/Mauna%20Kea%20Salon%205.jpg",     alt: "Mauna Kea Salon", name: "Mauna Kea Salon", category: "spa", cat: "Spa & Wellness" },
  // Kona Hospital Oncology Department
  { src: "/assets/images/new%20pictures/Hospital%20Oncology%201.jpg", alt: "Kona Hospital Oncology Department", name: "Kona Hospital — Oncology Department", category: "healthcare", cat: "Hospital & Healthcare" },
  { src: "/assets/images/new%20pictures/Hospital%20Oncology%202.jpg", alt: "Kona Hospital Oncology Department", name: "Kona Hospital — Oncology Department", category: "healthcare", cat: "Hospital & Healthcare" },
  { src: "/assets/images/new%20pictures/Kona%20Hospital%20Pharmacy%201.jpg",               alt: "Kona Hospital Pharmacy", name: "Kona Hospital — Pharmacy", category: "healthcare", cat: "Hospital & Healthcare" },
  { src: "/assets/images/new%20pictures/Kona%20Hospital%20Pharmacy%20Compound%20Suite.jpg", alt: "Kona Hospital Pharmacy", name: "Kona Hospital — Pharmacy", category: "healthcare", cat: "Hospital & Healthcare" },

  // ── HIGH-RES NEW PHOTOS ───────────────────────────────────────────────────
  { src: "/assets/images/new%20pictures/KohalaSide.jpg",                         alt: "Kohala Coast",              name: "Kohala Coast Resort",          category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/MaunaKea1.jpg",                          alt: "Mauna Kea Beach Hotel",     name: "Mauna Kea Beach Hotel",        category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/MaunaKea2.jpg",                          alt: "Mauna Kea Beach Hotel",     name: "Mauna Kea Beach Hotel",        category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/Kaunaoa.jpg",                            alt: "Kaunaoa",                   name: "Kaunaoa",                      category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20Ballroom%201.jpg", alt: "Prince Waikiki Ballroom", name: "Prince Waikiki — Ballroom",    category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/Boardroom.jpg",                          alt: "Boardroom",                 name: "Boardroom",                    category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/Sexton.jpg",                             alt: "Sexton",                    name: "Sexton",                       category: "hotels",      cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/Manta%20Lounge.jpg",                     alt: "Manta Lounge",              name: "Manta Lounge",                 category: "restaurants", cat: "Restaurants" },
  { src: "/assets/images/new%20pictures/MantaPDR.jpg",                           alt: "Manta Private Dining",      name: "Manta — Private Dining Room",  category: "restaurants", cat: "Restaurants" },
  { src: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%201.jpg", alt: "Prince Waikiki 100 Sails", name: "Prince Waikiki — 100 Sails", category: "restaurants", cat: "Restaurants" },
  { src: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%202.jpg", alt: "Prince Waikiki 100 Sails", name: "Prince Waikiki — 100 Sails", category: "restaurants", cat: "Restaurants" },
  { src: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%203.jpg", alt: "Prince Waikiki 100 Sails", name: "Prince Waikiki — 100 Sails", category: "restaurants", cat: "Restaurants" },
  { src: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%204.jpg", alt: "Prince Waikiki 100 Sails", name: "Prince Waikiki — 100 Sails", category: "restaurants", cat: "Restaurants" },
  { src: "/assets/images/new%20pictures/Prince%20Waikiki%20-%20100%20Sails%205.jpg", alt: "Prince Waikiki 100 Sails", name: "Prince Waikiki — 100 Sails", category: "restaurants", cat: "Restaurants" },

  // ── ADDED 6/9 — FAIRMONT ORCHID ──────────────────────────────────────────
  { src: "/assets/images/new%20pictures/Fairmont%20Orchid%20-%20Gold%20Lounge.jpg",              alt: "Fairmont Orchid — Gold Lounge",              name: "Fairmont Orchid — Gold Lounge",              category: "hotels", cat: "Hotels & Resorts" },
  { src: "/assets/images/new%20pictures/Fairmont%20Orchid%20-%20Gold%20Lounge%20Food%20Display.jpg", alt: "Fairmont Orchid — Gold Lounge", name: "Fairmont Orchid — Gold Lounge", category: "hotels", cat: "Hotels & Resorts" },

  // ── HOTELS & RESORTS — existing ──────────────────────────────────────────
  // Hawaii Prince Waikiki — unique scenes not covered by new photos (100 Sails bar/dining removed as duplicates)
  { src: "/assets/images/Hawaii%20Prince%20Waikiki/5.jpg", alt: "Hawaii Prince Waikiki", name: "Hawaii Prince Waikiki", category: "hotels", cat: "Hotels & Resorts" },
  { src: "/assets/images/Hawaii%20Prince%20Waikiki/6.jpg", alt: "Hawaii Prince Waikiki", name: "Hawaii Prince Waikiki", category: "hotels", cat: "Hotels & Resorts" },
  { src: "/assets/images/Hawaii%20Prince%20Waikiki/7.jpg", alt: "Hawaii Prince Waikiki", name: "Hawaii Prince Waikiki", category: "hotels", cat: "Hotels & Resorts" },
  ...["1","2"].map((n) => ({
    src:      `/assets/images/Mauna%20Kea%20Beach%20Front%20Tower%20101%20Room%20Remodel/${n}.jpg`,
    alt:      "Mauna Kea Beach Front Tower 101 Room Remodel",
    name:     "Mauna Kea — Front Tower 101 Room Remodel",
    category: "hotels" as Category,
    cat:      "Hotels & Resorts",
  })),
  // Fairmont Orchid — skip low-res /1.jpg and duplicate /13.jpg (same room as /10.jpg)
  ...["8","10","11","12","14"].map((n) => ({
    src:      `/assets/images/Fairmont%20Orchid%20540%20Room%20Remodel/${n}.jpg`,
    alt:      "Fairmont Orchid 540 Room Remodel",
    name:     "Fairmont Orchid — 540 Room Remodel",
    category: "hotels" as Category,
    cat:      "Hotels & Resorts",
  })),

  // ── SPA & WELLNESS ───────────────────────────────────────────────────────
  { src: "/assets/images/Mauna%20Lani%20SPA/1%20%281%29.jpg", alt: "Mauna Lani Spa", name: "Mauna Lani Spa", category: "spa", cat: "Spa & Wellness" },
  ...["2","3","4","5"].map((n) => ({
    src:      `/assets/images/Mauna%20Lani%20SPA/${n}.jpg`,
    alt:      "Mauna Lani Spa",
    name:     "Mauna Lani Spa",
    category: "spa" as Category,
    cat:      "Spa & Wellness",
  })),

  // ── RESTAURANTS — existing ───────────────────────────────────────────────
  ...["1","2","3","4","5","6"].map((n) => ({
    src:      `/assets/images/Ruth%27s%20Chris%20Mauna%20Lani/${n}.jpg`,
    alt:      "Ruth's Chris Mauna Lani",
    name:     "Ruth's Chris — Mauna Lani",
    category: "restaurants" as Category,
    cat:      "Restaurants",
  })),
  { src: "/assets/images/Ruth%27s%20Chris%20Waikiki/1%20%281%29.jpg", alt: "Ruth's Chris Waikiki", name: "Ruth's Chris — Waikiki", category: "restaurants", cat: "Restaurants" },
  ...["2","3","4","5","6"].map((n) => ({
    src:      `/assets/images/Ruth%27s%20Chris%20Waikiki/${n}.jpg`,
    alt:      "Ruth's Chris Waikiki",
    name:     "Ruth's Chris — Waikiki",
    category: "restaurants" as Category,
    cat:      "Restaurants",
  })),
  ...["1","2","3","4","5","6"].map((n) => ({
    src:      `/assets/images/Sheraton%20Coffee%20Shop/${n}.jpg`,
    alt:      "Sheraton Coffee Shop",
    name:     "Sheraton Coffee Shop",
    category: "restaurants" as Category,
    cat:      "Restaurants",
  })),
];

const filters: { label: string; value: Category }[] = [
  { label: "All Projects",        value: "all" },
  { label: "Hotels & Resorts",    value: "hotels" },
  { label: "Restaurants",         value: "restaurants" },
  { label: "Spa & Wellness",      value: "spa" },
  { label: "Retail & Commercial", value: "retail" },
  { label: "Healthcare",          value: "healthcare" },
];

export default function GalleryGrid() {
  const [active, setActive]               = useState<Category>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visible = active === "all" ? items : items.filter((i) => i.category === active);
  const selectedItem = selectedIndex !== null ? visible[selectedIndex] : null;

  const closeLightbox = () => setSelectedIndex(null);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev > 0 ? prev - 1 : visible.length - 1) : null
    );
  }, [visible.length]);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) =>
      prev !== null ? (prev < visible.length - 1 ? prev + 1 : 0) : null
    );
  }, [visible.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")      closeLightbox();
      if (e.key === "ArrowLeft")   goPrev();
      if (e.key === "ArrowRight")  goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIndex, goPrev, goNext]);

  // Close lightbox when filter changes
  useEffect(() => { setSelectedIndex(null); }, [active]);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center" role="group" aria-label="Filter projects">
        {filters.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={`font-heading font-semibold text-xs uppercase tracking-widest px-5 py-2.5 rounded border-2 transition-colors duration-200 cursor-pointer ${
              active === value
                ? "border-primary text-primary bg-primary/5"
                : "border-gray-300 text-gray-500 hover:border-primary hover:text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {/* initial={false}: cards render visible on first load (mount animations are
            unreliable in this static export); filter changes still animate. */}
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.div
              key={item.src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
              onClick={() => setSelectedIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end p-4">
                <p className="font-heading font-bold text-xs uppercase tracking-wide text-white">{item.name}</p>
                <p className="text-accent text-[0.68rem] uppercase tracking-widest mt-1">{item.cat}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/92"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev */}
            {selectedIndex! > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next */}
            {selectedIndex! < visible.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image container */}
            <motion.div
              key={selectedIndex}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="relative mx-4 sm:mx-12 lg:mx-20 max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.src}
                alt={selectedItem.alt}
                className="w-full max-h-[82vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg px-5 py-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-heading font-bold text-sm uppercase tracking-wide text-white">{selectedItem.name}</p>
                <p className="text-accent text-[0.68rem] uppercase tracking-widest mt-1">{selectedItem.cat}</p>
              </div>
            </motion.div>

            {/* Counter */}
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs tabular-nums">
              {selectedIndex! + 1} / {visible.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
