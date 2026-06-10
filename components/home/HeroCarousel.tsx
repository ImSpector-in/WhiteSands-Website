"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src:     "/assets/images/new%20pictures/KohalaSide.jpg",
    alt:     "Kohala Coast resort project",
    tagline: "Resort & Commercial Work",
  },
  {
    src:     "/assets/images/new%20pictures/Kaunaoa.jpg",
    alt:     "Kaunaoa Bay — Mauna Kea",
    tagline: "Hawaii's Premier General Contractor",
  },
  {
    src:     "/assets/images/new%20pictures/MaunaKea1.jpg",
    alt:     "Mauna Kea Beach Hotel",
    tagline: "Fine Craftsmanship Since 1988",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const total   = slides.length;
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, reduced]);

  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden" aria-label="Hero slideshow">
      {/* Preload all slides so transitions don't flicker */}
      {slides.map((slide, i) => (
        <div key={slide.src} className="absolute inset-0" aria-hidden>
          <Image
            src={slide.src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Animated fade layer for transitions */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          aria-label={slides[current].alt}
        >
          <Image
            src={slides[current].src}
            alt={slides[current].alt}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55" />

      {/* Slide-synced tagline — screen center */}
      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.p
            key={slides[current].tagline}
            className="font-heading font-light text-white/90 uppercase tracking-[0.3em] text-2xl md:text-3xl lg:text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {slides[current].tagline}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-colors duration-200 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-colors duration-200 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 right-10 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 cursor-pointer ${
              i === current ? "bg-accent" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
