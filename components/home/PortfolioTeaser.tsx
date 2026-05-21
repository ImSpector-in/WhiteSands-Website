"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const projects = [
  {
    src:   "/assets/images/Fairmont%20Orchid%20540%20Room%20Remodel/1.jpg",
    alt:   "Fairmont Orchid 540 Room Remodel",
    label: "Fairmont Orchid — 540 Room Remodel",
  },
  {
    src:   "/assets/images/Hawaii%20Prince%20Waikiki/1.jpg",
    alt:   "Hawaii Prince Waikiki",
    label: "Hawaii Prince Waikiki",
  },
  {
    src:   "/assets/images/Mauna%20Kea%20Beach/2.jpg",
    alt:   "Mauna Kea Beach Hotel",
    label: "Mauna Kea Beach Hotel",
  },
  {
    src:   "/assets/images/Mauna%20Lani%20SPA/2.jpg",
    alt:   "Mauna Lani Spa",
    label: "Mauna Lani Spa",
  },
  {
    src:   "/assets/images/Ruth%27s%20Chris%20Waikiki/2.jpg",
    alt:   "Ruth's Chris Waikiki",
    label: "Ruth's Chris — Waikiki",
  },
  {
    src:   "/assets/images/Sheraton%20Coffee%20Shop/1.jpg",
    alt:   "Sheraton Coffee Shop",
    label: "Sheraton Coffee Shop",
  },
];

export default function PortfolioTeaser() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="flex flex-wrap items-end justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wide mb-3">
              Featured Projects
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(({ src, alt, label }, i) => (
            <motion.div
              key={src}
              className="group relative aspect-[4/3] overflow-hidden rounded-sm cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <span className="font-heading font-bold text-xs uppercase tracking-wide text-white">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
