"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Category = "all" | "hotels" | "restaurants" | "spa";

interface GalleryItem {
  src:      string;
  alt:      string;
  name:     string;
  category: Category;
  cat:      string;
}

const items: GalleryItem[] = [
  // Hotels & Resorts — Fairmont Orchid
  ...["1","8","10","11","12","13","14"].map((n) => ({
    src:      `/assets/images/Fairmont%20Orchid%20540%20Room%20Remodel/${n}.jpg`,
    alt:      "Fairmont Orchid 540 Room Remodel",
    name:     "Fairmont Orchid — 540 Room Remodel",
    category: "hotels" as Category,
    cat:      "Hotels & Resorts",
  })),
  // Hotels & Resorts — Hawaii Prince Waikiki
  ...["1","2","3","4","5","6","7"].map((n) => ({
    src:      `/assets/images/Hawaii%20Prince%20Waikiki/${n}.jpg`,
    alt:      "Hawaii Prince Waikiki",
    name:     "Hawaii Prince Waikiki",
    category: "hotels" as Category,
    cat:      "Hotels & Resorts",
  })),
  // Hotels & Resorts — Mauna Kea Beach
  { src: "/assets/images/Mauna%20Kea%20Beach/1%20%281%29.jpg", alt: "Mauna Kea Beach Hotel", name: "Mauna Kea Beach Hotel", category: "hotels", cat: "Hotels & Resorts" },
  ...["2","3","4","5","6","7"].map((n) => ({
    src:      `/assets/images/Mauna%20Kea%20Beach/${n}.jpg`,
    alt:      "Mauna Kea Beach Hotel",
    name:     "Mauna Kea Beach Hotel",
    category: "hotels" as Category,
    cat:      "Hotels & Resorts",
  })),
  // Hotels & Resorts — Mauna Kea Front Tower
  ...["1","2"].map((n) => ({
    src:      `/assets/images/Mauna%20Kea%20Beach%20Front%20Tower%20101%20Room%20Remodel/${n}.jpg`,
    alt:      "Mauna Kea Beach Front Tower 101 Room Remodel",
    name:     "Mauna Kea — Front Tower 101 Room Remodel",
    category: "hotels" as Category,
    cat:      "Hotels & Resorts",
  })),
  // Spa & Wellness — Mauna Lani SPA
  { src: "/assets/images/Mauna%20Lani%20SPA/1%20%281%29.jpg", alt: "Mauna Lani Spa", name: "Mauna Lani Spa", category: "spa", cat: "Spa & Wellness" },
  ...["2","3","4","5"].map((n) => ({
    src:      `/assets/images/Mauna%20Lani%20SPA/${n}.jpg`,
    alt:      "Mauna Lani Spa",
    name:     "Mauna Lani Spa",
    category: "spa" as Category,
    cat:      "Spa & Wellness",
  })),
  // Restaurants — Ruth's Chris Mauna Lani
  ...["1","2","3","4","5","6"].map((n) => ({
    src:      `/assets/images/Ruth%27s%20Chris%20Mauna%20Lani/${n}.jpg`,
    alt:      "Ruth's Chris Mauna Lani",
    name:     "Ruth's Chris — Mauna Lani",
    category: "restaurants" as Category,
    cat:      "Restaurants",
  })),
  // Restaurants — Ruth's Chris Waikiki
  { src: "/assets/images/Ruth%27s%20Chris%20Waikiki/1%20%281%29.jpg", alt: "Ruth's Chris Waikiki", name: "Ruth's Chris — Waikiki", category: "restaurants", cat: "Restaurants" },
  ...["2","3","4","5","6"].map((n) => ({
    src:      `/assets/images/Ruth%27s%20Chris%20Waikiki/${n}.jpg`,
    alt:      "Ruth's Chris Waikiki",
    name:     "Ruth's Chris — Waikiki",
    category: "restaurants" as Category,
    cat:      "Restaurants",
  })),
  // Restaurants — Sheraton Coffee Shop
  ...["1","2","3","4","5","6"].map((n) => ({
    src:      `/assets/images/Sheraton%20Coffee%20Shop/${n}.jpg`,
    alt:      "Sheraton Coffee Shop",
    name:     "Sheraton Coffee Shop",
    category: "restaurants" as Category,
    cat:      "Restaurants",
  })),
];

const filters: { label: string; value: Category }[] = [
  { label: "All Projects",    value: "all" },
  { label: "Hotels & Resorts", value: "hotels" },
  { label: "Restaurants",     value: "restaurants" },
  { label: "Spa & Wellness",  value: "spa" },
];

export default function GalleryGrid() {
  const [active, setActive] = useState<Category>("all");

  const visible = active === "all" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-12" role="group" aria-label="Filter projects">
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
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.div
              key={item.src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: i * 0.02 }}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-107"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end p-4">
                <p className="font-heading font-bold text-xs uppercase tracking-wide text-white">
                  {item.name}
                </p>
                <p className="text-accent text-[0.68rem] uppercase tracking-widest mt-1">
                  {item.cat}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
