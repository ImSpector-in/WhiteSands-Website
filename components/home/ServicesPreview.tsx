"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Building2, Home, Star } from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Commercial Construction",
    desc:  "Large-scale commercial builds and tenant improvements for businesses across the Hawaiian Islands.",
  },
  {
    icon: Home,
    title: "Custom Home Building",
    desc:  "Thoughtfully designed custom homes built to your vision, with quality craftsmanship inside and out.",
  },
  {
    icon: Star,
    title: "Hotel & Resort Remodeling",
    desc:  "Extensive renovation experience with Hawaii's premier hotels — Fairmont, Mauna Kea, Sheraton, and more.",
  },
];

const container: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.15 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ServicesPreview() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading font-black text-3xl md:text-4xl uppercase tracking-wide mb-3">
            What We Build
          </h2>
          <div className="w-14 h-1 bg-accent mb-5" />
          <p className="text-gray-500 max-w-lg leading-relaxed">
            From luxury hotel renovations to custom homes, our in-house crews deliver craftsmanship across the Hawaiian Islands.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
          variants={container}
          initial={false}
          animate="show"
        >
          {services.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={card} className="text-center">
              <div className="flex justify-center mb-5">
                <Icon size={52} className="text-primary" strokeWidth={1.3} />
              </div>
              <h3 className="font-heading font-bold text-sm uppercase tracking-wide mb-3">
                {title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-block font-heading font-bold text-xs uppercase tracking-widest border-2 border-primary text-primary px-7 py-3.5 rounded transition-colors duration-200 hover:bg-primary hover:text-white"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
